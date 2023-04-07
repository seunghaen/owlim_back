const jwt = require("jsonwebtoken");

exports.isValidToken = (token) => {
  try {
    jwt.verify(token, process.env.JWT_SECRET_OR_KEY);
    return true;
  } catch (error) {
    // error
    return false;
  }
};
