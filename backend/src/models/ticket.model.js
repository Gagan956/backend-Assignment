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
    maxlength: 100,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000,
    trim: true,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "low",
  },
  status: {
    type: String,
    enum: ["open", "inProgress", "resolved", "closed"],
    default: "open",
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
},{
  timestamps: true,
});


const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
