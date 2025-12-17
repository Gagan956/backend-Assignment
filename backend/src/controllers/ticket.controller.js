import Ticket from "../models/ticket.model.js";
import User from "../models/user.model.js";

const generateTicketId = () => {
  const timestamp = new Date().toString.slice(-6);
  const randomNumber = Math.floor(Math.random() * 1000000);
  return `TKT-${timestamp}-${randomNumber}`;
};

// create Ticket controller
export const createTicket = async (req, res) => {
     try {
    const { title, description, priority } = req.body;

    if (!title || !description || !priority) {
      return res.status(400).json({
        success: true,
        message: "Please provide all required fields",
      });
    }
    const ticket = await Ticket.create({
      title,
      description,
      priority: priority || medium,
      ticket_id: generateTicketId,
      created_by: req.user._id
    }); 

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate("created_by", "name email")
      .populate("assigned_to", "name email");

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      data: populatedTicket,
    });
  } catch (error) {
    console.log(error);
     res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//Assign Ticket controller

export const assignTicket = async (req, res) => {
  const { ticketId } = req.params;
  const { agentId } = req.body;

  try {
    const agent = await User.findById(agentId);
    if (!agent || agent.role!== "agent") {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    ticket.assigned_to = agentId;
    ticket.status = "inProgress";
    await ticket.save();

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate("created_by", "name email")
      .populate("assigned_to", "name email");

    res.status(201).json({
      success: true,
      data: populatedTicket,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

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

    //check permission
    if (
      req.user.role === "agent" && ticket.assigned_to.toString()!== req.user._id.toString()
    ) {
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

    res.status(200).json({
      success: true,
      message: "Ticket updated successfully",
      data: ticket,
    });
    res.status(201).json({
      success: true,
      data: populatedTicket,
    });
  } catch (error) {
    console.log(error);
     res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//get All ticket controller
export const getAllTicket = async (req, res) => {
  try {
    const ticket = await Ticket.find()
      .populate("created_by", "name email")
      .populate("assigned_to", "name email")
      .sort("-created_at");

    res.status(201).json({
      success: true,
      data: ticket,
      count: ticket.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//List own tickets (User)

export const getUserTicket = async (req, res) => {
  try {
    const ticket = await Ticket.find({ created_by: req.user._id })
      .populate("created_by", "name email")
      .populate("assigned_to", "name email")
      .sort("-created_at");
 
    res.status(201).json({
      success: true,
      data: ticket,
      count: ticket.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//listing assigned tickets(agent)
export const getTicketByAgent = async (req, res) => {
  try {
    const ticket = await Ticket.find({ assigned_to: req.user._id })
      .populate("created_by", "name email")
      .populate("assigned_to", "name email")
      .sort("-created_at");

    res.status(200).json({
      success: true,
      message: "Tickets listed successfully",
      data: ticket,
      count: ticket.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//get ticket by id
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

    // check Permission

    if (
      req.user.role === "user" &&
      ticket.created_by.toString() !== req.user._id.toString()!== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "you can only view your own ticket",
      });
    }

    if (
      req.user.role === "agent" &&
      ticket.assigned_to.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "you can only view ticket assigned to you ",
      });
    }
    res.status(200).json({
      success: true,
      message: "Ticket found",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
