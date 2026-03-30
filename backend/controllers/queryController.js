import asyncHandler from "express-async-handler";
import Query from "../models/query.js";

// Submit a new query (public, login optional)
export const submitQuery = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  const query = await Query.create({
    name, email, subject, message,
    user: req.user?._id || null,
  });

  res.status(201).json({
    success: true,
    message: "Query submitted successfully! We'll get back to you soon.",
    query,
  });
});

// Get replies by email (public)
export const getMyQueries = asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) { res.status(400); throw new Error("Email is required"); }

  const queries = await Query.find({ email })
    .sort({ createdAt: -1 })
    .select("subject message status adminReply repliedAt createdAt");

  res.json({ success: true, queries });
});

// Admin: get all queries (with optional status filter)
export const getAllQueries = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status && ["pending", "replied", "closed"].includes(status) ? { status } : {};

  const queries = await Query.find(filter)
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json({ success: true, queries });
});

// Admin: get single query
export const getQueryById = asyncHandler(async (req, res) => {
  const query = await Query.findById(req.params.id).populate("user", "name email");
  if (!query) { res.status(404); throw new Error("Query not found"); }
  res.json({ success: true, query });
});

// Admin: reply to query
export const replyToQuery = asyncHandler(async (req, res) => {
  const { adminReply, status } = req.body;
  if (!adminReply?.trim()) { res.status(400); throw new Error("Reply message is required"); }

  const query = await Query.findById(req.params.id);
  if (!query) { res.status(404); throw new Error("Query not found"); }

  query.adminReply = adminReply.trim();
  query.status = status || "replied";
  query.repliedAt = new Date();

  res.json({ success: true, message: "Reply sent successfully", query: await query.save() });
});

// Admin: delete query
export const deleteQuery = asyncHandler(async (req, res) => {
  const query = await Query.findByIdAndDelete(req.params.id);
  if (!query) { res.status(404); throw new Error("Query not found"); }
  res.json({ success: true, message: "Query deleted" });
});
