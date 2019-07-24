const db = require("../models");

module.exports = {
  findAll: function(req, res) {
    db.Task
      .findAll({user_id: req.query})
      .sort({ updated_at: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function(req, res) {
    if(!req.user) {return res.redirect("/login")}
    else{
      db.Task
        .findAll(req.params.user_id)
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
      }
    },
  create: function(req, res) {
    console.log("taskController create req.body = ", req.body.title)
    db.Task
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  update: function(req, res) {
    db.Task
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: function(req, res) {
    db.Task
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};
