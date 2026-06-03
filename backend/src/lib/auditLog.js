import AuditLog from "../models/AuditLog.js";

export const writeAuditLog = async (entry) => {
  try {
    await AuditLog.create({ ...entry, timestamp: new Date() });
  } catch (err) {
    console.error("Audit log write failed:", err.message);
  }
};
