// Cloudflare Pages Function: POST /api/payments/cashfree/create-order
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
  const url = new URL(request.url);

  try {
    const body: any = await request.json();

    // 1. Fetch store settings for payment gateway configuration from D1
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

    const appId = env.CASHFREE_APP_ID || paymentOptions.cashfreeAppId || '135031343aa764f0a6ea5362ff73130531';
    const secretKey = env.CASHFREE_SECRET_KEY || paymentOptions.cashfreeSecretKey || '';
    const isTestMode = paymentOptions.isTestMode === true;

    if (!appId || !secretKey) {
      return jsonResponse({
        success: false,
        error: 'Cashfree credentials not configured. Please set Cashfree App ID & Secret Key in Admin Portal -> Payment Options.'
      }, 400);
    }

    const orderId = body.orderId || ('ORD-' + Math.floor(10000 + Math.random() * 90000));
    const orderAmount = Number(body.orderAmount || 0);
    const customerPhone = (body.customerPhone || '9476088111').replace(/\D/g, '').slice(-10);
    const customerName = body.customerName || 'Mr Bun Customer';
    const customerEmail = body.customerEmail || `${customerPhone}@mrbun.in`;
    const customerId = body.userId || `cust_${customerPhone}`;

    const cfBaseUrl = isTestMode 
      ? 'https://sandbox.cashfree.com/pg/orders' 
      : 'https://api.cashfree.com/pg/orders';

    const cfPayload = {
      order_id: orderId,
      order_amount: orderAmount,
      order_currency: 'INR',
      customer_details: {
        customer_id: customerId,
        customer_phone: customerPhone,
        customer_name: customerName,
        customer_email: customerEmail
      },
      order_meta: {
        return_url: `${url.origin}/orders?order_id={order_id}`
      },
      order_note: `Mr Bun Online Order #${orderId}`
    };

    const cfRes = await fetch(cfBaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': appId,
        'x-client-secret': secretKey
      },
      body: JSON.stringify(cfPayload)
    });

    const cfData: any = await cfRes.json();

    if (!cfRes.ok || !cfData.payment_session_id) {
      console.error('Cashfree order creation error:', cfData);
      return jsonResponse({
        success: false,
        error: cfData.message || 'Failed to initialize Cashfree payment session. Please verify API ID & Secret Key in Admin Portal.'
      }, 400);
    }

    return jsonResponse({
      success: true,
      orderId,
      paymentSessionId: cfData.payment_session_id,
      cfOrderId: cfData.cf_order_id,
      isTestMode
    });
  } catch (err: any) {
    console.error('Cashfree create-order exception:', err);
    return jsonResponse({ success: false, error: err.message }, 500);
  }
};
