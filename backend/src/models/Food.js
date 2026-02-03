import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        default: "main"
    }
}, {
    timestamps: true
});

const Food = mongoose.model("Food", foodSchema);

export default Food;