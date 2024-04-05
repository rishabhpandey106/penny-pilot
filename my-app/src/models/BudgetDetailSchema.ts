import mongoose from "mongoose"

const budgetdetailschema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide an username"],
        default: "rishabh"
    },
    name: {
        type: String,
        required: [true, "Please provide a name"]
    },
    budgetid: {
        type: String,
        required: [true, "Please provide a budgetID"]
    },
    amount: {
        type: Number,
        required: [true, "Please provide an amount"]
    },
    remaining: {
        type: Number,
        required: [true, "Please provide an remianing amount"]
    },
    suffix: {
        type: String,
        required: [true, "Please provide a suffix"]
    },
    timestamp: {
        type: Date,
        default: Date.now()
    }
})

const Budgetdetail = mongoose.models.budgetdetail || mongoose.model("budgetdetail",budgetdetailschema)
export default Budgetdetail