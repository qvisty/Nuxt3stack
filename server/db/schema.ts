import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  avatar: text('avatar'),
  googleId: text('google_id').unique(),
  createdAt: integer('created_at', { mode: 'number' }).notNull().default(sql`(unixepoch())`),
})

export const cars = sqliteTable('cars', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  licensePlate: text('license_plate').notNull(),
  make: text('make'),
  model: text('model'),
  year: integer('year'),
  color: text('color'),
  mileage: integer('mileage').default(0),
  purchasePrice: real('purchase_price'),
  loanRemaining: real('loan_remaining').default(0),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'number' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'number' }).notNull().default(sql`(unixepoch())`),
})

export const serviceRecords = sqliteTable('service_records', {
  id: text('id').primaryKey(),
  carId: text('car_id').notNull().references(() => cars.id, { onDelete: 'cascade' }),
  date: text('date').notNull(),
  mileage: integer('mileage'),
  type: text('type').notNull(),
  description: text('description'),
  cost: real('cost').default(0),
  provider: text('provider'),
  createdAt: integer('created_at', { mode: 'number' }).notNull().default(sql`(unixepoch())`),
})
