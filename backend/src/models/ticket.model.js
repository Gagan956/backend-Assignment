import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  ticket_id: {
    type: String,
    unique: true,
    required: true,
  },

  title: {
    type: String,
    required: true,
    minlength: 3,
  },
  description: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    eum: ["low", "medium", "high", "critical"],
  },
  status: {
    type: String,
    eum: ["open", "inProgress", "resolved", "closed"],
    default: "inProgress",
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

ticketSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});
const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
