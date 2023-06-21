const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PriorityValues = {
  values: ["Low", "Medium", "High"],
  message: "Priority is required.",
};

const getNotesSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: PriorityValues.values,
    required: true,
  },
});

const allNotes = mongoose.model("notes", getNotesSchema);
module.exports = allNotes;
