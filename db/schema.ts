import {
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
    primaryKey,
    integer,
    boolean,
    json,
    pgEnum,
    index
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const processedImages = pgTable("processed_image", {
    id: uuid("id").defaultRandom().primaryKey(),
    originalUrl: text("original_url").notNull().unique(),
    optimizedUrl: text("optimized_url"),
    width: integer("width"),
    height: integer("height"),
    createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
    originalUrlIdx: index("processed_image_original_url_idx").on(table.originalUrl),
})).enableRLS();

export const users = pgTable("user", {
    id: uuid("id").defaultRandom().primaryKey(),
    username: text("username").notNull().unique(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    password: varchar("password", { length: 255 }),
    image: text("image"),
    role: varchar("role", { length: 20 }).notNull().default("user"),
    playAudioOnProgress: boolean("play_audio_on_progress").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date()),
}, (table) => ({
    usernameIdx: index("user_username_idx").on(table.username),
    emailIdx: index("user_email_idx").on(table.email),
})).enableRLS();

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
}, (table) => ({
    tokenIdx: index("session_token_idx").on(table.token),
    userIdIdx: index("session_user_id_idx").on(table.userId),
    expiresAtIdx: index("session_expires_at_idx").on(table.expiresAt),
})).enableRLS();


export const categoryEnum = pgEnum("category", ["english", "other"]);

export const flashcardSets = pgTable("flashcard_set", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 100 }).notNull(),
    description: varchar("description", { length: 500 }),
    category: categoryEnum("category").notNull().default("english"),
    isPublic: boolean("is_public").notNull().default(false),
    isPublished: boolean("is_published").notNull().default(false),
    likeCount: integer("like_count").notNull().default(0),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date()),
}, (table) => ({
    userIdIdx: index("flashcard_set_user_id_idx").on(table.userId),
    isPublicIdx: index("flashcard_set_is_public_idx").on(table.isPublic),
    categoryIdx: index("flashcard_set_category_idx").on(table.category),
    createdAtIdx: index("flashcard_set_created_at_idx").on(table.createdAt),
    likeCountIdx: index("flashcard_set_like_count_idx").on(table.likeCount),
    // Composite index for discovery queries
    publicCategoryIdx: index("flashcard_set_public_category_idx").on(table.isPublic, table.category),
})).enableRLS();


export const cards = pgTable("card", {
    id: uuid("id").defaultRandom().primaryKey(),
    setId: uuid("set_id")
        .notNull()
        .references(() => flashcardSets.id, { onDelete: "cascade" }),
    term: varchar("term", { length: 255 }).notNull(),
    definition: varchar("definition", { length: 2000 }),
    imageUrl: varchar("image_url", { length: 500 }),
    examples: json("examples"),
    wordType: varchar("word_type", { length: 50 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date()),
}, (table) => ({
    setIdIdx: index("card_set_id_idx").on(table.setId),
    createdAtIdx: index("card_created_at_idx").on(table.createdAt),
})).enableRLS();

export const folders = pgTable("folder", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 100 }).notNull(),
    description: varchar("description", { length: 500 }),
    isPublic: boolean("is_public").notNull().default(false),
    isPublished: boolean("is_published").notNull().default(false),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date()),
}, (table) => ({
    userIdIdx: index("folder_user_id_idx").on(table.userId),
    isPublicIdx: index("folder_is_public_idx").on(table.isPublic),
    createdAtIdx: index("folder_created_at_idx").on(table.createdAt),
})).enableRLS();

export const folderSets = pgTable("folder_set", {
    folderId: uuid("folder_id")
        .notNull()
        .references(() => folders.id, { onDelete: "cascade" }),
    setId: uuid("set_id")
        .notNull()
        .references(() => flashcardSets.id, { onDelete: "cascade" }),
}, (t) => ({
    pk: primaryKey({ columns: [t.folderId, t.setId] }),
    folderIdIdx: index("folder_set_folder_id_idx").on(t.folderId),
    setIdIdx: index("folder_set_set_id_idx").on(t.setId),
})).enableRLS();

export const savedSets = pgTable("saved_set", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    setId: uuid("set_id")
        .notNull()
        .references(() => flashcardSets.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
    userIdIdx: index("saved_set_user_id_idx").on(table.userId),
    setIdIdx: index("saved_set_set_id_idx").on(table.setId),
    createdAtIdx: index("saved_set_created_at_idx").on(table.createdAt),
})).enableRLS();

export const setComments = pgTable("set_comment", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    setId: uuid("set_id")
        .notNull()
        .references(() => flashcardSets.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    isPinned: boolean("is_pinned").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date()),
}, (table) => ({
    setIdIdx: index("set_comment_set_id_idx").on(table.setId),
    userIdIdx: index("set_comment_user_id_idx").on(table.userId),
    createdAtIdx: index("set_comment_created_at_idx").on(table.createdAt),
    isPinnedIdx: index("set_comment_is_pinned_idx").on(table.isPinned),
})).enableRLS();

export const setLikes = pgTable("set_like", {
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    setId: uuid("set_id")
        .notNull()
        .references(() => flashcardSets.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
}, (t) => ({
    pk: primaryKey({ columns: [t.userId, t.setId] }),
    setIdIdx: index("set_like_set_id_idx").on(t.setId),
    userIdIdx: index("set_like_user_id_idx").on(t.userId),
})).enableRLS();

export const setJoins = pgTable("set_join", {
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    setId: uuid("set_id")
        .notNull()
        .references(() => flashcardSets.id, { onDelete: "cascade" }),
    joinCount: integer("join_count").notNull().default(1),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date()),
}, (t) => ({
    pk: primaryKey({ columns: [t.userId, t.setId] }),
    setIdIdx: index("set_join_set_id_idx").on(t.setId),
    userIdIdx: index("set_join_user_id_idx").on(t.userId),
})).enableRLS();


export const userRelations = relations(users, ({ many, one }) => ({
    sessions: many(sessions),
    flashcardSets: many(flashcardSets),
    folders: many(folders),
    favorites: many(favorites),
    practiceProgress: many(practiceProgress),
    savedSets: many(savedSets),
    setLikes: many(setLikes),
    setComments: many(setComments),
    setJoins: many(setJoins),
    stats: one(userStats, {
        fields: [users.id],
        references: [userStats.userId],
    }),
    achievements: many(userAchievements),
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
    practiceProgress: many(practiceProgress),
    savedSets: many(savedSets),
    likes: many(setLikes),
    comments: many(setComments),
    joins: many(setJoins),
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

export const savedSetRelations = relations(savedSets, ({ one }) => ({
    user: one(users, {
        fields: [savedSets.userId],
        references: [users.id],
    }),
    set: one(flashcardSets, {
        fields: [savedSets.setId],
        references: [flashcardSets.id],
    }),
}));

export const setLikeRelations = relations(setLikes, ({ one }) => ({
    user: one(users, {
        fields: [setLikes.userId],
        references: [users.id],
    }),
    set: one(flashcardSets, {
        fields: [setLikes.setId],
        references: [flashcardSets.id],
    }),
}));


export const setCommentRelations = relations(setComments, ({ one }) => ({
    user: one(users, {
        fields: [setComments.userId],
        references: [users.id],
    }),
    set: one(flashcardSets, {
        fields: [setComments.setId],
        references: [flashcardSets.id],
    }),
}));

export const setJoinRelations = relations(setJoins, ({ one }) => ({
    user: one(users, {
        fields: [setJoins.userId],
        references: [users.id],
    }),
    set: one(flashcardSets, {
        fields: [setJoins.setId],
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
}, (table) => ({
    userIdIdx: index("favorite_user_id_idx").on(table.userId),
    cardIdIdx: index("favorite_card_id_idx").on(table.cardId),
    createdAtIdx: index("favorite_created_at_idx").on(table.createdAt),
})).enableRLS();

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

export const practiceProgress = pgTable("practice_progress", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    setId: uuid("set_id")
        .notNull()
        .references(() => flashcardSets.id, { onDelete: "cascade" }),
    mode: varchar("mode", { length: 20 }).notNull(), // "quiz" or "flashcard"
    currentIndex: integer("current_index").notNull().default(0),
    totalQuestions: integer("total_questions").notNull(),
    score: integer("score").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date()),
}, (table) => ({
    userIdIdx: index("practice_progress_user_id_idx").on(table.userId),
    setIdIdx: index("practice_progress_set_id_idx").on(table.setId),
    modeIdx: index("practice_progress_mode_idx").on(table.mode),
    // Composite index for finding user's progress for specific set and mode
    userSetModeIdx: index("practice_progress_user_set_mode_idx").on(table.userId, table.setId, table.mode),
})).enableRLS();

export const practiceProgressRelations = relations(practiceProgress, ({ one }) => ({
    user: one(users, {
        fields: [practiceProgress.userId],
        references: [users.id],
    }),
    set: one(flashcardSets, {
        fields: [practiceProgress.setId],
        references: [flashcardSets.id],
    }),
}));

export const userStats = pgTable("user_stats", {
    userId: uuid("user_id").primaryKey()
        .references(() => users.id, { onDelete: "cascade" }),
    totalXp: integer("total_xp").notNull().default(0),
    level: integer("level").notNull().default(1),
    currentStreak: integer("current_streak").notNull().default(0),
    longestStreak: integer("longest_streak").notNull().default(0),
    lastPracticeDate: timestamp("last_practice_date"),
    quizzesCompleted: integer("quizzes_completed").notNull().default(0),
    flashcardsCompleted: integer("flashcards_completed").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date()),
}).enableRLS();

export const achievements = pgTable("achievement", {
    id: varchar("id", { length: 50 }).primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    icon: varchar("icon", { length: 50 }).notNull(),
    requiredValue: integer("required_value").notNull(),
    category: varchar("category", { length: 20 }).notNull(),
}).enableRLS();

export const userAchievements = pgTable("user_achievement", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    achievementId: varchar("achievement_id", { length: 50 }).notNull()
        .references(() => achievements.id, { onDelete: "cascade" }),
    unlockedAt: timestamp("unlocked_at").defaultNow(),
}, (table) => ({
    userIdIdx: index("user_achievement_user_id_idx").on(table.userId),
    achievementIdIdx: index("user_achievement_achievement_id_idx").on(table.achievementId),
})).enableRLS();

export const userStatsRelations = relations(userStats, ({ one }) => ({
    user: one(users, {
        fields: [userStats.userId],
        references: [users.id],
    }),
}));

export const achievementRelations = relations(achievements, ({ many }) => ({
    userAchievements: many(userAchievements),
}));

export const userAchievementRelations = relations(userAchievements, ({ one }) => ({
    user: one(users, {
        fields: [userAchievements.userId],
        references: [users.id],
    }),
    achievement: one(achievements, {
        fields: [userAchievements.achievementId],
        references: [achievements.id],
    }),
}));
