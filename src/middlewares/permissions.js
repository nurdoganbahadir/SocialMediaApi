"use strict";

module.exports = {
  isLogin: (req, res, next) => {
    if (!req.user) {
      res.status(401).send({
        error: true,
        message: "Unauthorized. Please log in.",
      });
    }
    next();
  },
};
