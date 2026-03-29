import { migrate } from 'drizzle-orm/libsql/migrator'
import { db } from '../utils/db'

export default defineNitroPlugin(async () => {
  await migrate(db, { migrationsFolder: 'server/db/migrations' })
})
