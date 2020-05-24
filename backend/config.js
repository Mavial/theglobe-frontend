var port = 8080;
var baseURL = `http://localhost:${port}`;
require('dotenv').config()

if (process.env.PRODUCTION === 'true') {
  port = 80;
  baseURL = `https://app.globn.de`;
}

module.exports = {
  // The secret for the encryption for the session
  SessionSecret: process.env.SESSION_SECRET,
  baseURL: baseURL,
  port: port,
  // The credentials and information for OAuth2
  oauth2Credentials: {
    client_id: "672422666473-5njm9gr168t84s7keu72qhkqr27cp0v1.apps.googleusercontent.com",
    project_id: "inner-precept-277717", // The name of your project
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: process.env.CLIENT_SECRET,
    redirect_uris: [
      `${baseURL}/auth_callback`
    ],
    scopes: [
      'email',
      'profile',
      'openid'
    ]
  },
  DB: {
    host: 'lrsv.de',
    port: '27137',
    username: process.env.MONGOUSER,
    password: process.env.MONGOPASS,
    name: 'theglobe'
  }
};
