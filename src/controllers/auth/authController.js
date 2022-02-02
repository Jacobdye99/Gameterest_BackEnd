import { User } from "../../models/user.js"
import errorHandler from '../../utilities/error.js'
import { securePassword } from '../../utilities/securePassword.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const createToken = id => {
  const secret = process.env.SECRET;
  return jwt.sign({ id }, secret, { expiresIn: 84000 });
}

export const authRequired = (req, res, next) => {
  const secret = process.env.SECERET;
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, secret, (error, decodedTkn) => {
      if (error) {
        return res.status(401).json(errorHandler(true, "Auth Error"))
          .redirect("/login");
      } else {
        next();
      }
    })
  } else {
    res.status(401).json(errorHandler(true, "Auth Error"))
  }
};

export const signUpUser = (req, res) => {
  try {
    const existingUser = User.findOne({
      email: req.body.email,
      userName: req.body.userName,
    }).lean(true)
    // if (existingUser) {
    //   return res.json(errorHandler(true, "A user already exists with these creditials"))
    // }

    const newUser = new User({
      userName: req.body.userName.toLowerCase(),
      firstName: req.body.firstName.toLowerCase(),
      lastName: req.body.lastName.toLowerCase(),
      email: req.body.email.toLowerCase(),
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      avatar: req.body.avatar,
      // comments: [commentSchema],
      // favorites: [favoriteSchema],
      isAdmin: req.body.isAdmin,
    })
    if (newUser) {
      const token = createToken(newUser._id);
      res.cookie("jwt", token, { maxAge: 84000 });
      newUser.password = securePassword(newUser.password);
      newUser.confirmPassword = newUser.password

      res.json(errorHandler(false, `Hi! ${newUser.firstName.toUpperCase()}! A warm welcome to my user API!`,
        { user: newUser._id }
      )
      )
      newUser.save()
    } else {
      return res.json(errorHandler(true, "Error registering a new user"))
    }

  } catch (error) {
    console.log(error.message)
    return res.json(errorHandler(true, "Error registering a new user"))

  }
}

export const loginUser = (req, res) => {
  try {
    const user = User.findUser({
      email: req.body.email.toLowerCase(),
    }, { confirmPassword: 0 })

    if (!user) {
      return res.json(errorHandler(true, "A user with this email does not exist"))
    }
    const auth = bcrypt.compare(req.body.password, user.password);

    if (!auth) {
      return res.json(errorHandler(true, "Password is incorrect"))
    }

    const { userName } = user;
    const token = createToken(user._id);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.json(errorHandler(false, `Welcome back, ${userName}`, {
      user,
      token,
    }))
  } catch (error) {
    return res.json(errorHandler(true, "Trouble logging in user"))
  }
}

export const logoutUser = (req, res) => {
  res.cookie('jwt', "", { maxAge: 1 })
  res.redirect("/")
}