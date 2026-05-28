const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const ALLOWED_ORIGINS = [
    'https://aretewomengeneration.org',
    'https://www.aretewomengeneration.org',
    'https://arete-women-generation.vercel.app',
];

const MAX_DONATION = 10000;

module.exports = async (req, res) => {
    const origin = req.headers.origin || '';
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Vary', 'Origin');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { amount, donorEmail } = req.body;

        const parsedAmount = Number(amount);
        if (!Number.isFinite(parsedAmount) || parsedAmount < 1 || parsedAmount > MAX_DONATION) {
            return res.status(400).json({ error: 'Donation amount must be between $1 and $10,000' });
        }

        const siteUrl = ALLOWED_ORIGINS[0];

        const sessionParams = {
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Donation to ARETE Women\'s Generation',
                        description: 'Supporting women empowerment, education, and community impact.',
                    },
                    unit_amount: Math.round(parsedAmount * 100),
                },
                quantity: 1,
            }],
            success_url: `${siteUrl}?donation=success`,
            cancel_url: `${siteUrl}?donation=cancelled`,
            submit_type: 'donate',
            billing_address_collection: 'auto',
        };

        if (donorEmail && typeof donorEmail === 'string' && donorEmail.includes('@')) {
            sessionParams.customer_email = donorEmail;
        }

        const session = await stripe.checkout.sessions.create(sessionParams);

        res.status(200).json({ url: session.url });
    } catch (err) {
        console.error('Stripe error:', err.message);
        res.status(500).json({ error: 'Failed to create checkout session. Please try again.' });
    }
};
