import { Prisma } from ".prisma/client";
import { Request, Response } from "express";
import prisma from "~/lib/prisma";
import { schema } from "./schema";
import * as nodemailer from "nodemailer";
import { constants } from "~/constants";
import process from "process";
import * as bcrypt from "bcrypt";

/* gotta add jwt authentication everywhere to validate request */

export const handleCreateAdmin = async (req: Request, res: Response) => {
  const { error } = schema.validate(req.body);
  if (!error) {
    const { uid, email, name, photoUrl } = req.body;

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
          name,
          photoUrl,
        };

        const request = prisma.admin.create({
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

export const handleDeleteAdmin = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const adminId = Number(req.params.id);
  if (!adminId) return res.status(400).json({ data: "Invalid ID" });

  const request = await prisma.admin.findUnique({
    where: { id: adminId },
  });
  if (!request) return res.status(404).json({ data: "User Not Found" });

  await prisma.admin.delete({
    where: {
      id: adminId,
    },
  });

  return res.status(200).json({ data: "User Successfully Deleted!" });
};

export const handleGetAllAdmins = async (req: Request, res: Response) => {
  const skip = Number(req.query.skip) || 0;
  const take = Number(req.query.take) || 10;

  const admin = await prisma.admin.findMany({
    skip: skip,
    take: take,
  });

  return res.json({ data: admin });
};

export const handleGetAdminById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const adminId = Number(req.params.id);
  if (isNaN(adminId)) return res.status(400).json({ data: "Invalid Id" });

  const request = await prisma.admin.findUnique({
    where: { id: adminId },
  });
  if (!request) return res.status(404).json({ data: "Request not found" });
  return res.json({ data: request });
};

export const handleUpdateAdminById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const adminId = Number(req.params.id);
  const allowedUpdateFields: Array<keyof Prisma.adminUpdateInput> = [
    "uid",
    "email",
    "password",
    "name",
    "photoUrl",
  ];

  const updates = Object.keys(req.body);

  const updateObject: Prisma.adminUpdateInput = {};

  for (const update of updates) {
    if (!allowedUpdateFields.includes(update as keyof Prisma.adminUpdateInput))
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

  const adminToBeUpdated = await prisma.admin.findUnique({
    where: { id: adminId },
  });
  if (!adminToBeUpdated)
    return res.status(404).json({ data: "Request Not Found" });

  updateObject.updatedAt = new Date();
  const request = await prisma.admin.update({
    where: {
      id: adminId,
    },
    data: updateObject,
  });

  return res.json({ data: request });
};
