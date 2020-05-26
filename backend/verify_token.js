/*


This Custom Script is to
verify the id_token from Google's Api


*/

// Including our config file
const CONFIG = require('./config');
const jwt = require('jsonwebtoken');

module.exports = {
    verify_google : async (oauth2Client, id_token) => {
        const ticket = await oauth2Client.verifyIdToken({
            idToken: id_token,
            audience: CONFIG.oauth2Credentials.client_id,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
        return payload
    },
    verify_jwt : function VerifyJWT (user_jwt) {
        var decoded_jwt;
        jwt.verify(user_jwt, config.JWT_sec, function (err, decoded) {
            if (err) {
                console.error(err)
                return false
            } else {
                decoded_jwt = decoded
            }
        })
        return decoded_jwt
    }
}