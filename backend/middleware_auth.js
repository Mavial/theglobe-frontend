/*


This Custom Middleware provides
Basic HTTP Authentification for
every Site it is used on.


*/

const UserModel = require('./user');
const verify_token = require('./verify_token')

module.exports = {
    requireAuthCheck: (req, res, next) => {
        // console.log('[Pathname : ' + req._parsedUrl.pathname + '] - ' + '[User ID : ' + req.session.user_id + '] - ' + '[Signed in : ' + req.session.signed_in + '] ')
        if(req._parsedUrl.pathname !== '/') {
            next();
        } else {
            if (req.cookies.jwt) {
                try {
                    var verified_jwt = verify_token.verify_jwt(req.cookies.jwt)
                    if (verified_jwt && (verified_jwt.expires > Date.now())) {
                        UserModel.findOne({ user_id: verified_jwt.user_id },  function (err, user) {
                            if (err) {
                              console.error(err)
                              return res.redirect('/error');
                            } else {
                                // TODO -> check if the user has an access key
                                next()
                            }
                        })
                    } else {
                        return res.redirect('/signout')
                    }
                } catch (error) {
                    console.error(error)
                    return res.redirect('/error');
                }
            } else {
                return res.redirect('/signin')
            }
        }
    }
}
