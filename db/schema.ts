import {
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
    primaryKey
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("user", {
    id: uuid("id").defaultRandom().primaryKey(),
    username: text("username").notNull().unique(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    password: varchar("password", { length: 255 }),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const sessions = pgTable("session", {
    id: uuid("id").defaultRandom().primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date()),
});


export const flashcardSets = pgTable("flashcard_set", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 100 }).notNull(),
    description: varchar("description", { length: 500 }),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date()),
});


export const cards = pgTable("card", {
    id: uuid("id").defaultRandom().primaryKey(),
    setId: uuid("set_id")
        .notNull()
        .references(() => flashcardSets.id, { onDelete: "cascade" }),
    term: varchar("term", { length: 255 }).notNull(),
    definition: varchar("definition", { length: 2000 }),
    imageUrl: varchar("image_url", { length: 500 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const folders = pgTable("folder", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 100 }).notNull(),
    description: varchar("description", { length: 500 }),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const folderSets = pgTable("folder_set", {
    folderId: uuid("folder_id")
        .notNull()
        .references(() => folders.id, { onDelete: "cascade" }),
    setId: uuid("set_id")
        .notNull()
        .references(() => flashcardSets.id, { onDelete: "cascade" }),
}, (t) => ({
    pk: primaryKey({ columns: [t.folderId, t.setId] }),
}));

export const userRelations = relations(users, ({ many }) => ({
    sessions: many(sessions),
    flashcardSets: many(flashcardSets),
    folders: many(folders),
    favorites: many(favorites),
}));

export const sessionRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
    
}));


export const flashcardSetRelations = relations(flashcardSets, ({ one, many }) => ({
    user: one(users, {
        fields: [flashcardSets.userId],
        references: [users.id],
    }),
    cards: many(cards),
    folderSets: many(folderSets),
}));


export const cardRelations = relations(cards, ({ one, many }) => ({
    set: one(flashcardSets, {
        fields: [cards.setId],
        references: [flashcardSets.id],
    }),
    favorites: many(favorites),
}));

export const folderRelations = relations(folders, ({ one, many }) => ({
    user: one(users, {
        fields: [folders.userId],
        references: [users.id],
    }),
    folderSets: many(folderSets),
}));

export const folderSetRelations = relations(folderSets, ({ one }) => ({
    folder: one(folders, {
        fields: [folderSets.folderId],
        references: [folders.id],
    }),
    set: one(flashcardSets, {
        fields: [folderSets.setId],
        references: [flashcardSets.id],
    }),
}));

export const favorites = pgTable("favorite", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    cardId: uuid("card_id")
        .notNull()
        .references(() => cards.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
});

export const favoriteRelations = relations(favorites, ({ one }) => ({
    user: one(users, {
        fields: [favorites.userId],
        references: [users.id],
    }),
    card: one(cards, {
        fields: [favorites.cardId],
        references: [cards.id],
    }),
}));