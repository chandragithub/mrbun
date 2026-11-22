// Cloudflare Pages Catch-all Function for /api/*
// Delegates any unmatched API routes to the unified worker engine
import { ensureTables } from '../ensureDb';
import worker from '../../worker/index';

export const onRequest: PagesFunction<any> = async (context) => {
  if (context.env?.DB) {
    try {
      await ensureTables(context.env.DB);
    } catch {}
  }
  return worker.fetch(context.request, context.env, context as any);
};
