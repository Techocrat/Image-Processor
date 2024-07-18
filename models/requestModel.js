import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ["pending", "processing", "completed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const Request = mongoose.model("Request", requestSchema);
export default Request;
