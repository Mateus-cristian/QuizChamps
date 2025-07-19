import nodemailer from "nodemailer";

async function createTestAccount() {
  const testAccount = await nodemailer.createTestAccount();

  console.log("Configuração SMTP Ethereal:");
  console.log(`SMTP_HOST=${testAccount.smtp.host}`);
  console.log(`SMTP_PORT=${testAccount.smtp.port}`);
  console.log(`SMTP_USER=${testAccount.user}`);
  console.log(`SMTP_PASS=${testAccount.pass}`);
  console.log(
    "Acesse https://ethereal.email com esse usuário para ver os emails."
  );
}

createTestAccount().catch(console.error);
