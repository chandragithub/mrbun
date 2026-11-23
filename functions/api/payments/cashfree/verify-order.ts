// Cloudflare Pages Function: POST /api/payments/cashfree/verify-order
import { ensureTables } from '../../../ensureDb';

interface Env {
  DB?: any;
  CASHFREE_APP_ID?: string;
  CASHFREE_SECRET_KEY?: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { env, request } = context;

  try {
    const body: any = await request.json();
    const orderId = body.orderId;
    if (!orderId) {
      return jsonResponse({ success: false, error: 'Order ID is required.' }, 400);
    }

    let paymentOptions: any = {};
    if (env.DB) {
      try {
        await ensureTables(env.DB);
        const currentSettings: any = (await env.DB.prepare('SELECT payment_options_json FROM store_settings WHERE id = "default" LIMIT 1').first()) || {};
        if (currentSettings.payment_options_json) {
          paymentOptions = JSON.parse(currentSettings.payment_options_json);
        }
      } catch (dbErr) {
        console.error('Error fetching payment options from DB in Pages function:', dbErr);
      }
    }

    const appId = env.CASHFREE_APP_ID || paymentOptions.cashfreeAppId || '';
    const secretKey = env.CASHFREE_SECRET_KEY || paymentOptions.cashfreeSecretKey || '';
    const isTestMode = paymentOptions.isTestMode === true;

    const cfBaseUrl = isTestMode 
      ? `https://sandbox.cashfree.com/pg/orders/${orderId}` 
      : `https://api.cashfree.com/pg/orders/${orderId}`;

    const cfRes = await fetch(cfBaseUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': appId,
        'x-client-secret': secretKey
      }
    });

    const cfData: any = await cfRes.json();
    const isPaid = cfData.order_status === 'PAID';

    if (isPaid && env.DB) {
      try {
        await env.DB.prepare('UPDATE orders SET payment_status = "paid" WHERE id = ?').bind(orderId).run();
      } catch (dbErr) {
        console.error('Error updating order payment status in DB:', dbErr);
      }
    }

    return jsonResponse({
      success: true,
      orderId,
      orderStatus: cfData.order_status,
      isPaid,
      cfOrder: cfData
    });
  } catch (err: any) {
    console.error('Cashfree verify-order exception:', err);
    return jsonResponse({ success: false, error: err.message }, 500);
  }
};
