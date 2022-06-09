import { Prisma } from ".prisma/client";
import { Request, Response } from "express";
import prisma from "~/lib/prisma";
import { schema } from "./schema";
import * as nodemailer from "nodemailer";
import { constants } from "~/constants";
import process from "process";
import * as bcrypt from "bcrypt";

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
      res
        .status(200)
        .json({ message: "Credentials are correct !, Login user." });
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
      res
        .status(200)
        .json({ message: "Credentials are correct, Log in Admin!" });
    } else {
      res.status(400).json({
        message:
          "Admin credentials are invalid, redirect Admin to login page again!",
      });
    }
  }
};
