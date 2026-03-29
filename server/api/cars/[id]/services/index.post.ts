import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const carId = getRouterParam(event, 'id')!
  const body = await readBody(event)

  const car = await db
    .select()
    .from(schema.cars)
    .where(and(eq(schema.cars.id, carId), eq(schema.cars.userId, session.user.id)))
    .get()

  if (!car) throw createError({ statusCode: 404, message: 'Bil ikke fundet' })
  if (!body.date) throw createError({ statusCode: 400, message: 'Dato er påkrævet' })
  if (!body.type) throw createError({ statusCode: 400, message: 'Type er påkrævet' })

  const id = crypto.randomUUID()

  await db.insert(schema.serviceRecords).values({
    id,
    carId,
    date: body.date,
    mileage: body.mileage ? Number(body.mileage) : null,
    type: body.type,
    description: body.description?.trim() || null,
    cost: body.cost ? Number(body.cost) : 0,
    provider: body.provider?.trim() || null,
  })

  // Opdater bilens km-stand hvis ny km-stand er højere
  if (body.mileage && Number(body.mileage) > (car.mileage ?? 0)) {
    await db
      .update(schema.cars)
      .set({ mileage: Number(body.mileage), updatedAt: Math.floor(Date.now() / 1000) })
      .where(eq(schema.cars.id, carId))
  }

  return db.select().from(schema.serviceRecords).where(eq(schema.serviceRecords.id, id)).get()
})
