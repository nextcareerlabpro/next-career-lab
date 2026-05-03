import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const FROM = `"Upgrade Your Resume" <${process.env.GMAIL_USER}>`;
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://upgradeyourresume.com";

export async function sendMail(to: string, subject: string, html: string) {
  await transporter.sendMail({ from: FROM, to, subject, html });
}
