import { Schema, model } from "mongoose"


const coomentSchema = new Schema({
    content: {
        type: String,
        required: true,

    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: "blog",
    },

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
} , {timestamps: true});

const comment = model("comment" , coomentSchema);

export {
    comment,
}