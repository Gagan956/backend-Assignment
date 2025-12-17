import Ticket from "../models/ticket.model.js";
import User from "../models/user.model.js";

const generateTicketId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const randomNumber = Math.floor(Math.random() * 1000).toString().padStart(4, "0");
  return `TKT-${timestamp}-${randomNumber}`;
};

// Create Ticket controller
export const createTicket = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    if (!title || !description || !priority) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const validPriorities = ["low", "medium", "high", "critical"];
    if (!validPriorities.includes(priority.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid priority. Use low, medium, high, or critical",
      });
    }

    const ticket = await Ticket.create({
      title,
      description,
      priority: priority.toLowerCase(),
      ticket_id: generateTicketId(),
      created_by: req.user._id,
      status: "open"
    });

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate("created_by", "name email")
      .populate("assigned_to", "name email");

    return res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      data: populatedTicket,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Assign Ticket controller
export const assignTicket = async (req, res) => {
  const { ticketId } = req.params;
  const { agentId } = req.body;

  try {
    const agent = await User.findById(agentId);
    if (!agent || agent.role !== "agent") {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }
    
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    ticket.assigned_to = agentId;
    ticket.status = "inProgress";
    await ticket.save();

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate("created_by", "name email")
      .populate("assigned_to", "name email");

    return res.status(200).json({
      success: true,
      message: "Ticket assigned successfully",
      data: populatedTicket,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update Ticket controller
export const updateTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    const validStatus = ["open", "inProgress", "resolved", "closed"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    if (req.user.role === "agent" && ticket.assigned_to.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to update this ticket",
      });
    }

    ticket.status = status;
    await ticket.save();

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate("created_by", "name email")
      .populate("assigned_to", "name email");

    return res.status(200).json({
      success: true,
      message: "Ticket updated successfully",
      data: populatedTicket,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get All tickets controller
export const getAllTicket = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("created_by", "name email")
      .populate("assigned_to", "name email")
      .sort("-created_at");

    return res.status(200).json({
      success: true,
      data: tickets,
      count: tickets.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// List own tickets (User)
export const getUserTicket = async (req, res) => {
  try {
    const tickets = await Ticket.find({ created_by: req.user._id })
      .populate("created_by", "name email")
      .populate("assigned_to", "name email")
      .sort("-created_at");

    return res.status(200).json({
      success: true,
      data: tickets,
      count: tickets.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Listing assigned tickets (agent)
export const getTicketByAgent = async (req, res) => {
  try {
    const tickets = await Ticket.find({ assigned_to: req.user._id })
      .populate("created_by", "name email")
      .populate("assigned_to", "name email")
      .sort("-created_at");

    return res.status(200).json({
      success: true,
      message: "Tickets listed successfully",
      data: tickets,
      count: tickets.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get ticket by id
export const getTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await Ticket.findById(ticketId)
      .populate("created_by", "name email")
      .populate("assigned_to", "name email");

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    if (req.user.role === "user" && ticket.created_by.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only view your own ticket",
      });
    }

    if (req.user.role === "agent" && ticket.assigned_to.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only view ticket assigned to you",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ticket found",
      data: ticket,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};