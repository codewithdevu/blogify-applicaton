import { Router } from "express";
import cloudinary from "../config/cloudinary.js";
import { Blog } from "../model/blog.js"
import { comment } from "../model/comment.js";
import multer from "multer";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get("/add-new", (req, res) => {
  return res.render("addblog", {
    user: req.user,
  })
})

router.post("/", upload.single("coverImageURL"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("Image is required");
    }

    const { title, body } = req.body;

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "blog_uploads" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const blog = await Blog.create({
      title,
      body,
      createdBy: req.user._id,
      coverImageURL: result.secure_url,
    });

    return res.redirect(`/blog/${blog._id}`);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy")
  const comments = await comment.find({ blogId: req.params.id }).populate("createdBy")

  return res.render("blog", {
    user: req.user,
    blog,
    comments,
  })
})

router.post("/comment/:blogId", async (req, res) => {
  await comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

export default router;