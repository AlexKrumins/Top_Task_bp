const router = require("express").Router();
const taskController = require("../../controllers/taskController");

// Matches with "/api/task"
router.route("/")
  .get(taskController.findById)
  .post(taskController.create);

// Matches with "/api/task/:id"
router.route("/:id")
  .get(taskController.findAll)
  .put(taskController.update)
  .delete(taskController.remove);

module.exports = router;
