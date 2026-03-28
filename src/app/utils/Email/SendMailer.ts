import nodemailer from "nodemailer";
import config from "../../../config";

export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: config.support_email,
      pass: config.app_password,
    },
  });

  try {
    await transporter.sendMail({
      from: `"MarketHub Support" <${config.support_email}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};