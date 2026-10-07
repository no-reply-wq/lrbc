import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI ?? '';

if (!MONGODB_URI) {
  console.warn('[LRBC] MONGODB_URI not set in .env.local');
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: typeof mongoose | null;
  // eslint-disable-next-line no-var
  var _mongoosePromise: Promise<typeof mongoose> | null;
}

/**
 * One shared connection. The *promise* is cached, so when several requests arrive at the same moment
 * they all wait for the same connection instead of querying before it is ready.
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (global._mongooseConn && mongoose.connection.readyState === 1) return global._mongooseConn;
  if (!MONGODB_URI) throw new Error('MONGODB_URI is not defined in .env.local');
  if (!global._mongoosePromise) {
    global._mongoosePromise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false, serverSelectionTimeoutMS: 8000 })
      .then((m) => { global._mongooseConn = m; console.log('[LRBC] MongoDB connected'); return m; })
      .catch((e) => { global._mongoosePromise = null; global._mongooseConn = null; throw e; });
  }
  return global._mongoosePromise;
}
