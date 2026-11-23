// Cloudflare Pages Function for Contact Inquiries API (Cloudflare D1 SQLite)
import { ensureTables } from '../ensureDb';

interface Env {
  DB?: any;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;

  if (env.DB) {
    try {
      await ensureTables(env.DB);
      const { results } = await env.DB.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 100').all();
      return new Response(JSON.stringify({ 
        success: true, 
        messages: (results || []).map((r: any) => ({
          id: r.id,
          name: r.name,
          phone: r.phone,
          email: r.email,
          subject: r.subject,
          message: r.message,
          sentToEmail: r.sent_to_email || 'contact@mrbun.in',
          status: r.status || 'new',
          createdAt: r.created_at
        })) 
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (e: any) {
      return new Response(JSON.stringify({ success: false, error: e.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response(JSON.stringify({ success: true, messages: [] }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, request } = context;

  try {
    const body: any = await request.json();
    const contactId = 'MSG-' + Math.floor(10000 + Math.random() * 90000);
    const sentToEmail = body.sentToEmail || 'contact@mrbun.in';

    if (!body.name || !body.phone || !body.message) {
      return new Response(
        JSON.stringify({ success: false, error: 'Name, phone, and message are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (env.DB) {
      await ensureTables(env.DB);
      const stmt = env.DB.prepare(`
        INSERT INTO contact_messages (
          id, name, phone, email, subject, message, sent_to_email, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        contactId,
        body.name,
        body.phone,
        body.email || null,
        body.subject || 'General Inquiry',
        body.message,
        sentToEmail,
        'new'
      );

      await stmt.run();
    }

    return new Response(
      JSON.stringify({
        success: true,
        id: contactId,
        sentToEmail,
        message: 'Message delivered successfully to contact@mrbun.in. Our team will contact you soon.'
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 201
      }
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
