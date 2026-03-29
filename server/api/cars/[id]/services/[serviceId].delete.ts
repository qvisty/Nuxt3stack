import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const carId = getRouterParam(event, 'id')!
  const serviceId = getRouterParam(event, 'serviceId')!

  const car = await db
    .select()
    .from(schema.cars)
    .where(and(eq(schema.cars.id, carId), eq(schema.cars.userId, session.user.id)))
    .get()

  if (!car) throw createError({ statusCode: 404, message: 'Bil ikke fundet' })

  const service = await db
    .select()
    .from(schema.serviceRecords)
    .where(and(eq(schema.serviceRecords.id, serviceId), eq(schema.serviceRecords.carId, carId)))
    .get()

  if (!service) throw createError({ statusCode: 404, message: 'Servicepost ikke fundet' })

  await db.delete(schema.serviceRecords).where(eq(schema.serviceRecords.id, serviceId))

  return { success: true }
})
