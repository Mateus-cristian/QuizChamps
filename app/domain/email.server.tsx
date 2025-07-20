import { env } from "@/env.server";
import nodemailer, { getTestMessageUrl } from "nodemailer";
import { render } from "@react-email/render";
import type { JSX } from "react";
import type Mail from "nodemailer/lib/mailer";
import { ConfirmationEmail } from "@/ui/email/templates/confirmation-email";

const transporter = nodemailer.createTransport({
  host: env().SMTP_HOST,
  port: Number(env().SMTP_PORT),
  auth: {
    user: env().SMTP_USER,
    pass: env().SMTP_PASS,
  },
});

async function sendEmail({
  element,
  ...options
}: Mail.Options & { element: JSX.Element }) {
  const html = await render(element);
  const text = await render(element, { plainText: true });

  try {
    const mail = await transporter.sendMail({
      from: '"QuizChamps" <no-reply@quizchamps.io>',
      ...options,
      html,
      text,
    });

    const previewUrl = getTestMessageUrl(mail);
    console.log("📧 Email enviado. Preview:", previewUrl);
    return previewUrl;
  } catch (error) {
    console.error("❌ Erro ao enviar e-mail:", error);
    throw error;
  }
}

async function sendConfirmationEmail({
  email,
  name,
  token,
}: {
  email: string;
  name: string;
  token: string;
}) {
  await sendEmail({
    to: email,
    subject: "Confirme seu e-mail",
    element: <ConfirmationEmail name={name} token={token} />,
  });
}

export { sendConfirmationEmail, sendEmail };
