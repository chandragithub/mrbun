// Cloudflare Pages Function for Franchise Models API
interface Env {
  DB?: any;
}

const DEFAULT_FRANCHISE_MODELS = [
  {
    id: 'fran-model-1',
    title: 'Express Delivery & Takeaway Hub',
    badge: 'Low Capex • Quick Launch',
    area: '250 – 450 sq ft',
    investment: '₹12 – 18 Lakhs',
    roi: '10 – 14 Months',
    desc: 'Optimized for high-density delivery orders, online aggregators, and quick takeaway counters.',
    highlights: [
      'Compact commercial kitchen',
      'Low rental footprint',
      'Online order dispatch engine',
      '2-3 staff operation'
    ],
    orderIndex: 1,
    isActive: true
  },
  {
    id: 'fran-model-2',
    title: 'Flagship Diner & Cafe',
    badge: 'High Footfall • Maximum Revenue',
    area: '800 – 1,500 sq ft',
    investment: '₹28 – 40 Lakhs',
    roi: '14 – 18 Months',
    desc: 'Full-fledged experiential fast food diner with live pizza ovens, smash burger counter & party space.',
    highlights: [
      '50+ seating dine-in area',
      'Private party & birthday zone',
      'Instagrammable interiors',
      'High ticket dine-in + delivery'
    ],
    orderIndex: 2,
    isActive: true
  },
  {
    id: 'fran-model-3',
    title: 'Mall Food Court Kiosk',
    badge: 'Guaranteed Footfall',
    area: '150 – 300 sq ft',
    investment: '₹18 – 25 Lakhs',
    roi: '12 – 15 Months',
    desc: 'High velocity counter in prime shopping malls, tech parks, or transit hubs with rapid customer turnaround.',
    highlights: [
      'Pre-set mall infrastructure',
      'Instant brand visibility',
      'High margin combo meal sales',
      'Standardized plug-and-play setup'
    ],
    orderIndex: 3,
    isActive: true
  }
];

async function ensureFranchiseModelsTable(db: any) {
  if (!db) return;
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS franchise_models (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        badge TEXT,
        area TEXT NOT NULL,
        investment TEXT NOT NULL,
        roi TEXT NOT NULL,
        description TEXT NOT NULL,
        highlights_json TEXT NOT NULL,
        order_index INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (e) {
    console.warn('ensureFranchiseModelsTable notice:', e);
  }
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { env } = context;
  if (env.DB) {
    try {
      await ensureFranchiseModelsTable(env.DB);
      const { results } = await env.DB.prepare('SELECT * FROM franchise_models ORDER BY order_index ASC, created_at ASC').all();
      if (results && results.length > 0) {
        const mapped = results.map((r: any) => ({
          id: r.id,
          title: r.title,
          badge: r.badge || '',
          area: r.area,
          investment: r.investment,
          roi: r.roi,
          desc: r.description,
          highlights: r.highlights_json ? JSON.parse(r.highlights_json) : [],
          orderIndex: r.order_index ?? 0,
          isActive: r.is_active === 1 || r.is_active === true
        }));
        return new Response(JSON.stringify({ success: true, models: mapped }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (e: any) {
      console.error('Error fetching franchise models in Pages Function:', e);
    }
  }

  return new Response(JSON.stringify({ success: true, models: DEFAULT_FRANCHISE_MODELS }), {
    headers: { 'Content-Type': 'application/json' }
  });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, request } = context;
  try {
    const m: any = await request.json();
    const modelId = m.id || `fran-model-${Date.now()}`;
    const highlightsJson = JSON.stringify(Array.isArray(m.highlights) ? m.highlights : []);
    const isActiveInt = m.isActive === false ? 0 : 1;
    const orderIndex = typeof m.orderIndex === 'number' ? m.orderIndex : 0;

    if (env.DB) {
      await ensureFranchiseModelsTable(env.DB);
      await env.DB.prepare(`
        INSERT INTO franchise_models (
          id, title, badge, area, investment, roi, description, highlights_json, order_index, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          badge = excluded.badge,
          area = excluded.area,
          investment = excluded.investment,
          roi = excluded.roi,
          description = excluded.description,
          highlights_json = excluded.highlights_json,
          order_index = excluded.order_index,
          is_active = excluded.is_active
      `).bind(
        modelId,
        m.title || 'Franchise Format',
        m.badge || '',
        m.area || '',
        m.investment || '',
        m.roi || '',
        m.desc || '',
        highlightsJson,
        orderIndex,
        isActiveInt
      ).run();
    }

    return new Response(JSON.stringify({ success: true, model: { ...m, id: modelId } }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  const { env, request } = context;
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id') || url.pathname.split('/').pop()?.trim();
    if (id && env.DB) {
      await ensureFranchiseModelsTable(env.DB);
      await env.DB.prepare('DELETE FROM franchise_models WHERE id = ?').bind(id).run();
    }
    return new Response(JSON.stringify({ success: true, message: `Franchise model ${id} deleted.` }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
