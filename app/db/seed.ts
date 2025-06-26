import { env } from '@/env.server'
import { db } from './kasely'
import bcrypt from 'bcryptjs'

async function main() {
  const EMAIL_ADMIN = env().EMAIL_ADMIN
  const PASSWORD_ADMIN = env().PASSWORD_ADMIN

  const user = await db.selectFrom('users').select('id').where('email', '=', EMAIL_ADMIN).executeTakeFirst()

  if (!user) {
    await db.insertInto('users').values({
      name: 'Super Admin',
      email:EMAIL_ADMIN,
      password_hash: await bcrypt.hash(PASSWORD_ADMIN, 10),
      role: 'super_admin',
      is_verified: true,
    }).execute()

    console.log('✅ Super admin criado.')
  } else {
    console.log('ℹ️ Super admin já existe.')
  }
  process.exit()
}

main()
