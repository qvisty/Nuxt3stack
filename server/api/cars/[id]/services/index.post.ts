export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const carId = getRouterParam(event, 'id')!
  const body = await readBody(event)
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

  if (!body.date) {
    throw createError({ statusCode: 400, message: 'Dato er påkrævet' })
  }
  if (!body.type) {
    throw createError({ statusCode: 400, message: 'Type er påkrævet' })
  }

  const id = crypto.randomUUID()

  await db.insert(tables.serviceRecords).values({
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
      .update(tables.cars)
      .set({
        mileage: Number(body.mileage),
        updatedAt: Math.floor(Date.now() / 1000),
      })
      .where(eq(tables.cars.id, carId))
  }

  return await db
    .select()
    .from(tables.serviceRecords)
    .where(eq(tables.serviceRecords.id, id))
    .get()
})
