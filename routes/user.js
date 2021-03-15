const {Router} = require("express")
const router = Router()

const {catchErrors} = require("../handlers/errorHandlers")
const userController = require("../controllers/userController")

router.post("/login", catchErrors(userController.login))
router.post("/register", catchErrors(userController.register))

module.exports = router