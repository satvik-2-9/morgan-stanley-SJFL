import { Prisma } from ".prisma/client";
import { Request, Response } from "express";
import prisma from "~/lib/prisma";
import { schema } from "./schema";

export const handleCreateRequest = async (req: Request, res: Response) => {
  const { error } = schema.validate(req.body);
  if (!error) {
    const { type, theme, description, user, admin, donation } = req.body;

    const userToBeConnected = await prisma.user.findUnique({
      where: { id: user },
    });
    if (!userToBeConnected)
      return res.status(400).json({ data: "User not found" });

    const adminToBeConnected = await prisma.admin.findUnique({
      where: { id: admin },
    });
    if (!adminToBeConnected)
      return res.status(400).json({ data: "Admin not found" });

    const newRequestObject = {
      type,
      theme,
      description,
      donation,
      user: { connect: { id: user } },
      admin: { connect: { id: admin } },
    };

    const request = await prisma.request.create({
      data: newRequestObject,
    });
    return res.json({ data: request });
  }
  return res.status(500).json({ data: error.details[0].message });
};

export const handleDeleteRequest = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const requestId = Number(req.params.id);
  if (!requestId) return res.status(400).json({ data: "Invalid ID" });

  const request = await prisma.request.findUnique({
    where: { id: requestId },
  });
  if (!request) return res.status(404).json({ data: "Request Not Found" });

  await prisma.request.delete({
    where: {
      id: requestId,
    },
  });

  return res.status(200).json({ data: "Successfully Deleted!" });
};

export const handleGetAllRequests = async (req: Request, res: Response) => {
  const skip = Number(req.query.skip) || 0;
  const take = Number(req.query.take) || 10;

  const requests = await prisma.request.findMany({
    skip: skip,
    take: take,
  });

  return res.json({ data: requests });
};

export const handleGetRequestById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const requestId = Number(req.params.id);
  if (isNaN(requestId)) return res.status(400).json({ data: "Invalid Id" });

  const request = await prisma.request.findUnique({
    where: { id: requestId },
  });
  if (!request) return res.status(404).json({ data: "Request not found" });
  return res.json({ data: request });
};

export const handleUpdateRequestById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const productId = Number(req.params.id);
  const allowedUpdateFields: Array<keyof Prisma.requestUpdateInput> = [
    "type",
    "theme",
    "description",
    "status",
    "user",
    "admin",
    "donation",
  ];

  const updates = Object.keys(req.body);

  const updateObject: Prisma.requestUpdateInput = {};

  for (const update of updates) {
    if (
      !allowedUpdateFields.includes(update as keyof Prisma.requestUpdateInput)
    )
      return res.status(400).json({ data: "Invalid Arguments" });

    if (["user", "admin"].includes(update)) {
      const entityConnection = {
        connect: { id: req.body[update] },
      };
      const elem = await prisma[update].findUnique({
        where: { id: req.body[update] },
      });
      if (!elem) return res.status(400).json({ data: `${update} not found` });
      updateObject[update] = entityConnection;
    } else updateObject[update] = req.body[update];
  }

  const requestToBeUpdated = await prisma.request.findUnique({
    where: { id: productId },
  });
  if (!requestToBeUpdated)
    return res.status(404).json({ data: "Request Not Found" });

  updateObject.updatedAt = new Date();
  const request = await prisma.request.update({
    where: {
      id: productId,
    },
    data: updateObject,
  });

  return res.json({ data: request });
};