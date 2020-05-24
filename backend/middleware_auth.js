/*


This Custom Middleware provides
Basic HTTP Authentification for
every Site it is used on.


*/

const UserModel = require('./user')

module.exports = {
    requireAuthCheck: (req, res, next) => {
        // console.log('[Pathname : ' + req._parsedUrl.pathname + '] - ' + '[User ID : ' + req.session.user_id + '] - ' + '[Signed in : ' + req.session.signed_in + '] ')
        if(req._parsedUrl.pathname !== '/') {
            next();
        } else {
            if (req.session.signed_in && req.session.user_id) {
                UserModel.findOne({ user_id: req.session.user_id },  function (err, user) {
                    if (err) {
                      console.error(err)
                      return res.send('/error');
                    } else {
                        // TODO -> check if the user has an access key
                        next()
                    }
                })
            } else {
                return res.redirect('/signin')
            }
        }
    }
}
