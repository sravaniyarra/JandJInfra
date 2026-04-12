const asyncHandler = require("../utils/asyncHandler");
const Lead = require("../models/Lead");
const Notification = require("../models/Notification");
const { notifyLeadCreated } = require("../utils/leadNotifier");

const createLead = asyncHandler(async (req, res) => {
  const { name, phone, city, whatsappOptIn } = req.body;
  if (!name || !phone || !city) {
    res.status(400);
    throw new Error("name, phone and city are required");
  }

  const lead = await Lead.create({
    name,
    phone,
    city,
    whatsappOptIn: Boolean(whatsappOptIn)
  });

  await notifyLeadCreated(lead);

  await Notification.create({
    type: "new_lead",
    title: "New Designer Request",
    message: `${lead.name} from ${lead.city} requested a designer consultation (${lead.phone})`,
    meta: { leadId: lead._id, name: lead.name, phone: lead.phone, city: lead.city }
  });

  res.status(201).json({
    message: "Designer request submitted successfully",
    leadId: lead._id
  });
});

const getLeads = asyncHandler(async (_req, res) => {
  const leads = await Lead.find();
  res.json(leads);
});
const updateLeadStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["new", "contacted", "converted"].includes(status)) {
    res.status(400);
    throw new Error("Invalid lead status");
  }

  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    res.status(404);
    throw new Error("Lead not found");
  }

  lead.status = status;
  const updated = await lead.save();
  res.json(updated);
});

module.exports = { createLead, getLeads, updateLeadStatus };
