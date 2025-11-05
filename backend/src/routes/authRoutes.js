import express from "express";

const router = express.Router();

router.post("/register", async (req,res)=>{
    res.send("register");
})

router.post("/login", async (req,res)=>{
    res.send("login");
});

router.post("/forgot", async (req, res) => {
    // Minimal placeholder implementation for forgot password.
    // In a real app: validate email, generate token, send email, etc.
    try {
        const { email } = req.body || {};
        console.log(`Password reset requested for: ${email}`);
        // Always return 200 to avoid leaking whether the email exists
        return res.status(200).send("If an account with that email exists, a reset link will be sent.");
    } catch (err) {
        console.error(err);
        return res.status(500).send("Server error");
    }
});

export default router;
