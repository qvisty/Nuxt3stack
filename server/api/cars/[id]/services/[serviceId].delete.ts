export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const carId = getRouterParam(event, 'id')!
  const serviceId = getRouterParam(event, 'serviceId')!
  const db = useDrizzle()

  // Verificer at bilen tilhører brugeren
  const car = await db
    .select()
    .from(tables.cars)
    .where(and(eq(tables.cars.id, carId), eq(tables.cars.userId, session.user.id)))
    .get()

  if (!car) {
    throw createError({ statusCode: 404, message: 'Bil ikke fundet' })
  }

  const service = await db
    .select()
    .from(tables.serviceRecords)
    .where(and(eq(tables.serviceRecords.id, serviceId), eq(tables.serviceRecords.carId, carId)))
    .get()

  if (!service) {
    throw createError({ statusCode: 404, message: 'Servicepost ikke fundet' })
  }

  await db.delete(tables.serviceRecords).where(eq(tables.serviceRecords.id, serviceId))

  return { success: true }
})
