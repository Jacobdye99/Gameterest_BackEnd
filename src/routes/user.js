import express from 'express'
import defaultController from '../controllers/defaultController.js'
import { fetchAllUsers, deleteUser, findUser, updateUser } from '../controllers/user/user.controller.js'
import { signUpUser } from '../controllers/auth/authController.js'


const Router = express.Router()

Router.get("/", defaultController)

  .get("/users", fetchAllUsers)

  .delete("/delete/:id", deleteUser)

  .get("/users/:id", findUser)

  .put("/update/:id", updateUser)

  .post("/signup", signUpUser)





export default Router