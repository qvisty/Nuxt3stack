export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const carId = getRouterParam(event, 'id')!
  const body = await readBody(event)
  const db = useDrizzle()

  const car = await db
    .select()
    .from(tables.cars)
    .where(and(eq(tables.cars.id, carId), eq(tables.cars.userId, session.user.id)))
    .get()

  if (!car) {
    throw createError({ statusCode: 404, message: 'Bil ikke fundet' })
  }

  if (!body.name?.trim()) {
    throw createError({ statusCode: 400, message: 'Bilnavn er påkrævet' })
  }
  if (!body.licensePlate?.trim()) {
    throw createError({ statusCode: 400, message: 'Nummerplade er påkrævet' })
  }

  await db
    .update(tables.cars)
    .set({
      name: body.name.trim(),
      licensePlate: body.licensePlate.trim().toUpperCase(),
      make: body.make?.trim() || null,
      model: body.model?.trim() || null,
      year: body.year ? Number(body.year) : null,
      color: body.color?.trim() || null,
      mileage: body.mileage ? Number(body.mileage) : 0,
      purchasePrice: body.purchasePrice ? Number(body.purchasePrice) : null,
      loanRemaining: body.loanRemaining ? Number(body.loanRemaining) : 0,
      notes: body.notes?.trim() || null,
      updatedAt: Math.floor(Date.now() / 1000),
    })
    .where(eq(tables.cars.id, carId))

  return await db
    .select()
    .from(tables.cars)
    .where(eq(tables.cars.id, carId))
    .get()
})
