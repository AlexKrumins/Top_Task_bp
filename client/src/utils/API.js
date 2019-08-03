import axios from "axios";

export default {

  // Gets the tasks with the given user_id
  getTasks: function(uuid) {
    return axios.get("/api/task/" + uuid);
  },

  getTaskInfo: function(id) {
    return axios.get("/api/task/by/" + id);
  },
  deleteTask: function(id) {
    return axios.delete("/api/task/" + id);
  },
  updateTask: function(taskData) {
    return axios.put("/api/task/", taskData);
  },
  // Saves a book to the database
  saveTask: function(taskData) {
    return axios.post("/api/task/", taskData);
  },
  signupUser: function(userData) {
    return axios.post("/api/user/signup", userData)
  },
  loginUser: function(userData) {
    return axios.post("/api/auth/login", userData)
  }
};
