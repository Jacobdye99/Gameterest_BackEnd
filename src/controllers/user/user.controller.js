import { User } from '../../models/user.js';
import errorHandler from '../../utilities/error.js';

export const fetchAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find(
      {}, {
      _id: 1,
      userName: 1,
      firstName: 1,
      lastName: 1,
      email: 1,
      avatar: 1,
      comments: 1,
      isAdmin: 1,
    }
    );
    if (allUsers) {
      return res.json(errorHandler(false, "Fetching all Users", allUsers))
    } else {
      return res.status(403).json(errorHandler(true, "Error Fetching Users"))
    }
  }
  catch (error) {
    return res.status(400).json(errorHandler(true, "Error Fetching all Users"))
  }
}

export const deleteUser = (req, res) => {
  try {
    User.findByIdAndRemove(
      req.params.id, { new: true }, (error, deletedUser) => {
        if (deletedUser) {
          return res.json(errorHandler(false, "User Deleted"))
        } else {
          return res.json(errorHandler(true, "Error deleting user", deletedUser))
        }
      });
  } catch (error) {
    return res.json(errorHandler(true, "Error deleting user"))
  }
}

export const updateUser = (req, res) => {
  try {
    User.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true },
      (error, updatedUser) => {
        if (updatedUser) {
          return res.json(errorHandler(false, "User has been updated", updatedUser))
        } else {
          return res.json(errorHandler(true, "Error updating user", {
            error: error.message
          }))
        }
      }
    )
  }
  catch (error) {
    return res.json(errorHandler(true, "Error updating user"))
  }
}

export const findUser = (req, res) => {
  try {
    User.findById(req.params.id, (error, foundUser) => {
      if (foundUser) {
        const { userName, firstName, lastName, email, createdAt, posts } = foundUser;
        return res.json(errorHandler(false, "User identified", {
          user: {
            userName,
            name: `${firstName} ${lastName}`,
            email,
            member_since: createdAt
          }
        }))
      } else {
        return res.json(errorHandler(true, "Issues locating user"))
      }
    })
  } catch (error) {
    return res.json(errorHandler(true, "Issues locating user"))
  }
}