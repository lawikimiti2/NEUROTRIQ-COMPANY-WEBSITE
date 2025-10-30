import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  serviceType: { type: String },
  projectBudget: { type: String },
  timeline: { type: String },
  message: { type: String, required: true },
  newsletter: { type: Boolean, default: false }
}, { timestamps: true });

const Contact = mongoose.models.Contact || mongoose.model("Contact", ContactSchema);
export default Contact;
