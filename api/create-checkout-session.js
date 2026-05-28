const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { amount, currency } = req.body;

        if (!amount || amount < 1) {
            return res.status(400).json({ error: 'Invalid donation amount' });
        }

        const donationCurrency = currency || 'usd';
        const origin = req.headers.origin || req.headers.referer || 'https://aretewomengeneration.org';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [{
                price_data: {
                    currency: donationCurrency,
                    product_data: {
                        name: 'Donation to ARETE Women\'s Generation',
                        description: 'Supporting women empowerment, education, and community impact.',
                    },
                    unit_amount: Math.round(amount * 100),
                },
                quantity: 1,
            }],
            success_url: `${origin}?donation=success`,
            cancel_url: `${origin}?donation=cancelled`,
            submit_type: 'donate',
            billing_address_collection: 'auto',
        });

        res.status(200).json({ url: session.url });
    } catch (err) {
        console.error('Stripe error:', err.message);
        res.status(500).json({ error: 'Failed to create checkout session. Please try again.' });
    }
};
