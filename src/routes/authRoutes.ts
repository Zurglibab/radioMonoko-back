import { Router, Request, Response } from 'express';
import passport, { isGoogleOAuthConfigured } from '../config/passport';
import * as jwt from 'jsonwebtoken';
import { authMiddleware } from '../middlewares/auth.middleware';
import { getClient } from '../config/RedisConnexion';
import { UserDAO } from '../DAO/userDAO';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const userDAO = new UserDAO();

const router = Router();

/**
 * @openapi
 * /auth/google:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Démarrer l'authentification Google OAuth2
 *     responses:
 *       302:
 *         description: Redirection vers Google OAuth
 *       500:
 *         description: Google OAuth non configuré
 */

if (isGoogleOAuthConfigured) {
  // Init Google OAuth2 login
  // Note: we build the Google authorization URL and redirect explicitly to ensure
  // the `scope` and other params are always present (helps when proxies or
  // browser extensions interfere with redirects).
  router.get('/google', (req: Request, res: Response) => {
    const clientId = process.env.GOOGLE_CLIENT_ID || '';
    const redirectUri = process.env.GOOGLE_CALLBACK_URL || '';
    const scope = 'profile email';

    if (!clientId || !redirectUri) {
      return res.status(500).json({ message: 'Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.' });
    }

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope,
      access_type: 'offline',
      include_granted_scopes: 'true',
      prompt: 'select_account'
    });

    const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    // Use structured logger
    try { const logger = require('../config/logger').default; logger.info('[auth] redirecting to Google auth URL: ' + url); } catch {}
    return res.redirect(url);
  });

  /**
   * @openapi
   * /auth/google/callback:
   *   get:
   *     tags:
   *       - Auth
   *     summary: Callback Google OAuth2
   *     responses:
   *       200:
   *         description: Authentification réussie, JWT renvoyé
   *       401:
   *         description: Authentification échouée
   *       500:
   *         description: Erreur d'authentification
   */
  router.get('/google/callback', (req: Request, res: Response, next) => {
    passport.authenticate('google', { session: false }, (err: any, user: any) => {
      if (err) return res.status(500).json({ message: 'Authentication error', error: err.message });
      if (!user) return res.status(401).json({ message: 'Authentication failed' });

      // Create JWT - require a configured secret
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        console.error('[auth] JWT_SECRET is not configured');
        return res.status(500).json({ message: 'Server misconfigured: JWT_SECRET missing' });
      }
      const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'];
      const token = jwt.sign({ id: user.id, email: user.email }, secret as jwt.Secret, { expiresIn });

      const mobileRedirect = req.query.state;
      if (typeof mobileRedirect === 'string' && mobileRedirect.startsWith('exp://')) {
        return res.redirect(`${mobileRedirect}?token=${encodeURIComponent(token)}`);
      }

      // Return token and user info. Alternatively, redirect to frontend with token
      return res.status(200).json({ token, user: { id: user.id, email: user.email } });
    })(req, res, next);
  });
} else {
  router.get('/google', (_req: Request, res: Response) => {
    res.status(500).json({ message: 'Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.' });
  });
  router.get('/google/callback', (_req: Request, res: Response) => {
    res.status(500).json({ message: 'Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.' });
  });
}

/**
 * @openapi
 * /auth/failure:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Route de fallback en cas d'échec d'authentification
 *     responses:
 *       401:
 *         description: Authentification échouée
 */

// Simple failure route
router.get('/failure', (req: Request, res: Response) => {
  res.status(401).json({ message: 'Authentication failed' });
});

// Logout: revoke the current token by adding it to Redis blacklist
router.post('/logout', authMiddleware, async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(400).json({ message: 'Token required' });
  }
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.decode(token) as any;
    const redis = getClient();
    let ttlSeconds = 60 * 60 * 24; // default 24h
    if (decoded?.exp) {
      const now = Math.floor(Date.now() / 1000);
      ttlSeconds = Math.max(1, decoded.exp - now);
    }
    if (redis?.isOpen) {
      await redis.set(`blacklist:${token}`, '1', { EX: ttlSeconds });
    }
    return res.status(200).json({ message: 'Logged out' });
  } catch (err) {
    console.error('[auth/logout] Error revoking token', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @openapi
 * /auth/google-mobile:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Connexion Google OAuth2 pour application mobile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - googleToken
 *             properties:
 *               googleToken:
 *                 type: string
 *                 description: Token Google (ID token ou Access token) récupéré par l'application mobile
 *     responses:
 *       200:
 *         description: Authentification réussie, JWT renvoyé
 *       400:
 *         description: googleToken manquant ou invalide
 *       401:
 *         description: Authentification Google échouée
 *       500:
 *         description: Erreur serveur
 */
router.post('/google-mobile', async (req: Request, res: Response) => {
  const { googleToken } = req.body;
  if (!googleToken) {
    return res.status(400).json({ success: false, error: 'googleToken is required' });
  }

  let email: string | undefined;

  // 1) Essayer de vérifier en tant qu'id_token
  try {
    const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`);
    email = response.data.email;
  } catch (idTokenError) {
    // 2) Fallback: essayer de récupérer les infos de l'utilisateur avec l'access_token
    try {
      const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${googleToken}` }
      });
      email = response.data.email;
    } catch (accessTokenError) {
      console.error('[auth] Google token verification failed:', idTokenError, accessTokenError);
      return res.status(401).json({ success: false, error: 'Invalid Google token' });
    }
  }

  if (!email) {
    return res.status(400).json({ success: false, error: 'No email associated with this Google token' });
  }

  try {
    let user = await userDAO.findByEmail(email);
    if (!user) {
      const newUser = {
        id: uuidv4(),
        email,
        password: '' // Mot de passe vide pour l'authentification OAuth
      };
      user = await userDAO.create(newUser as any);
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('[auth] JWT_SECRET is not configured');
      return res.status(500).json({ success: false, error: 'Server misconfigured: JWT_SECRET missing' });
    }
    const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'];
    const token = jwt.sign({ id: user.id, email: user.email, role :user.role}, secret, { expiresIn });

    return res.status(200).json({
      success: true,
      token,
      user: { id: user.id, email: user.email }
    });
  } catch (dbError: any) {
    console.error('[auth] Database operation failed during Google mobile login:', dbError);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;



