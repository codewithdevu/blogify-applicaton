import { Schema, model } from "mongoose"
const { createHmac, randomBytes } = await import('node:crypto');
import {createTokenForUser} from  "../services/authenticaton.js"

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL: {
        type: String,
        default: "/image/defaultProfile.png"
    },
    role: {
        type: String,
        enum: ["Admin", "User"],
        default: "User",
    },
}, { timestamps: true })

userSchema.pre("save", function async () {
    const user = this;

    if (!user.isModified("password")) return;

    const salt = randomBytes(16).toString("hex");
    const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

})

userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
    const user = await this.findOne({ email })
    if (!user) throw new Error("User not found")

    const salt = user.salt;
    const hashedPassword = user.password;

    const userprovidehash =  createHmac("sha256", salt).update(password).digest("hex");

    if(hashedPassword !== userprovidehash)throw new Error("incorrect password")

    const token = createTokenForUser(user);
    return token;
});

const User = model("User", userSchema)

export default User;

