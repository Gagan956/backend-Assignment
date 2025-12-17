// import Comment from "../models/comment.model.js"
// import Ticket from "../models/ticket.model.js"


// export const  addComment = async(req,res) =>{
//     try {
//         const { ticket_id } = req.params
//         const { comment_text}  = req.body 
//        const ticket = await  Ticket.findById(ticket_id)
       
//        if(!ticket){
//         return res.status(404).json({
//             success: false, 
//             message: "Ticket not found"

//         })
//        }

//        //check permission
//      const canComment = req.user.role === "admin" ||
//      ticket.created_by.toString() === req.user._id.toString()

//      if(!canComment){
//          return res.status(404).json({
//             success: false,
//             message: "you do not have permission to comment"

//         })
//      }

//      const comment = await Comment.create({
//         ticket_id: ticket_id,
//         author : req.user.id
//      })

//      const populatedComment = await comment.findById(comment._id)
//      .populate("author", "name email role")
      
//         return res.status(201).json({
//             success : true,
//            data: populatedComment
//         })
//     } catch (error) {
//          console.log(error)
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error"
//         })
//     }
// }

// export const getTicketComment = async(req,res) =>{
//     try {
//        const { ticket_id } = req.params
//        const ticket = await  Ticket.findById(ticket_id)
       
//        if(!ticket){
//         return res.status(404).json({
//             success: false, 
//             message: "Ticket not found"

//         }) 
//         }

//         // check permission

//         if(req.user.role!== "admin" && req.user._id.toString() !== ticket.created_by.toString()){
//             return res.status(404).json({
//                 success: false,
//                 message: "you can only view your own comments"
//             })
//         }
//         if(req.user.role === "agent" && ticket.assigned_to  && 
//             ticket.assigned_to.toString() !== req.user._id.toString()){
//                 return res.status(404).json({
//                     success: false,
//                     message: "you can only view assigned comments"
//                 })
//             }
//         const comments  =await Comment.find({ticket_id: ticket_id})
//         .populate("author", "name email role")
//         return res.status(200).json({
//             success: true,
//            data: comments,
//            count : comments.length
//         })
//     } catch (error) {
//           console.log(error)
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error"
//         })
//     }
// }