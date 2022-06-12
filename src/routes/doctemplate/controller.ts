import { Prisma } from ".prisma/client";
import { Request, Response } from "express";
import prisma from "~/lib/prisma";
import { schema } from "./schema";

// Fetch All Documents
export const handleGetAllDocTemplates = async (req: Request, res: Response) => {
  const skip = Number(req.query.skip) || 0;
  const take = Number(req.query.take) || 10;

  const doctemplates = await prisma.doctemplate.findMany({
    skip: skip,
    take: take,
  });

  return res.json({ data: doctemplates });
};

// Fetch by DocTemplate ID
export const handleGetDocTemplateById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const doctemplateId = Number(req.params.id);
  if (isNaN(doctemplateId)) return res.status(400).json({ data: "Invalid Id" });

  const doctemplate = await prisma.doctemplate.findUnique({
    where: { id: doctemplateId },
  });
  if (!doctemplate)
    return res.status(404).json({ data: "Documents template not found" });
  return res.json({ data: doctemplate });
};

// Create New DocTemplate
export const handleCreateDocTemplate = async (req: Request, res: Response) => {
  const { error } = schema.validate(req.body);
  if (!error) {
    const { type, theme, data } = req.body;

    const newDocTemplateObject = {
      type,
      theme,
      data,
    };

    const doctemplate = await prisma.doctemplate.create({
      data: newDocTemplateObject,
    });
    return res.json({ data: doctemplate });
  }
  return res.status(500).json({ data: error.details[0].message });
};

// Update Existing DocTemplate
export const handleUpdateDocTemplateById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const productId = Number(req.params.id);
  const allowedUpdateFields: Array<keyof Prisma.doctemplateUpdateInput> = [
    "type",
    "theme",
    "data",
  ];

  const updates = Object.keys(req.body);

  const updateObject: Prisma.documentUpdateInput = {};

  for (const update of updates) {
    if (
      !allowedUpdateFields.includes(
        update as keyof Prisma.doctemplateUpdateInput
      )
    )
      return res.status(400).json({ data: "Invalid Arguments" });

    updateObject[update] = req.body[update];
  }

  const docTemplateToBeUpdated = await prisma.doctemplate.findUnique({
    where: { id: productId },
  });
  if (!docTemplateToBeUpdated)
    return res.status(404).json({ data: "Doc Template Not Found" });

  updateObject.updatedAt = new Date();
  const doctemplate = await prisma.doctemplate.update({
    where: {
      id: productId,
    },
    data: updateObject,
  });

  return res.json({ data: doctemplate });
};

// Delete a DocTemplate
export const handleDeleteDocTemplate = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const doctemplateId = Number(req.params.id);
  if (!doctemplateId) return res.status(400).json({ data: "Invalid ID" });

  const doctemplate = await prisma.doctemplate.findUnique({
    where: { id: doctemplateId },
  });
  if (!doctemplate)
    return res.status(404).json({ data: "DocTemplate Not Found" });

  await prisma.doctemplate.delete({
    where: {
      id: doctemplateId,
    },
  });

  return res.status(200).json({ data: "Successfully Deleted!" });
};
