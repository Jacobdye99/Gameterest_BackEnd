import errorHandler from "../utilities/error.js";

const defaultController = (req, res, next) => {
    res.json(errorHandler(false, "Home", "Welcome to the internet"))
}

export default defaultController