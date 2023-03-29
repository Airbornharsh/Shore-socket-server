import { Secret, verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const Authenticate = async (data: any) => {
  try {
    const accessToken = data["accessToken"];

    let tempErr: any;
    let tempUser: any;

    await verify(
      accessToken,
      process.env.JWT_SECRET as Secret,
      (err: any, user: any) => {
        tempErr = err;
        tempUser = user;
      }
    );

    if (tempErr) return { statusCode: 402, message: "Not Authorized" };

    return {
      statusCode: 200,
      data: {
        emailId: tempUser.emailId,
        userName: tempUser.userName,
        phoneNumber: tempUser.phoneNumber,
        _id: tempUser._id,
        iat: tempUser.iat,
      },
    };
  } catch (e: any) {
    return { statusCode: 500, message: e.message };
  }
};

export default Authenticate;
