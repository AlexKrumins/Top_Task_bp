
// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const taskSchema = new Schema({
//   title: { type: String, required: true },
//   start: { type: Date, default: Date.now, required: true},
//   end: { type: Date, default: Date.now, required: true},
//   created: { type: Date, default: Date.now, required: true},
//   notes: String,
//   user: { type: Schema.Types.ObjectId, ref: "User"}
// });

// const Task = mongoose.model("Task", taskSchema);

// module.exports = Task;

module.exports = function(sequelize, DataTypes) {
  const Task = sequelize.define("Task", {
    title: { 
      type: DataTypes.STRING, 
      allowNull: false,
    },      
    start: { 
      type: DataTypes.TIME, 
      default: null
    },
    end: { 
      type: DataTypes.TIME, 
      default: null, 
    },
    notes: {
      type: DataTypes.STRING,
      default: null,
    },
    taskCreated: {
      type: DataTypes.DATE, 
      default: null,
    }
  });

  Task.associate = function(models) {
    Task.belongsTo(models.User, {
      foreignKey: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });
  };

  return Task;
};
