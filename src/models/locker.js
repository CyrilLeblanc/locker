import mongoose from "mongoose";

const lockerSchema = new mongoose.Schema(
    {
        number: { type: String, required: true, unique: true },
        size: {
            type: String,
            enum: ["small", "medium", "large"],
            required: true,
        },
        status: {
            type: String,
            enum: ["available", "reserved", "maintenance"],
            default: "available",
        },
        price: { type: Number, required: true, min: 0 },
    },
    {
        timestamps: true,
    }
);

// Find all available lockers
lockerSchema.statics.findAvailable = function () {
    return this.find({ status: "available" });
};

// Find locker by number
lockerSchema.statics.findByNumber = function (number) {
    return this.findOne({ number });
};

const Locker = mongoose.model("Locker", lockerSchema);

export default Locker;
