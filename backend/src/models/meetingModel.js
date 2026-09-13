import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    // The owner's username. Kept as a string rather than an ObjectId ref so
    // existing history rows stay readable; usernames are immutable (there is
    // no rename endpoint), so it is stable as a key.
    user_id: { type: String, required: true, index: true },
    meetingCode: { type: String, required: true, trim: true, maxlength: 64 },
    name: { type: String, default: "", trim: true, maxlength: 80 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// History is always read as "this user's meetings, newest first".
meetingSchema.index({ user_id: 1, date: -1 });

const meeting = mongoose.model("Meeting", meetingSchema);

export { meeting };
