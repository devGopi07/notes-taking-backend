const mongoose = require("mongoose");

let NoteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    email: { type: String, required: true }, 
    createdAt: { type: Date, default: Date.now() },
  },
  {
    collection: "notes",
    versionKey: false,
  }
);

let NoteModel = mongoose.model("notes", NoteSchema);

module.exports = { NoteModel };
