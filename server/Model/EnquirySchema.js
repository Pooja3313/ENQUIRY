const mongoose = require("mongoose");

const EnquirySchema = new mongoose.Schema({
    customerName: {
       type: String,
       required: true 
      },
    mobile: { 
      type: String,
       required: true 
      },
    email: {
       type: String,
        required: true },

    interestedProducts: {
       type: [String], 
       required: true }, 

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true }
);
const Enquiry = mongoose.model("Enquiry", EnquirySchema);
  
module.exports = Enquiry;
