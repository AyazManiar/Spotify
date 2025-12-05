import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },

    albums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }]
});

export default mongoose.model("User", userSchema);