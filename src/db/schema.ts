import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const practitionersTable = sqliteTable("practitioners_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
});
