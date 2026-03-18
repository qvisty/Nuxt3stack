export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const db = useDrizzle()

  const cars = await db
    .select()
    .from(tables.cars)
    .where(eq(tables.cars.userId, session.user.id))
    .orderBy(desc(tables.cars.createdAt))
    .all()

  return cars
})
