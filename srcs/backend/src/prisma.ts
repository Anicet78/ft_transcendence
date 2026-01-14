// src/prisma.ts
import * as PrismaPkg from '@prisma/client';

type PrismaCtor = new (opts?: any) => any;

// Resolve the constructor in a version‑tolerant way
const PrismaClientCtor: PrismaCtor =
  // v5: named export
  (PrismaPkg as any).PrismaClient ??
  // v7: default export (some bundlers expose it as .default)
  (PrismaPkg as any).default ??
  // fallback: the module itself might be the constructor
  (PrismaPkg as any);

// Instantiate with adapter for Prisma 7 (adapter ignored by older versions)
const prisma = new PrismaClientCtor({ adapter: { url: process.env.DATABASE_URL } });

export default prisma;
export type DbClient = typeof prisma;






// import Prisma from '@prisma/client';

// const prisma = new Prisma({
//   adapter: { url: process.env.DATABASE_URL },
// });

// export default prisma;
