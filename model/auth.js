const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const authSchema = mongoose.Schema({
    email: {
        type: String,
        // \\validator : [validator.isEmail, 'Email is invalid'],
    },

     first_name: {
        type: String
    },
    
    last_name: {
        type: String
    },

     nationality: {
        type: String
    },
     
      state: {
        type: String
    },
      
       city: {
        type: String
    },
      
       LGA: {
        type: String
    },
      
       age: {
        type: String
    },
    
        last_name: {
        type: String
    },
        
         status: {
        type: String
    },
         
    password: {
        type: String
    },
    username: {
        type: String
    },

    confirmPassword: {
        type: String,
        required: [true, 'please comfirm your password'],
        validate: {
            validator: function (el) {
                return el === this.password
            },
            msg: "password mismatch"
        }
    }
})

authSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

authSchema.methods.comparePasswords = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch 
}

authSchema.methods.createJWT = function () {
    return jwt.sign(
        {id: this._id, username: this.username, password : this.password},
        process.env.JWT_SECRET,
        {expiresIn : process.env.JWT_EXPIRES})
}

 module.exports = mongoose.model('Auth', authSchema)