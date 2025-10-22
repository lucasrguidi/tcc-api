import {
  db
} from "./chunk-RUQMPZCH.mjs";

// src/app.ts
import express from "express";
var app = express();
app.use(express.json());
app.get("/users", async (_req, res) => {
  try {
    const items = await db.scan();
    res.json({ ok: true, items });
  } catch (e) {
    res.status(500).json({ ok: false, error: (e == null ? void 0 : e.message) || "Internal Error" });
  }
});
app.get("/users/:userId", async (req, res) => {
  try {
    const user = await db.get(req.params.userId);
    if (!user) return res.status(404).json({ ok: false, error: "Not Found" });
    res.json({ ok: true, user });
  } catch (e) {
    res.status(500).json({ ok: false, error: (e == null ? void 0 : e.message) || "Internal Error" });
  }
});
app.post("/users", async (req, res) => {
  try {
    const { userId, name, email } = req.body || {};
    if (!userId || !name || !email) {
      return res.status(400).json({ ok: false, error: '"userId" and "name" are required' });
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const item = { userId, name, email, createdAt: now, updatedAt: now };
    await db.put(item);
    res.status(201).json({ ok: true, user: item });
  } catch (e) {
    if ((e == null ? void 0 : e.name) === "ConditionalCheckFailedException") {
      return res.status(409).json({ ok: false, error: "User already exists" });
    }
    res.status(500).json({ ok: false, error: (e == null ? void 0 : e.message) || "Internal Error" });
  }
});
app.put("/users/:userId", async (req, res) => {
  try {
    const { name, email } = req.body || {};
    const updated = await db.update(req.params.userId, { name, email });
    res.json({ ok: true, user: updated });
  } catch (e) {
    if ((e == null ? void 0 : e.name) === "ConditionalCheckFailedException") {
      return res.status(404).json({ ok: false, error: "User not found" });
    }
    res.status(500).json({ ok: false, error: (e == null ? void 0 : e.message) || "Internal Error" });
  }
});
app.delete("/users/:userId", async (req, res) => {
  try {
    await db.delete(req.params.userId);
    res.status(204).send();
  } catch (e) {
    if ((e == null ? void 0 : e.name) === "ConditionalCheckFailedException") {
      return res.status(404).json({ ok: false, error: "User not found" });
    }
    res.status(500).json({ ok: false, error: (e == null ? void 0 : e.message) || "Internal Error" });
  }
});
app.use((_req, res) => {
  res.status(404).json({ ok: false, error: "Not Found" });
});
if (process.env.NODE_ENV !== "lambda") {
  const port = process.env.PORT || 3e3;
  app.listen(port, () => {
    console.log(`Express running on :${port}`);
  });
}
var app_default = app;

export {
  app_default
};
