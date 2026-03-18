import { eq, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  return db
    .select()
    .from(schema.cars)
    .where(eq(schema.cars.userId, session.user.id))
    .orderBy(desc(schema.cars.createdAt))
    .all()
})
