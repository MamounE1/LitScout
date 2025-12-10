import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcrypt';
import pool from '../db/database.js';

passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];

      if (!user) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let result = await pool.query('SELECT * FROM users WHERE google_id = $1', [profile.id]);
        let user = result.rows[0];

        if (!user) {
          const email = profile.emails[0].value;
          const username = profile.displayName || email.split('@')[0];
          
          result = await pool.query(
            'INSERT INTO users (username, email, google_id) VALUES ($1, $2, $3) RETURNING *',
            [username, email, profile.id]
          );
          user = result.rows[0];
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));
}

export default passport;
