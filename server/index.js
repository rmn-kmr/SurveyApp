const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys=require('./config/keys');
const app = express();

mongoose.connect(keys.mongooseURI);
require('./models/User');

const User = mongoose.model('users');

app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge : 30 * 24 * 60 * 60 * 1000,
    keys : [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/billingRoutes')(app);
passport.serializeUser((user,done)=> {
  done(null, user.id);

});

passport.deserializeUser((id, done) => {
  User.findById(id)
  .then(user => {
    done(null, user);
  });
});

passport.use(new GoogleStrategy(
  {
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL:'/auth/google/callback',
    proxy:true
  },

  async (accessToken, refreshToken,profile,done)=> {
    const existingUser = await User.findOne({googleID:profile.id});

      if(existingUser) {
        // we alreayd have a record with the given profile ID
        return done(null, existingUser);
      }
        //we don't have a user record
      const user = await new User({googleID : profile.id }).save()
      done(null, user);

}));


app.get('/auth/google', passport.authenticate('google',{
  scope: ['profile', 'email']
}))
app.get(
  '/auth/google/callback',
  passport.authenticate('google'),
  (req,res) => {
      res.redirect('/surveys');
  }
);

app.get('/api/logout', (req,res) => {
  req.logout();
  res.redirect('/');

});
app.get('/api/current_user' , (req,res) => {
  res.send(req.user);
});

if(process.env.NODE_ENV === 'production') {
  // Expresss will serve up production assets
  // Like our main.js file, or main.css file!
app.use(express.static('client/build'));
  // Expresss will serve up the index.html file
  // if it doesn't recognize the route

const path = require('path');
app.get('*', (req,res) => {
  res.snedFile(path.reslove(__dirname,'client','build','index.html'));

});

}


const PORT = process.env.PORT || 5000;

app.listen(PORT);
