const Auth = require('../model/auth')
const jwt = require('jsonwebtoken')
// const username = payload.username
// const {StatusCodes} = require('http-status-codes')


exports.registerPage = (req, res) => {
    return res.render(`register`, { title: 'REGISTER' })
}


exports.loginPage = (req, res) => {
    return res.render(`login`, {title: 'LOGIN'} )
}


exports.dashboardPage = (req, res) => {
    try {
            const token = req.cookies.token
    const payload = jwt.verify(token, process.env.JWT_SECRET)
        const username = payload.username.toString().toLocaleUpperCase()
        const axios = require("axios");

        

const options = {
  method: 'GET',
  url: 'https://dad-jokes.p.rapidapi.com/random/joke',
  headers: {
    'X-RapidAPI-Key': 'f8079261c0msh925c645df19afb4p1b786ajsna9df3ea6591f',
    'X-RapidAPI-Host': 'dad-jokes.p.rapidapi.com'
  }
};

axios.request(options).then(function (response) {
    console.log(response.data.body);
    // response.json(data)
    const array = response.data.body[0].setup
    console.log(array);
    return res.render(`dashboard`, { title: 'DASHBOARD', msg:  array  })
}).catch(function (error) {
	console.error(error);
});
    
    } catch (error) {
        console.log(error)
        return res.status(500).json({error : error.message})
    }
}

exports.home = (req, res) => {
    return res.render(`home`, {title: 'Home'} )
}

exports.quote = (req, res) => {
    return res.render(`quote`, {title: 'quote'} )
}
// exports.dashboardPage = (req, res) => {
//     const token = req.cookies.token
//     const payload = jwt.verify(token, process.env.JWT_SECRET)
//     const username = payload.username.toString().toLocaleUpperCase()
//     return res.render('dashboard', {title : 'DASHBOARD', layout : "main", msg : username})
// }




exports.register = async (req, res) => {
    try {
        const { email, password, username } = req.body
    
        if (!email || !password || !username) {
            console.log('please provide all  the required information')
            return res.status(500).render('register', { msg: 'please provide all  the required information' })
        }

        const user = await Auth.findOne({ email })
    
        if (user) {
            console.log('User already exist')
            return res.status(400)
    
        }
        const newUser = await Auth.create({ ...req.body })
        const token = newUser.createJWT()

        const nodemailer = require('nodemailer')
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.email,
                pass: process.env.password
            }
        })

        const mailOptions = {
            from: 'solomonenemali419@gmail.com',
            to: req.body.email,
            subject: "GREETINGS",
            html: '<a href="https://www.w3schools.com/"></a>'
        }

        transport.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err)
            }
            console.log(info)
        })
        
        // console.log(token)
        res.cookie('token', token, { httpOnly: true, secure: false })

        return res.status(201).redirect('login')
    }
     catch (error) {
             return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('register', {msg: error.message})
        }
        
    }
    
      
    



exports.login = async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await Auth.findOne({email})
        
        if (!user) {
            console.log('User doese not exist in our our data base')
            return res.status(400).render('login',{msg: 'User dose not exist'})
        }
        
        const userExist = await user.comparePasswords(password)
        
        if (!userExist) {
            return res.status(400).render("render", {msg :'password is incorrect'})
        }

        const token = user.createJWT()
        
        res.cookie('token', token, {
            httpOnly: true, secure
                : false})

    return res.status(200).redirect('dashboard')
    } catch (error) {
        console.log(error)
    }
}

exports.logout = (req, res) => {
    try {
        res.clearCookie('token')
        return res.status(200).redirect('register')
    } catch (error) {
        console.log(error)
    }
}

// module.exports = {
//     register,
//     login
// }
//  exports.login = (req, res) => {
//     console.log('login route')
//      res.send('hello')

