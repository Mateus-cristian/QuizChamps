import { Worker } from "bullmq";
import { redis } from "../redis";
import { sendConfirmationEmail } from "@/domain/email.server";

new Worker(
  "mail-queue",
  async (job) => {
    const { type, data } = job.data;

    if (type === "confirmation") {
      await sendConfirmationEmail(data);
    }
  },
  { connection: redis }
);
