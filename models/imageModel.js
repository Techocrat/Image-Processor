import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  requestId: { type: String, required: true },
  productName: { type: String, required: true },
  inputUrls: [String],
  outputUrls: [String],
  status: {
    type: String,
    enum: ["pending", "processing", "completed"],
    default: "pending",
  },
});

const Image = mongoose.model("Image", imageSchema);
export default Image;
