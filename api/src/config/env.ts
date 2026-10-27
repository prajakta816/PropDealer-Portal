import 'dotenv/config';

const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URL'] as const;

for (const key of requiredEnvVars) {
  if (!process.env[key]?.trim()) {
    throw new Error(
      `Missing required environment variable: ${key}. Check your .env file.`,
    );
  }
}

export const env = {
  JWT_SECRET: process.env.JWT_SECRET!,
  DATABASE_URL: process.env.DATABASE_URL!,
  PORT: Number(process.env.PORT || 5000),
};