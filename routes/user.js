import {Router} from "express";
import User from "../model/user.js";

const router = Router();

router.get("/signin" , (req , res) =>{
    res.render("signin");
});

router.get("/signup" , (req , res) =>{
    res.render("signup");
});

router.post("/signin" , async (req , res) => {
    const { email , password } =  req.body;
    try {
    const token = await User.matchPasswordAndGenerateToken(email , password);

    res.cookie("token" , token).redirect("/")
    } catch (error) {
        return res.render("signin" , {
            error: "Invalid Email or Password",
        });
        
    }
})

router.get("/logout" , (req , res) => {
    res.clearCookie("token").redirect("/")
})

router.post("/signup" , async (req , res) => {
    console.log(req.body);
    const { fullName , email , password } =  req.body;
    await User.create({
        fullName,
        email,
        password,
    });
    res.redirect("/")
});

export default router ;