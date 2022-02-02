import { User, Comment } from '../../models/user.js';
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
        const { userName, firstName, lastName, email, createdAt, comments } = foundUser;
        return res.json(errorHandler(false, "User identified", {
          user: {
            userName,
            name: `${firstName} ${lastName}`,
            email,
            member_since: createdAt,
            comments
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

export const addComment = async (req, res) => {
  try {
    User.findById(req.params.id, (error, user) => {
      if (error) {
        res.json(errorHandler(true, "Error finding user", {error: error.message}))
      }
      const newComment = {...req.body}
      Comment.create(newComment, (error, comment) => {
        if (error) {
          res.json(errorHandler(true, "error creating comment"))
        }
        user.comments.push(newComment)
        user.save((error) => {
          return res.redirect(`/api/user/comment/${user.id}`)
        })
      })
    })
  } catch (error) {
    res.json(errorHandler(true, "Error commenting", {error: error.message}))
  }
}

export const getComments = async (req, res) => {
  try {
    User.findById(req.params.id).populate("comments").exec((error, comments) => {
      if (comments) {
        res.json(errorHandler(false, "here are your comments", {comments}))
      } else {
        res.json(errorHandler(true, "error getting users comments", {error}))
      }
    })
  } catch (error) {
    res.json(errorHandler(true, "error fetching comments"))
  }
}