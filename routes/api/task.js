const router = require("express").Router();
const taskController = require("../../controllers/taskController");

// Matches with "/api/task"
router.route("/")
  // .get(taskController.findById)
  .post(taskController.create)
  .put(taskController.update);

router.route("/by/:id")
  .get(taskController.findOne);  
  // Matches with "/api/task/:id"
router.route("/:id")
  .get(taskController.findAll)
  .delete(taskController.remove);

module.exports = router;
