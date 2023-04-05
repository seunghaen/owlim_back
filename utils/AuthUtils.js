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

exports.retrieveToken = (headers) => {
  if (headers && headers.authorization) {
    const tokens = headers.authorization.split(" ");
    if (tokens && tokens.length === 2) {
      return tokens[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

exports.AuthUtils = {
  isValidToken,
  retrieveToken,
};
