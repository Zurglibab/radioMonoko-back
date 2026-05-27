import { Router, Request, Response } from 'express';
import passport, { isGoogleOAuthConfigured } from '../config/passport';
import * as jwt from 'jsonwebtoken';

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
    console.log('[auth] redirecting to Google auth URL:', url);
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

export default router;