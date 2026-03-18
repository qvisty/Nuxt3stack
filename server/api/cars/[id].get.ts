import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const carId = getRouterParam(event, 'id')!

  const car = await db
    .select()
    .from(schema.cars)
    .where(and(eq(schema.cars.id, carId), eq(schema.cars.userId, session.user.id)))
    .get()

  if (!car) throw createError({ statusCode: 404, message: 'Bil ikke fundet' })

  return car
})
