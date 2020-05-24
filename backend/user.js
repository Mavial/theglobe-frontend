let mongoose = require('./db')

let userSchema = new mongoose.Schema({
    user_id: String,
    email: String,
    admin: Boolean,
    access_key: Object,
    user_data: {
      verified_email: Boolean,
      name: String,
      given_name: String,
      family_name: String,
      picture: String,
      locale: String,
      hd: String
    }
}, { timestamps: true })

module.exports = mongoose.model('users', userSchema)