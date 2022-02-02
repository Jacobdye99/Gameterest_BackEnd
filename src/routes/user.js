import express from 'express';
import defaultController from '../controllers/defaultController.js';
import { fetchAllUsers, deleteUser, findUser, updateUser, getComments, addComment } from '../controllers/user/user.controller.js';
import { signUpUser, loginUser, logoutUser } from '../controllers/auth/authController.js';


const Router = express.Router();

Router.get("/", defaultController)

  .get("/users", fetchAllUsers)

  .delete("/delete/:id", deleteUser)

  .get("/users/:id", findUser)

  .put("/update/:id", updateUser)

  .post("/signup", signUpUser)

  .post("/login", loginUser)

  .get("/logout", logoutUser)

  .get('/user/comment/:id', getComments)

  .post('/comment/:id', addComment);







export default Router;
