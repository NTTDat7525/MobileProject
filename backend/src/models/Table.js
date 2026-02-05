import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
        tableId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        type: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: ['available', 'booked'],
            default: 'available'
        }
    },
    {
        timestamps: true
});

const Table = mongoose.model('Table', tableSchema);

export default Table;