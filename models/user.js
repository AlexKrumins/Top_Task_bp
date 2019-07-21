// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const userSchema = new Schema({
//   _id: Schema.Types.ObjectId,
//   email: { type: String, required: true },
//   password: {type: String, required: true},
//   tasks: [{type: Schema.Types.ObjectId, ref: "Task"}]
// });

// const User = mongoose.model("User", userSchema);

// module.exports = User;
var bcrypt = require("bcrypt-nodejs");

module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define("User", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
  });

  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  
  User.addHook("beforeCreate", function(user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  });
  
  User.associate = function(models) {
    // Associating Chef with Burgers
    // When an Chef is deleted, also delete any associated Burgers
    User.hasMany(models.Task, {
      onDelete: "cascade"
    });
  };
  
  return User;
};
