import mongoose from "mongoose";

const userScheme = new mongoose.Schema({
  name: { type: String },
  username: { type: String },
  password: { type: String },
  token: { type: String },
});

const User = mongoose.model("User", userScheme);

export { User };
