import { uploadDocument, getCurrentDocument, discardDocument } from "../services/documents.service.js";

export const upload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const document = await uploadDocument(req.userId, req.file);
    res.status(201).json(document);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCurrent = async (req, res) => {
  const document = await getCurrentDocument(req.userId);
  if (!document) {
    return res.status(404).json({ error: "No document uploaded" });
  }
  res.status(200).json({ id: document.id, filename: document.filename, status: "processed" });
};

export const discard = async (req, res) => {
  const deleted = await discardDocument(req.userId);
  if (!deleted) {
    return res.status(404).json({ error: "No document to discard" });
  }
  res.status(204).send();
};