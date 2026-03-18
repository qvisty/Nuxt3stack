export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const body = await readBody(event)

  if (!body.name?.trim()) {
    throw createError({ statusCode: 400, message: 'Bilnavn er påkrævet' })
  }
  if (!body.licensePlate?.trim()) {
    throw createError({ statusCode: 400, message: 'Nummerplade er påkrævet' })
  }

  const db = useDrizzle()
  const id = crypto.randomUUID()

  await db.insert(tables.cars).values({
    id,
    userId: session.user.id,
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
  })

  const car = await db
    .select()
    .from(tables.cars)
    .where(eq(tables.cars.id, id))
    .get()

  return car
})
