const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { certId, customerEmail, paymentMethodId } = req.body;

    // Charge $5 for hosting
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 500,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      metadata: { certId, customerEmail, type: 'hosting' },
    });

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment failed' });
    }

    // Set hosted_until to 1 year from now
    const hostedUntil = new Date();
    hostedUntil.setFullYear(hostedUntil.getFullYear() + 1);

    const { error } = await supabase
      .from('certificates')
      .update({
        hosted: true,
        hosted_until: hostedUntil.toISOString(),
      })
      .eq('cert_id', certId);

    if (error) throw error;

    res.status(200).json({ success: true, hostedUntil });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
