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
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const newUserObject = {
      uid,
      email,
      password: hashPassword,
      name,
      photoUrl,
    };

    const admin = await prisma.admin.create({
      data: newUserObject,
    });

    admin.password = "";

    return res.json({ data: admin });
  }
  return res.status(500).json({ data: error });
};

/* email trigger to confirm user creation, email to user email by admin. */

export const handleDeleteAdmin = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const adminId = Number(req.params.id);
  if (!adminId) return res.status(400).json({ data: "Invalid ID" });

  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
  });
  if (!admin) return res.status(404).json({ data: "Admin Not Found" });

  await prisma.admin.delete({
    where: {
      id: adminId,
    },
  });

  return res.status(200).json({ data: "Admin Successfully Deleted!" });
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

  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
  });
  if (!admin) return res.status(404).json({ data: "Admin not found" });
  return res.json({ data: admin });
};

export const handleUpdateAdminById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const adminId = Number(req.params.id);
  const allowedUpdateFields: Array<keyof Prisma.adminUpdateInput> = [
    "email",
    "name",
    "photoUrl",
  ];

  const updates = Object.keys(req.body);

  const updateObject: Prisma.adminUpdateInput = {};

  for (const update of updates) {
    if (!allowedUpdateFields.includes(update as keyof Prisma.adminUpdateInput))
      return res.status(400).json({ data: "Invalid Arguments" });

    updateObject[update] = req.body[update];
  }

  const adminToBeUpdated = await prisma.admin.findUnique({
    where: { id: adminId },
  });
  if (!adminToBeUpdated)
    return res.status(404).json({ data: "Admin Not Found" });

  updateObject.updatedAt = new Date();
  const request = await prisma.admin.update({
    where: {
      id: adminId,
    },
    data: updateObject,
  });

  return res.json({ data: request });
};
