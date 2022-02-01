import express from 'express'
import defaultController from '../controllers/defaultController.js'
import { fetchAllUsers, deleteUser, findUser, updateUser } from '../controllers/user/user.controller.js'


const Router = express.Router()

Router.get("/", defaultController)

  .get("/users", fetchAllUsers)

  .delete("/delete", deleteUser)

  .get("/users/:id", findUser)

  .put("/update/:id", updateUser)



export default Router