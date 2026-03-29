import asyncHandler from "express-async-handler";
import Query from "../models/query.js";

// ─── PUBLIC: Submit a new query ───────────────────────────────────────────────
export const submitQuery = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  const query = await Query.create({
    name,
    email,
    subject,
    message,
    user: req.user?._id || null,
  });

  res.status(201).json({
    success: true,
    message: "Query submitted successfully! We'll get back to you soon.",
    query,
  });
});

// ─── PUBLIC: Get replies for a specific email ─────────────────────────────────
export const getMyQueries = asyncHandler(async (req, res) => {
  const { email } = req.query;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const queries = await Query.find({ email })
    .sort({ createdAt: -1 })
    .select("subject message status adminReply repliedAt createdAt");

  res.json({ success: true, queries });
});

// ─── ADMIN: Get all queries ───────────────────────────────────────────────────
export const getAllQueries = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const filter = {};
  if (status && ["pending", "replied", "closed"].includes(status)) {
    filter.status = status;
  }

  const queries = await Query.find(filter)
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json({ success: true, queries });
});

// ─── ADMIN: Get single query ──────────────────────────────────────────────────
export const getQueryById = asyncHandler(async (req, res) => {
  const query = await Query.findById(req.params.id).populate("user", "name email");

  if (!query) {
    res.status(404);
    throw new Error("Query not found");
  }

  res.json({ success: true, query });
});

// ─── ADMIN: Reply to a query ──────────────────────────────────────────────────
export const replyToQuery = asyncHandler(async (req, res) => {
  const { adminReply, status } = req.body;

  if (!adminReply || !adminReply.trim()) {
    res.status(400);
    throw new Error("Reply message is required");
  }

  const query = await Query.findById(req.params.id);

  if (!query) {
    res.status(404);
    throw new Error("Query not found");
  }

  query.adminReply = adminReply.trim();
  query.status = status || "replied";
  query.repliedAt = new Date();

  await query.save();

  res.json({ success: true, message: "Reply sent successfully", query });
});

// ─── ADMIN: Delete a query ────────────────────────────────────────────────────
export const deleteQuery = asyncHandler(async (req, res) => {
  const query = await Query.findById(req.params.id);

  if (!query) {
    res.status(404);
    throw new Error("Query not found");
  }

  await query.deleteOne();
  res.json({ success: true, message: "Query deleted" });
});
