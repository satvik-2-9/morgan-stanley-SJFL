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
    const hashPassword = await bcrypt.hash(req.body.password, 10);

    const newUserObject = {
      uid,
      email,
      password: hashPassword,
      address,
      yearOfEnrolment,
      name,
      phoneNumber,
      photoUrl,
      donationReceived,
    };

    const user = await prisma.user.create({
      data: newUserObject,
    });

    user.password = "";

    return res.json({ data: user });

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
  }
  return res.status(500).json({ data: error.details[0].message });
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
  if (!request) return res.status(404).json({ data: "User not found" });
  return res.json({ data: request });
};

export const handleUpdateUserById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const userId = Number(req.params.id);
  const allowedUpdateFields: Array<keyof Prisma.userUpdateInput> = [
    "email",
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

    updateObject[update] = req.body[update];
  }

  const userToBeUpdated = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userToBeUpdated)
    return res.status(404).json({ data: "Request Not Found" });

  const emailToBeUpdated = await prisma.user.findUnique({
    where: { email: req.body.email },
  });
  if (emailToBeUpdated)
    return res.status(400).json({ data: "A user with this email exists" });

  const phoneNumberToBeUpdated = await prisma.user.findUnique({
    where: { phoneNumber: req.body.phoneNumber },
  });
  if (phoneNumberToBeUpdated)
    return res
      .status(400)
      .json({ data: "A user with this phone number exists" });

  updateObject.updatedAt = new Date();
  const request = await prisma.user.update({
    where: {
      id: userId,
    },
    data: updateObject,
  });

  return res.json({ data: request });
};

// Fetch all documents of User by UID
export const fetchDocumentsByUID = async (
  req: Request<{ uid: string }>,
  res: Response
) => {
  // Extract UID
  const UID = req.params.uid;

  // Check if request ID is valid or not valid
  if (UID.length === 0) return res.status(400).json({ data: "Invalid UID" });

  // Get User by using UID
  const user = await prisma.user.findUnique({
    where: { uid: UID },
  });

  if (!user) return res.status(404).json({ data: "User not found" });
  const userID = user.id;

  // Check if user ID is valid or not valid
  if (isNaN(userID)) return res.status(400).json({ data: "Invalid UID" });

  // Fetch All user documents
  const documents = await prisma.document.findMany({
    where: { userId: userID },
    select: { data: true },
  });

  // Return NOT FOUND message if document not found
  if (!documents) return res.status(404).json({ data: "Documents not found" });

  const response = documents.map((document) => {
    return document.data;
  });
  // Return documents
  return res.json({ data: response });
};
