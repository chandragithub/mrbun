// Cloudflare Pages Function: /api/users/profile (GET & POST)
import { ensureTables } from '../../ensureDb';

interface Env {
  DB?: any;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
}

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env, request } = context;
  const url = new URL(request.url);

  try {
    if (env.DB) {
      await ensureTables(env.DB);
      const id = url.searchParams.get('id');
      const email = url.searchParams.get('email');
      const phone = url.searchParams.get('phone');

      let query = 'SELECT * FROM users WHERE 1=0';
      let param = '';
      if (id) {
        query = 'SELECT * FROM users WHERE id = ? LIMIT 1';
        param = id;
      } else if (email) {
        query = 'SELECT * FROM users WHERE LOWER(email) = ? LIMIT 1';
        param = email.toLowerCase().trim();
      } else if (phone) {
        query = 'SELECT * FROM users WHERE phone = ? LIMIT 1';
        param = phone.replace(/\D/g, '').slice(-10);
      }

      const user: any = await env.DB.prepare(query).bind(param).first();
      if (user) {
        return jsonResponse({
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            address: user.address || '',
            avatarUrl: user.avatar_url || '',
            role: user.role || 'customer'
          }
        });
      }
    }
    return jsonResponse({ success: false, error: 'User not found.' }, 404);
  } catch (err: any) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, request } = context;

  try {
    const body: any = await request.json();
    const userId = (body.id || body.userId || '').trim();
    const name = (body.name || '').trim();
    const email = (body.email || '').trim().toLowerCase();
    const rawPhone = (body.phone || '').trim();
    const cleanPhone = rawPhone.replace(/\D/g, '').slice(-10);
    const address = (body.address || '').trim();
    const avatarUrl = (body.avatarUrl || '').trim();

    if (env.DB) {
      await ensureTables(env.DB);

      // Check existing user
      const existing: any = await env.DB.prepare(`
        SELECT * FROM users 
        WHERE id = ? OR (email != '' AND LOWER(email) = ?) OR (phone != '' AND phone = ?)
        LIMIT 1
      `).bind(userId, email, cleanPhone).first();

      let updatedUser: any;
      if (existing) {
        const finalName = name || existing.name;
        const finalEmail = email || existing.email;
        const finalPhone = cleanPhone || existing.phone;
        const finalAddress = address !== undefined ? address : (existing.address || '');
        const finalAvatar = avatarUrl !== undefined ? avatarUrl : (existing.avatar_url || '');

        await env.DB.prepare(`
          UPDATE users 
          SET name = ?, email = ?, phone = ?, address = ?, avatar_url = ?
          WHERE id = ?
        `).bind(finalName, finalEmail, finalPhone, finalAddress, finalAvatar, existing.id).run();

        updatedUser = {
          id: existing.id,
          name: finalName,
          email: finalEmail,
          phone: finalPhone,
          address: finalAddress,
          avatarUrl: finalAvatar,
          role: existing.role || 'customer'
        };
      } else {
        const newId = userId || ('usr-' + Date.now());
        await env.DB.prepare(`
          INSERT INTO users (id, name, email, phone, password_hash, address, avatar_url, role)
          VALUES (?, ?, ?, ?, 'local_user', ?, ?, 'customer')
        `).bind(newId, name || 'Customer', email, cleanPhone, address || '', avatarUrl || '').run();

        updatedUser = {
          id: newId,
          name: name || 'Customer',
          email,
          phone: cleanPhone,
          address: address || '',
          avatarUrl: avatarUrl || '',
          role: 'customer'
        };
      }

      return jsonResponse({
        success: true,
        user: updatedUser,
        message: 'User settings and profile updated successfully in Cloudflare D1!'
      });
    }

    return jsonResponse({
      success: true,
      user: {
        id: userId || 'usr-local',
        name: name || 'Customer',
        email,
        phone: cleanPhone,
        address: address || '',
        avatarUrl: avatarUrl || '',
        role: 'customer'
      }
    });
  } catch (err: any) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
};
