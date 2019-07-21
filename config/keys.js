require("dotenv").config();

exports.sessions = {
   secret: process.env.SESSION_SECRET
    
  };
  