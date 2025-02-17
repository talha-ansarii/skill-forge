import mongoose, { Schema } from 'mongoose';

const formSchema = new Schema({
  skills: [{ type: String }],
  interests: [{ type: String }],
  certificates: [{ type: String }],
  experience: String,
  education: String,
  time: String,
  careerPath: String,
  email : String
});

export default mongoose.models.Form || mongoose.model('Form', formSchema);
