import { pgTable, text, varchar, serial } from "drizzle-orm/pg-core";

export const MockInterview = pgTable('mockInterview', {
    id: serial('id').primaryKey(),
    jsonMockResp: text('jsonMockResp').notNull(),
    jobPosition: varchar('jobPosition', { length: 255 }).notNull(),
    jobDesc: varchar('jobDesc', { length: 255 }).notNull(),
    jobExperience: varchar('jobExperience', { length: 255 }).notNull(),
    createdBy: varchar('createdBy', { length: 255 }).notNull(),
    createdAt: varchar('createdAt', { length: 255 }).notNull(),
    mockId: varchar('mockId', { length: 255 }).notNull()
});

export const UserAnswer = pgTable('userAnswer', {
    id: serial('id').primaryKey(),
    mockIdRef: varchar('mockId', { length: 255 }).notNull(),
    question: varchar('question', { length: 255 }).notNull(),
    correctAnswer: varchar('correctAnswer', { length: 255 }).notNull(),
    userAnswer: varchar('userAnswer', { length: 255 }).notNull(),
    rating: varchar('rating', { length: 255 }).notNull(),
    feedback: varchar('feedback', { length: 255 }).notNull(),
    userEmail: varchar('userEmail', { length: 255 }).notNull(),
    createdAt: varchar('createdAt', { length: 255 }).notNull()
});