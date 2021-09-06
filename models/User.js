import { model, Schema } from "mongoose";

const userSchema = new Schema({
  userLogin: String,
  password: String,
  createdAt: String,
});

const User = model("User", userSchema);

export default User;
