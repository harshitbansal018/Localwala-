import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  try {

    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "harshitbansal00000@gmail.com",
        pass: "nvhp edls lsbb stnd"
      }
    });

    const mailOptions = {
      from: "harshitbansal00000@gmail.com",
      to: "harshitbansal00000@gmail.com",
      subject: "New Contact Message - LocalWala",
      html: `
        <h2>New Contact Message</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({
      message: "Email sent successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to send email"
    });

  }
});

export default router;