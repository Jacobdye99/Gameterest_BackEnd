import User from '../../models/user.js';
import errorHandler from '../../utilities/error.js';

export const fetchAllUsers = (req, res) => {
  try {
    const allUsers = User.find(
      {}, {
      _id: 1,
      userName: 1,
      firstName: 1,
      lastName: 1,
      email: 1,
      avatar: 1,
    }
    );
    if (allUsers) {
      return res.json(errorHandler(false, "Fetching all Users", allUsers))
    } else {
      return res.json(errorHandler(true, "Error Fetching all Users"))
    }
  }
  catch (error) {
    return res.json(errorHandler(true, "Error Fetching all Users"))
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
      { userName: req.params.userName },
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