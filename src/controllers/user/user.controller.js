import User from '../../models/user.js';
import errorHandler from '../../utilities/error.js';

export const fetchAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find(
      {}, {
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