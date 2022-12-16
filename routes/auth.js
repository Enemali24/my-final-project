
const express = require ('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authentication')

const {register, login, registerPage, loginPage, dashboardPage, logout, home, quote} = require('../controllers/auth')

router.route('/register').get(registerPage)
router.route('/login').get(loginPage)
router.route('/dashboard').get(dashboardPage)

router.route('/logout').get(logout)


router.route('/register').post(register)
router.route('/login').post(login)
router.route('/home').get(home)
router.route('/quote').get(quote)
 
module.exports = router