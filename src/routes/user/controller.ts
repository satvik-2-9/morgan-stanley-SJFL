import { Prisma } from ".prisma/client";
import { Request, Response } from "express";
import prisma from "~/lib/prisma";
import { schema } from "./schema";
import * as nodemailer from "nodemailer";
import { constants } from "~/constants";
import process from "process";
import * as bcrypt from "bcrypt";

/* gotta add jwt authentication everywhere to validate request */

export const handleCreateUser = async (req: Request, res: Response) => {
  const { error } = schema.validate(req.body);
  if (!error) {
    const {
      uid,
      email,
      address,
      yearOfEnrolment,
      name,
      phoneNumber,
      photoUrl,
      donationReceived,
    } = req.body;

    //10 salting rounds.
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      } else {
        // maybe put uid genetation automated here.
        const newUserObject = {
          uid,
          email,
          password: hash,
          address,
          yearOfEnrolment,
          name,
          phoneNumber,
          photoUrl,
          donationReceived,
        };

        const request = prisma.user.create({
          data: newUserObject,
        });

        /*           const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
              user: process.env.NODEMAILER_EMAIL,
              pass: process.env.NODEMAILER_PASSWORD,
            },
          });

          const mailOptions = {
            from: constants.officialEmail,
            to: constants.adminEmail,
            subject: "New Request Raised",
            text: `Hi ${constants.adminName},\nA new request has been raised.\n Please login and assign the request to somebody.\n`,
          };
          transporter.sendMail(mailOptions).then(
            (r) => {
              console.log("email sent");
            },
            (err) => {
              console.log(err);
            }
          );
 */

        return res.json({ data: request });
      }
    });
    return res.status(500).json({ data: error });
  }
};

/*   const userToBeConnected = await prisma.user.findUnique({
      where: { id: user },
    });
    if (!userToBeConnected)
      return res.status(400).json({ data: "User not found" });
 */
/*     const adminToBeConnected = await prisma.admin.findUnique({
      where: { id: admin },
    });
    if (!adminToBeConnected)
      return res.status(400).json({ data: "Admin not found" });
 */

/* email trigger to confirm user creation, email to user email by admin. */

export const handleDeleteUser = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const userId = Number(req.params.id);
  if (!userId) return res.status(400).json({ data: "Invalid ID" });

  const request = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!request) return res.status(404).json({ data: "User Not Found" });

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  return res.status(200).json({ data: "User Successfully Deleted!" });
};

export const handleGetAllUsers = async (req: Request, res: Response) => {
  const skip = Number(req.query.skip) || 0;
  const take = Number(req.query.take) || 10;

  const user = await prisma.user.findMany({
    skip: skip,
    take: take,
  });

  return res.json({ data: user });
};

export const handleGetUserById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const userId = Number(req.params.id);
  if (isNaN(userId)) return res.status(400).json({ data: "Invalid Id" });

  const request = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!request) return res.status(404).json({ data: "Request not found" });
  return res.json({ data: request });
};

export const handleUpdateUserById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const userId = Number(req.params.id);
  const allowedUpdateFields: Array<keyof Prisma.userUpdateInput> = [
    "uid",
    "email",
    "password",
    "address",
    "yearOfEnrolment",
    "name",
    "phoneNumber",
    "photoUrl",
    "donationReceived",
  ];

  const updates = Object.keys(req.body);

  const updateObject: Prisma.userUpdateInput = {};

  for (const update of updates) {
    if (!allowedUpdateFields.includes(update as keyof Prisma.userUpdateInput))
      return res.status(400).json({ data: "Invalid Arguments" });

    /*     if (["user", "admin"].includes(update)) {
      const entityConnection = {
        connect: { id: req.body[update] },
      };
      const elem = await prisma[update].findUnique({
        where: { id: req.body[update] },
      });
      if (!elem) return res.status(400).json({ data: `${update} not found` });
      updateObject[update] = entityConnection;
    } else updateObject[update] = req.body[update]; */
  }

  const userToBeUpdated = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userToBeUpdated)
    return res.status(404).json({ data: "Request Not Found" });

  updateObject.updatedAt = new Date();
  const request = await prisma.user.update({
    where: {
      id: userId,
    },
    data: updateObject,
  });

  return res.json({ data: request });
};