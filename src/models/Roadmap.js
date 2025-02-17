import mongoose from "mongoose";

const { Schema } = mongoose;

// Define the course schema
const courseSchema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, required: true },
  }
);

// Define the roadmap schema
const roadmapSchema = new Schema(
  {
    beginner: [courseSchema],
    intermediate: [courseSchema],
    advanced: [courseSchema],
    email : { type: String, required: true }
  }
  
);

// Create a model

export default mongoose.models.Roadmap || mongoose.model('Roadmap', roadmapSchema);

