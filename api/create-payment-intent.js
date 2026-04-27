import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { amount, certName, customerEmail, customerName } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      metadata: { certName, customerEmail, customerName },
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}