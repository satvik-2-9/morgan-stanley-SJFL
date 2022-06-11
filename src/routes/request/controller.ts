import { Prisma, RequestType, RequestStatus, Theme } from ".prisma/client";
import { Request, Response } from "express";
import prisma from "~/lib/prisma";
import { schema } from "./schema";
import * as nodemailer from "nodemailer";
import { constants } from "~/constants";
import process from "process";

export const handleCreateRequest = async (req: Request, res: Response) => {
  const { error } = schema.validate(req.body);
  if (!error) {
    const { type, theme, description, user, donation } = req.body;
    console.log(donation);
    console.log(type + " " + theme);
    const userToBeConnected = await prisma.user.findUnique({
      where: { id: user },
    });
    if (!userToBeConnected)
      return res.status(400).json({ data: "User not found" });

    const admins = await prisma.admin.findMany({
      include: {
        _count: {
          select: {
            request: true,
          },
        },
      },
    });
    let minimumRequestsHandledByAnyAdmin = Number.MAX_SAFE_INTEGER;
    let adminIdWithMinimumRequests;
    for (const admin of admins) {
      if (admin._count.request < minimumRequestsHandledByAnyAdmin) {
        minimumRequestsHandledByAnyAdmin = admin._count.request;
        adminIdWithMinimumRequests = admin.id;
      }
    }

    if (!adminIdWithMinimumRequests)
      return res
        .status(404)
        .json({ data: "No admin found to take up this request" });

    const newRequestObject = {
      type,
      theme,
      description,
      donation,
      user: { connect: { id: user } },
      admin: { connect: { id: adminIdWithMinimumRequests } },
    };

    const request = await prisma.request.create({
      data: newRequestObject,
    });

    // logic to get the adminId,adminEmail that this particular request is being assigned to.
    console.log(process.env.NODEMAILER_EMAIL);
    console.log(process.env.NODEMAILER_PASSWORD);
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const adminAssigned = await prisma.admin.findUnique({
      where: { id: adminIdWithMinimumRequests },
    });
    const mailOptions = {
      from: constants.officialEmail,
      to: adminAssigned?.email,
      subject: "New Request Raised",
      text: `Hi ${adminAssigned?.name},\nA new request has been raised.\n Please login and review the request.\n`,
    };
    transporter.sendMail(mailOptions).then(
      () => {
        console.log("email sent");
      },
      (err) => {
        console.log(err);
      }
    );
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
  const type: RequestType = req.query.type as RequestType;
  const theme: Theme = req.query.theme as Theme;
  const status: RequestStatus = req.query.status as RequestStatus;
  const uid = req.query.uid;
  const adminUid = req.query.adminUid;

  const requests = await prisma.request.findMany({
    skip: skip,
    take: take,
    where: {
      type: {
        equals: type,
      },
      theme: {
        equals: theme,
      },
      status: {
        equals: status,
      },
      user: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        uid: {
          equals: uid,
        },
      },
      admin: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        uid: {
          equals: adminUid,
        },
      },
    },
    include: {
      user: {
        select: {
          uid: true,
          name: true,
        },
      },
    },
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

export const fetchDocumentByRequestID = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  // Extract request ID
  const requestId = Number(req.params.id);

  // Check if request ID is valid or not valid
  if (isNaN(requestId)) return res.status(400).json({ data: "Invalid Id" });

  // Extract document info using unique request ID
  const document = await prisma.document.findUnique({
    where: { requestId: requestId },
  });

  // Return NOT FOUND message if document not found
  if (!document) return res.status(404).json({ data: "Documents not found" });

  // Return documents
  return res.json({ data: document.data });
};
