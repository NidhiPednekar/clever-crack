import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  out: './drizzle',
  schema: './utils/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_SPrm9Bwabst5@ep-shy-glitter-a10tbz49-pooler.ap-southeast-1.aws.neon.tech/clever-crack?sslmode=require&channel_binding=require'
  },
})