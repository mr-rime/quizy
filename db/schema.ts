import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";



export const user = pgTable("user", {
    id: uuid("id").defaultRandom().primaryKey(),
    username: varchar("username", { length: 50 }).notNull().unique(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    password: varchar("password", { length: 255 }),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date()),
});


export const flashcardSet = pgTable("flashcard_set", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 100 }).notNull(),
    description: varchar("description", { length: 500 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const card = pgTable("card", {
    id: uuid("id").defaultRandom().primaryKey(),
    setId: uuid("set_id")
        .notNull()
        .references(() => flashcardSet.id, { onDelete: "cascade" }),

    term: varchar("term", { length: 255 }).notNull(),
    definition: varchar("definition", { length: 2000 }),
    imageUrl: varchar("image_url", { length: 500 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date()),
});
