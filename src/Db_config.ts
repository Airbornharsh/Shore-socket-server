import mongoose from "mongoose";
import user from "./models/user";
import comment from "./models/comment";
import post from "./models/post";

const Db_Uri = process.env.DB_URI1;

const DbConnect = async () => {
  try {
    const connect = await mongoose.connect(Db_Uri as string, () => {
      console.log("Db Connected");
    });
    return {
      connect,
      user,
      post,
      comment,
    };
  } catch (e) {
    console.log(e);
  }
};

module.exports = { DbConnect };
