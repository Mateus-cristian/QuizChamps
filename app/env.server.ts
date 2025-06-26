import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  EMAIL_ADMIN: z.string().email(),
  PASSWORD_ADMIN: z.string()
})

const envParse = envSchema.safeParse(process.env)

if (!envParse.success) {
  console.error('❌ Invalid environment variables', envParse.error.format())
  process.exit(1)
}

function env() {
  return envSchema
    .parse(process.env)
}

export { env }