import mongoose from "mongoose"

const budgetlistschema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide an username"],
        default: "rishabh"
    },
    name: {
        type: String,
        required: [true, "Please provide a name"]
    },
    amount: {
        type: Number,
        required: [true, "Please provide an amount"]
    },
    left: {
        type: Number,
        required: [true, "Please provide an left"]
    }
})

const BudgetList = mongoose.models.budgetlist || mongoose.model("budgetlist",budgetlistschema)
export default BudgetList