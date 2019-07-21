// const db = require('../models');

module.exports = {
  login: async (req, res) => {
    res.json(req.user);
  },
  user_data: (req, res) => {
    if (!req.user) {
      res.json({});
    } 
    else {
      res.json({
        email: req.user.email,
        id: req.user.id
      })
    };
  },

};
