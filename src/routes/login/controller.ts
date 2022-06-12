import { Prisma } from ".prisma/client";
import { Request, Response } from "express";
import prisma from "~/lib/prisma";
import { schema } from "./schema";
import * as nodemailer from "nodemailer";
import { constants } from "~/constants";
import process from "process";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import config from "../../config";

export const handleUserLogin = async (req: Request, res: Response) => {
  const { error } = schema.validate(req.body);
  if (!error) {
    const uid = req.body.uid;
    if (uid.length === 0) return res.status(400).json({ data: "Invalid Id" });

    const request = await prisma.user.findUnique({
      where: { uid: uid },
    });

    if (!request) return res.status(404).json({ data: "User not found" });

    const match = await bcrypt.compare(req.body.password, request.password);
    if (match) {
      //login user
      const secret = config.JWT_SECRET;
      const payload = {
        uid: request.uid,
        email: request.email,
      };
      const token = jwt.sign(payload, secret, { expiresIn: "24h" });
      res
        .status(200)
        .json({ token, message: "Credentials are correct !, Login user." });
    } else {
      res.status(400).json({
        message:
          "User Credentials are invalid, Kindly redirect to login page again",
      });
    }
  }
};

export const handleAdminLogin = async (req: Request, res: Response) => {
  const { error } = schema.validate(req.body);
  if (!error) {
    const uid = req.body.uid;
    if (uid.length === 0) return res.status(400).json({ data: "Invalid Id" });
    const request = await prisma.admin.findUnique({
      where: { uid: uid },
    });
    if (!request) return res.status(404).json({ data: "Admin not found" });

    const match = await bcrypt.compare(req.body.password, request.password);
    if (match) {
      const secret = config.JWT_SECRET;
      const payload = {
        uid: request.uid,
        email: request.email,
      };
      const token = jwt.sign(payload, secret, { expiresIn: "24h" });
      res
        .status(200)
        .json({ token, message: "Credentials are correct, Log in Admin!" });
    } else {
      res.status(400).json({
        message:
          "Admin credentials are invalid, redirect Admin to login page again!",
      });
    }
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  let token: string;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const secret = config.JWT_SECRET;

      const decoded: any = jwt.verify(token, secret);

      const user = await prisma.user.findUnique({
        where: {
          uid: decoded.uid,
        },
      });

      if (user?.password) {
        user.password = "";
      }

      return res.status(200).json({ data: user });
      // next()
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  return res.status(400).json({ data: "Invalid token" });
};

export const getCurrentAdmin = async (req: Request, res: Response) => {
  let token: string;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const secret = config.JWT_SECRET;

      const decoded: any = jwt.verify(token, secret);

      const admin = await prisma.admin.findUnique({
        where: {
          uid: decoded.uid,
        },
      });

      if (admin?.password) {
        admin.password = "";
      }

      return res.status(200).json({ data: admin });
      // next()
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  return res.status(400).json({ data: "Invalid token" });
};
