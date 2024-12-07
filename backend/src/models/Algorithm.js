import mongoose from "mongoose";

const algorithmSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    tags: { type: [String], default: [] },
    complexity: {
        time: { type: String, required: true },
        space: { type: String, required: true },
    },
    input: {
        dataStructures: { type: [String], default: [] },
        parameters: { type: [String], default: [] },
    },
    codes: {
        cpp: { type: String, default: "" },
        java: { type: String, default: "" },
        python: { type: String, default: "" }
    },
    createdAt: { type: Date, default: Date.now },
});

const Algorithm = mongoose.model("Algorithm", algorithmSchema);

export default Algorithm;
