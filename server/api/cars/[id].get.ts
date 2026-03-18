export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const carId = getRouterParam(event, 'id')!
  const db = useDrizzle()

  const car = await db
    .select()
    .from(tables.cars)
    .where(and(eq(tables.cars.id, carId), eq(tables.cars.userId, session.user.id)))
    .get()

  if (!car) {
    throw createError({ statusCode: 404, message: 'Bil ikke fundet' })
  }

  return car
})
