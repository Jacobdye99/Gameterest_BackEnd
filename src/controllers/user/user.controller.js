
import mongoose from 'mongoose';
import { User, Comment, Favorite } from '../../models/user.js';
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
      favorites: 1,
      isAdmin: 1,
    }
    );
    if (allUsers) {
      return res.json(errorHandler(false, "Fetching all Users", allUsers));
    } else {
      return res.status(403).json(errorHandler(true, "Error Fetching Users"));
    };
  }
  catch (error) {
    return res.status(400).json(errorHandler(true, "Error Fetching all Users"));
  };
};

export const deleteUser = (req, res) => {
  try {
    User.findByIdAndRemove(
      req.params.id, { new: true }, (error, deletedUser) => {
        if (deletedUser) {
          return res.json(errorHandler(false, "User Deleted"));
        } else {
          return res.json(errorHandler(true, "Error deleting user", deletedUser));
        };
      });
  } catch (error) {
    return res.json(errorHandler(true, "Error deleting user"));
  };
};

export const updateUser = (req, res) => {
  try {
    User.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true },
      (error, updatedUser) => {
        if (updatedUser) {
          return res.json(errorHandler(false, "User has been updated", updatedUser));
        } else {
          return res.json(errorHandler(true, "Error updating user", {
            error: error.message
          }));
        };
      }
    );
  }
  catch (error) {
    return res.json(errorHandler(true, "Error updating user"))
  };
};

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
        }));
      } else {
        return res.json(errorHandler(true, "Issues locating user"))
      };
    });
  } catch (error) {
    return res.json(errorHandler(true, "Issues locating user"))
  };
};

export const addComment = (req, res) => {
  try {
    User.findById(req.params.id, (error, user) => {
      if (error) {
        res.json(errorHandler(true, "Error finding user", { error: error.message }))
      };
      // const newComment = { ...req.body };
      Comment.create(req.body, (error, comment) => {
        if (error) {
          res.json(errorHandler(true, "error creating comment"))
        }
        user.comments.push(comment);
        user.save((error) => {
          console.log(error)
          return res.json(errorHandler(false, "Happy commenting", comment))
        });
      });
    });
  } catch (error) {
    res.json(errorHandler(true, "Error commenting", { error: error.message }))
  };
};

export const getComments = (req, res) => {
  try {
    User.findById(req.params.id).populate("comments").exec((error, comments) => {
      if (comments) {
        res.json(errorHandler(false, "here are your comments",  comments.comments ))
      } else {
        res.json(errorHandler(true, "error getting users comments", { error }))
      }
    });
  } catch (error) {
    res.json(errorHandler(true, "error fetching comments"))

  };
};

export const deleteComment = (req, res) => {
  console.log(req.params.userid, req.params.id)
  try {
    User.findByIdAndUpdate(req.params.userid, 
      {
        $pull:{
          comments: { _id: req.params.id},
        }
      },
      { new: true }, (error, comment) => {
        if(error) {
          return res.json(errorHandler(true, "error deleting comment"))
        } else {
          res.json(errorHandler(false, "deleting comment", comment.comments))
        }
      }
      ) 
  } catch (error) {
    return res.json(errorHandler(true, "Error with Comment"))
  }
};

export const updateComment = (req, res) => {
  try {
    User.findOneAndUpdate({ _id: req.params.userid, comments: { $elemMatch: { _id:mongoose.Types.ObjectId(req.params.id) }}},
    { $set: {
      'comments.$.comment': req.body.comment,
      'comments.$.likes': req.body.likes,
      // 'comments.$.game': req.body.game
    },
  },
  { 'new': true, 'upsert': true }, (error, comment) => {
    if (error) {
      return res.json(errorHandler(true, "Issues updating a comment"))
    } else {
      res.json(errorHandler(false, "updating Comment", comment.comments))
    }
  }
    )
  } catch (error) {
    return res.json(errorHandler(true, "Error updating comment"))
  }
}

export const addFavorite = (req, res) => {
  try {
    User.findById(req.params.id, (error, user) => {
      if (error) {
        res.json(errorHandler(true, "Error finding user", { error: error.message }))
      }
   
      
      const newFavorite = new Favorite({
        gameId: req.body.gameId,
        name: req.body.name,
        image: req.body.image
      })
      
      Favorite.create(req.body, (error, favorite) => {
        if (error) {
          res.json(errorHandler(true, "error adding Favorite"))
        }
        let i = 0
        while (i < user.favorites.length - 1) {
          i++
          // console.log(user.favorites[i].name)
          if (user.favorites[i].name.includes(newFavorite.name)) {
            return res.send(errorHandler(true, "already in your favorites"))
          }
        }
        // console.log(i)
        
        user.favorites.push(favorite) 
        user.save((error) => {
          // console.log(error)
          return res.json(errorHandler(false, "Added a favorite", favorite))
        })
        
        
      });
    });
  
  } catch (error) {
    res.json(errorHandler(true, "Error Favoriting", { error: error.message }))
  }
};


export const getFavorites = (req, res) => {
  try {
    User.findById(req.params.id).populate("favorites").exec((error, favorites) => {
      // console.log(favorites)
      if (favorites) {
        res.json(errorHandler(false, "here are your favorites",  favorites.favorites ))
      } else {
        res.json(errorHandler(true, "error getting users favorites", { error }))
      }
    });
  } catch (error) {
    res.json(errorHandler(true, "error fetching favorites"))

  }
};

export const deleteFavorite = (req, res) => {
  // console.log(req.params.userid, req.params.id)
  try {
    User.findByIdAndUpdate(req.params.userid, 
      {
        $pull:{
          favorites: { _id: req.params.id},
        }
      },
      { new: true }, (error, favorite) => {
        if(error) {
          return res.json(errorHandler(true, "error deleting favorite"))
        } else {
          res.json(errorHandler(false, "deleting favorite", favorite.favorites))
        }
      }
      ) 
  } catch (error) {
    return res.json(errorHandler(true, "Error with favorites delete"))
  }
};
