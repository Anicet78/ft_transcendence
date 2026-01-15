// srcs/backend/prisma.config.cjs
module.exports = {
  // runtime/CLI datasource config for Prisma 7
  datasource: {
    // used by CLI for migrate/generate when needed
    url: process.env.DATABASE_URL || "",
  },

  // point Prisma to schema and migrations folder
  schema: "./prisma/schema.prisma",
  migrations: {
    path: "./prisma/migrations",
  },
};
