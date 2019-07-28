const db = require("../models");

module.exports = {
  findAll: function(req, res) {
    db.Task
      .findAll({user_uuid: req.query, order: [['updatedAt', 'DESC']]})
      // .order({ updated_at: "DESC" })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  // findById: function(req, res) {
  //   if(!req.user) {return res.redirect("/login")}
  //   else{
  //     db.Task
  //       .findAll(req.params.user_uuid)
  //       .then(dbModel => res.json(dbModel))
  //       .catch(err => res.status(422).json(err));
  //     }
  //   },
  create: function(req, res) {
    console.log("taskController create req.body = ", req.body.title)
    db.Task
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  update: function(req, res) {
    console.log("req", req.body)
    db.Task
      .update(req.body, {where: { id: req.body.id }} )
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: function(req, res) {
    db.Task
      .destroy({ where: {id: req.params.id }})
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};
