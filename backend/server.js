const express = require('express');
const path = require('path');
const google = require('googleapis').google;
const bodyParser = require('body-parser')
const session = require('express-session')
const UserModel = require('./user')
// Middleware
const mw = require('./middleware_auth');
// Google's OAuth2 client
const OAuth2 = google.auth.OAuth2;
// Including our config file
const CONFIG = require('./config');
// Including verify_id_token
const verify_id_token = require('./verify_token');
// Creating our express application
const app = express();

require('dotenv').config()

// Express
var sess = {
  secret: CONFIG.SessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {}
};
var reactBuild = '/../build';
if (process.env.PRODUCTION === 'true') {
  app.set('trust proxy', 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
  sess.cookie.maxAge = 2 * 24 * 60 * 60 * 1000; // days * hours * minutes * seconds * milliseconds
  sess.httpOnly = true;
  var reactBuild = 'build';
  // app.use(function (req, res, next) {
  //   if (req.connection.encrypted) {
  //     next()
  //   } else {
  //     if (req._parsedUrl.pathname === '/error') {
  //       next()
  //     }
  //     res.render('error')
  //   }
  // });
} else if (process.env.SIMULATION === 'true') {
  var reactBuild = 'build';
} else {};
app.use(session(sess));
app.use(bodyParser.json());
app.use(mw.requireAuthCheck);
app.set('view engine', 'ejs');
app.set('views', __dirname);
app.use(express.static(path.join(__dirname, reactBuild)));



app.get('/signin', function (req, res) {
  if (req.session.signed_in) {
    res.redirect('/');
  } else {
    res.render("signin");
  }
});

// Auth Callback
app.post('/auth_callback', function (req, res) {
  // Create an OAuth2 client object from the credentials in our config file
  if (!req.body.id_token) {
    // The user did not give us permission.
    console.error('error')
    return res.send('/error');
  } else {
    const oauth2Client = new OAuth2(CONFIG.oauth2Credentials.client_id, CONFIG.oauth2Credentials.client_secret, CONFIG.oauth2Credentials.redirect_uris[0]);
    verify_id_token.verify_function(oauth2Client, req.body.id_token)
      .then(response =>  {
        UserModel.findOne({ user_id: response.sub },  function (err, user) {
          if (err) {
            console.error(err)
            return res.send('/error');
          } else {
            if (user) {
              console.log('user already in database');
              req.session.signed_in = true;
              req.session.user_id = user.user_id
              return res.send('/')
            } else {
              console.log("setting up new user")
              var user = new UserModel({
                user_id: response.sub,
                email: response.email,
                admin: false,
                user_data: {
                  verified_email: response.email_verified,
                  name: response.name,
                  given_name: response.given_name,
                  family_name: response.family_name,
                  picture: response.picture,
                  locale: response.locale,
                }
              })
              user.save()
                .then(doc => {
                  console.log("succesfull saved user to DB");
                  req.session.signed_in = true;
                  req.session.user_id = doc.user_id
                  return res.send('/')
                })
                .catch(err => {
                  console.log('Error when trying to save the user in DB')
                  console.error(err)
                })
            }
          }
        });
      })
      .catch(err => {
        console.error(err)
        return res.send('/error');
      });
  }
});

// app.get('/user_session', function (req, res) {

// });

app.get('/signout', function(req,res) {
  res.render('signout')
});

app.post('/signout_callback', function (req, res) {
  if (req.session) {
    req.session.destroy();
  }
  res.send('/signin')
});

app.get('/error', function (req, res) {
  res.render('error')
});

app.get('/', function (req, res) {
  return res.sendFile(path.join(__dirname, reactBuild, 'index.html'));
});


app.listen(CONFIG.port, function () {
  console.log(`Listening on port ${CONFIG.port}`);
});