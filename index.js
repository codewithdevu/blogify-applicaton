import 'dotenv/config';
import express from "express";
import path from "path";
import userRoute from "./routes/user.js";
import blogRoute from "./routes/blog.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser"
import { Blog } from "./model/blog.js";
import { checkAuthenticationCookie } from "./middleware/authentication.js";

const app = express();
const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URL).then((e) => console.log("mongodb connected"));


app.set("view engine" , "ejs");
app.set("views" , path.resolve("./views"));

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkAuthenticationCookie("token"))
app.use(express.static(path.resolve("./public")))

app.get("/" , async (req , res) => {
    const allBlogs = await Blog.find({});
    return res.render("homepage" , {
        user: req.user,
        blogs: allBlogs,
    })
})

app.use("/user" , userRoute);
app.use("/blog" , blogRoute);

app.listen(PORT , () => console.log(`Server started at http://localhost:${PORT}`));