import { Prisma } from ".prisma/client";
import { Request, Response } from "express";
import prisma from "~/lib/prisma";
import { schema } from "./schema";

// Fetch All Documents
export const handleGetAllDocuments = async (req: Request, res: Response) => {
    const skip = Number(req.query.skip) || 0;
    const take = Number(req.query.take) || 10;
  
    const documents = await prisma.document.findMany({
      skip: skip,
      take: take,
    });
  
    return res.json({ data: documents });
  };
  
  // Fetch by Document ID
  export const handleGetDocumentById = async (
    req: Request<{ id: string }>,
    res: Response
  ) => {
    const documentId = Number(req.params.id);
    if (isNaN(documentId)) return res.status(400).json({ data: "Invalid Id" });
  
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });
    if (!document) return res.status(404).json({ data: "Documents not found" });
    return res.json({ data: document });
  };

  // Create New Document
  export const handleCreateDocument = async (req: Request, res: Response) => {
    const { error } = schema.validate(req.body);
    if (!error) {
      const {  request, user, data } = req.body;
  
      const userToBeConnected = await prisma.user.findUnique({
        where: { id: user },
      });
      if (!userToBeConnected)
        return res.status(400).json({ data: "User not found" });
  
      const requestToBeConnected = await prisma.request.findUnique({
        where: { id: request },
      });
      if (!requestToBeConnected)
        return res.status(400).json({ data: "Request not found" });
  
      const newRequestObject = {
        request: { connect: { id: request } },
        user: { connect: { id: user } },
        data
      };
  
      const document = await prisma.document.create({
        data: newRequestObject,
      });
      return res.json({ data: document });
    }
    return res.status(500).json({ data: error.details[0].message });
  };


  // Update Existing Document
  export const handleUpdateDocumentById = async (
    req: Request<{ id: string }>,
    res: Response
  ) => {
    const productId = Number(req.params.id);
    const allowedUpdateFields: Array<keyof Prisma.documentUpdateInput> = [
      "request",
      "user",
      "data"
    ];
  
    const updates = Object.keys(req.body);
  
    const updateObject: Prisma.documentUpdateInput = {};
  
    for (const update of updates) {
      if (
        !allowedUpdateFields.includes(update as keyof Prisma.documentUpdateInput)
      )
        return res.status(400).json({ data: "Invalid Arguments" });
  
      if (["user", "request"].includes(update)) {
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
  
    const documentToBeUpdated = await prisma.document.findUnique({
      where: { id: productId },
    });
    if (!documentToBeUpdated)
      return res.status(404).json({ data: "Request Not Found" });
  
    updateObject.updatedAt = new Date();
    const document = await prisma.document.update({
      where: {
        id: productId,
      },
      data: updateObject,
    });
  
    return res.json({ data: document });
  };

  // Delete a Document
  export const handleDeleteDocument = async (
    req: Request<{ id: string }>,
    res: Response
  ) => {
    const documentId = Number(req.params.id);
    if (!documentId) return res.status(400).json({ data: "Invalid ID" });
  
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });
    if (!document) return res.status(404).json({ data: "Document Not Found" });
  
    await prisma.document.delete({
      where: {
        id: documentId,
      },
    });
  
    return res.status(200).json({ data: "Successfully Deleted!" });
  };