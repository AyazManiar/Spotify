import mongoose from "mongoose"

const albumSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    albumCoverUrl: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
},
{ timestamps: true }
)

export default mongoose.model("Album", albumSchema);