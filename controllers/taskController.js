const db = require("../models");

module.exports = {
  findAll: function(req, res) {
    console.log("req.params.id", req.params.id)
    db.Task
      .findAll({where: {user_uuid: req.params.id}, order: [['updatedAt', 'DESC']]})
      // .order({ updated_at: "DESC" })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.redirect("/login"));
  },
  findOne: function(req, res) {
    console.log("req.params.id", req.params.id)

    db.Task
      .findOne({where: {id: req.params.id}})
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
    
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
