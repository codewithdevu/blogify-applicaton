import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.js";
import blogRoute from "./routes/blog.js";
import { Blog } from "./model/blog.js";
import { checkAuthenticationCookie } from "./middleware/authentication.js";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  return res.render("homepage", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

export default app;