import { Queue } from "bullmq";
import { redis } from "@/redis";

export const mailQueue = new Queue("mail", {
  connection: redis,
});

async function enqueueConfirmationEmail(
  user: { name: string; email: string },
  token: string
) {
  await mailQueue.add("send-confirmation", {
    type: "confirmation",
    data: {
      email: user.email,
      name: user.name,
      confirmUrl: `http://localhost:3000/verify?token=${token}`,
    },
  });
}

export { enqueueConfirmationEmail };
