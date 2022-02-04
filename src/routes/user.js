
import express from 'express'
import defaultController from '../controllers/defaultController.js'
import { fetchAllUsers, deleteUser, findUser, updateUser, getComments, addComment, deleteComment, updateComment, addFavorite, getFavorites, deleteFavorite } from '../controllers/user/user.controller.js'
import { signUpUser, loginUser, logoutUser, authRequired } from '../controllers/auth/authController.js'



const Router = express.Router();

Router.get("/", defaultController)

  .get("/users", fetchAllUsers)

  .delete("/delete/:id", deleteUser)

  .get("/users/:id", findUser)

  .put("/update/:id", updateUser)

  .post("/signup", signUpUser)

  .post("/login", loginUser)

  .get("/logout", logoutUser)

  .get('/user/comments/:id', getComments)

  .post('/comment/:id',authRequired , addComment)

  .delete('/delete/:userid/:id', authRequired, deleteComment)

  .put("/update/comment/:userid/:id", authRequired, updateComment)

  .post('/favorite/:id', addFavorite)

  .get('/user/favorites/:id', getFavorites)

  .delete('/delete/favorite/:userid/:id', authRequired, deleteFavorite)



export default Router;
