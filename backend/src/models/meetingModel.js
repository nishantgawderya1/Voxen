import mongoose from "mongoose";

const meetingScheme = new mongoose.Schema({
  user_id: { type: String },
  meetingCode: { type: String },
  name: { type: String, default: "" },
  date: { type: Date, default: Date.now },
});

const meeting = mongoose.model("Meeting", meetingScheme);

export { meeting };
