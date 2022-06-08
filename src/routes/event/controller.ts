import { Prisma } from ".prisma/client";
import { Request, Response } from "express";
import prisma from "~/lib/prisma";
import { schema } from "./schema";

// Fetch All Events
export const handleGetAllEvents = async (req: Request, res: Response) => {
  const skip = Number(req.query.skip) || 0;
  const take = Number(req.query.take) || 10;

  const events = await prisma.event.findMany({
    skip: skip,
    take: take,
  });

  return res.json({ data: events });
};

// Fetch by Event ID
export const handleGetEventById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const eventId = Number(req.params.id);
  if (isNaN(eventId)) return res.status(400).json({ data: "Invalid Id" });

  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });
  if (!event) return res.status(404).json({ data: "Event not found" });
  return res.json({ data: event });
};

// Create New Event
export const handleCreateEvent = async (req: Request, res: Response) => {
  const { error } = schema.validate(req.body);
  if (!error) {
    const {
      name,
      agenda,
      description,
      posterUrl,
      startDate,
      endDate,
      theme,
      location,
    } = req.body;

    const newEventObject = {
      name,
      agenda,
      description,
      posterUrl,
      startDate,
      endDate,
      theme,
      location,
    };

    const event = await prisma.event.create({
      data: newEventObject,
    });
    return res.json({ data: event });
  }
  return res.status(500).json({ data: error.details[0].message });
};

// Update Existing Event
export const handleUpdateEventById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const productId = Number(req.params.id);
  const allowedUpdateFields: Array<keyof Prisma.eventUpdateInput> = [
    "name",
    "agenda",
    "description",
    "posterUrl",
    "startDate",
    "endDate",
    "theme",
    "location",
  ];

  const updates = Object.keys(req.body);

  const updateObject: Prisma.eventUpdateInput = {};

  for (const update of updates) {
    if (!allowedUpdateFields.includes(update as keyof Prisma.eventUpdateInput))
      return res.status(400).json({ data: "Invalid Arguments" });
    updateObject[update] = req.body[update];
  }

  const eventToBeUpdated = await prisma.event.findUnique({
    where: { id: productId },
  });
  if (!eventToBeUpdated)
    return res.status(404).json({ data: "Event Not Found" });

  updateObject.updatedAt = new Date();
  const event = await prisma.event.update({
    where: {
      id: productId,
    },
    data: updateObject,
  });

  return res.json({ data: event });
};

// Delete a Event
export const handleDeleteEvent = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const eventId = Number(req.params.id);
  if (!eventId) return res.status(400).json({ data: "Invalid ID" });

  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });
  if (!event) return res.status(404).json({ data: "Event Not Found" });

  await prisma.event.delete({
    where: {
      id: eventId,
    },
  });

  return res.status(200).json({ data: "Successfully Deleted!" });
};
