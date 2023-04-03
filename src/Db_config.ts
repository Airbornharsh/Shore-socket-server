import mongoose from "mongoose";
import user from "./models/user";
import comment from "./models/comment";
import post from "./models/post";

const DbConnect = async () => {
  try {
    const connect = await mongoose.connect(process.env.DB_URI1 as string);

    console.log("Db connected");
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

export { DbConnect };
