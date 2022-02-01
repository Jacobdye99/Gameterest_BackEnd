import express from 'express'
import defaultController from '../controllers/defaultController.js'


const Router = express.Router()

Router.get("/", defaultController)



export default Router