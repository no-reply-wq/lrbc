import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI ?? '';

if (!MONGODB_URI) {
  console.warn('[LRBC] MONGODB_URI not set in .env.local');
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: typeof mongoose | null;
}

let cached = global._mongooseConn ?? null;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached) return cached;
  if (!MONGODB_URI) throw new Error('MONGODB_URI is not defined in .env.local');
  cached = await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  global._mongooseConn = cached;
  console.log('[LRBC] MongoDB connected');
  return cached;
}
