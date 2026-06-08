import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const billingCycleEnum = pgEnum('billing_cycle', ['MONTHLY', 'YEARLY'])

export const users = pgTable("users", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull()
})

export const subscriptions = pgTable("subscriptions", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").notNull().references(() => users.id),
    name: text("name").notNull(),
    price: text("price").notNull(),
    billingCycle: billingCycleEnum('billing_cycle').notNull(),
    renewalDate: timestamp("renewal_date").notNull(),
    reminderDays: integer("reminder_days").notNull().default(1),
    createdAt: timestamp("created_at").defaultNow()
})