import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// @ts-ignore - passport-microsoft doesn't have type definitions
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import User from '../models/User';

export const configurePassport = () => {
  // Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            let user = await User.findOne({
              provider: 'google',
              providerId: profile.id,
            });

            if (!user) {
              user = await User.findOne({ email: profile.emails?.[0]?.value });

              if (user) {
                user.provider = 'google';
                user.providerId = profile.id;
                user.avatar = profile.photos?.[0]?.value;
                await user.save();
              } else {
                user = await User.create({
                  email: profile.emails?.[0]?.value,
                  name: profile.displayName,
                  avatar: profile.photos?.[0]?.value,
                  provider: 'google',
                  providerId: profile.id,
                });
              }
            }

            return done(null, user);
          } catch (error) {
            return done(error as Error, undefined);
          }
        }
      )
    );
  }

  // Microsoft OAuth Strategy
  if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET) {
    passport.use(
      new MicrosoftStrategy(
        {
          clientID: process.env.MICROSOFT_CLIENT_ID,
          clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
          callbackURL: process.env.MICROSOFT_CALLBACK_URL || '/auth/microsoft/callback',
          scope: ['user.read'],
        },
        async (accessToken: string, refreshToken: string, profile: any, done: any) => {
          try {
            let user = await User.findOne({
              provider: 'microsoft',
              providerId: profile.id,
            });

            if (!user) {
              user = await User.findOne({ email: profile.emails?.[0]?.value });

              if (user) {
                user.provider = 'microsoft';
                user.providerId = profile.id;
                user.avatar = profile.photos?.[0]?.value;
                await user.save();
              } else {
                user = await User.create({
                  email: profile.emails?.[0]?.value,
                  name: profile.displayName,
                  avatar: profile.photos?.[0]?.value,
                  provider: 'microsoft',
                  providerId: profile.id,
                });
              }
            }

            return done(null, user);
          } catch (error) {
            return done(error as Error, undefined);
          }
        }
      )
    );
  }

  passport.serializeUser((user: any, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};
