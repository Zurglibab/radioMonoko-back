import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserDAO } from '../DAO/userDAO';
import { v4 as uuidv4 } from 'uuid';

const userDAO = new UserDAO();

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const defaultCallback = '/auth/google/callback';

export const isGoogleOAuthConfigured = Boolean(googleClientId && googleClientSecret);

if (isGoogleOAuthConfigured) {
  passport.use(new GoogleStrategy({
    clientID: googleClientId as string,
    clientSecret: googleClientSecret as string,
    callbackURL: defaultCallback
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails && profile.emails[0] && profile.emails[0].value;
      if (!email) {
        return done(new Error('No email found in Google profile'));
      }

      let user = await userDAO.findByEmail(email);
      if (user && (user as any).is_banned) {
        return done(new Error('Votre compte a été banni.'));
      }
      if (!user) {

        const newUser = {
          id: uuidv4(),
          username: profile.displayName || email.split('@')[0],
          email,
          password: ''
        };
        user = await userDAO.create(newUser as any);
      }

      return done(null, user);
    } catch (err) {
      return done(err as Error);
    }
  }));
} else {

  console.warn('Google OAuth not configured: please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable /auth/google');
}

export default passport;