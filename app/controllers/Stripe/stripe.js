const stripe = require('stripe')(process.env.STRIPE_SECRET);
const { pool } = require("../../config/db.config");



exports.Pay = async (req, res) => {
    const client = await pool.connect();
    try {

        const amount = req.body.amount;
        const currency = req.body.currency;

        if (!amount || !currency) {
            return (
                res.json({
                    message: "amount and currency must be provided",
                    status: false
                })
            )
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Amount in cents
            currency: currency, // Currency,
            description: 'Ad removal subscription',
            payment_method_types: ['card'],
        });


        console.log(paymentIntent)


        if (paymentIntent) {
            res.status(201).json({
                message: "Client secret generated for this payment",
                status: true,
                result: {
                    id: paymentIntent.id,
                    amount: paymentIntent.amount,
                    description: paymentIntent.description,
                    client_secret: paymentIntent.client_secret
                }
            })
        }
        else {
            res.status(400).json({
                message: "Could not Process ",
                status: false
            })
        }
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error",
            status: false,
            error: err.messagefalse
        })
    }
    finally {
        client.release();
    }

}

exports.createProductAndPricing = async (req, res) => {
    const client = await pool.connect();
    try {
        let product_id;
        const product_name = req.body.product_name;
        const unit_amount = req.body.unit_amount;

        if (!product_name || !unit_amount) {
            return (
                res.json({
                    message: "product_name and unit_amount must be provided",
                    status: false
                })
            )
        }

        const product = await stripe.products.create({
            name: product_name,
        });

        console.log(product);
        if (product) {
            product_id = product.id;
        }
        else {
            return (
                res.json({
                    message: "Issue in creating product, Internal issue",
                    status: false
                })
            )
        }


        const price = await stripe.prices.create({
            unit_amount: unit_amount,
            currency: 'usd',
            recurring: { interval: 'month' },
            product: product_id,
            lookup_key: product_name
        });

        console.log(price);

        if (price) {
            return (
                res.json({
                    message: "Monthly subscription plan and pricing created",
                    status: false,
                    result: {
                        publishable_key: process.env.STRIPE_PUBLISHABLE,
                        productAndPricesDetails: price
                    }
                })
            )
        }
        else {
            res.json({
                message: "Could not create product and its pricing",
                status: false
            })
        }


    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error",
            status: false,
            error: err.messagefalse
        })
    }
    finally {
        client.release();
    }

}

exports.getProductPricings = async (req, res) => {
    const client = await pool.connect();
    try {
        const product_id = req.query.product_id;
        if (!product_id) { return (res.json("product_id must be provided , use get all products api to get products")) }
        const prices = await stripe.prices.list({
            product: product_id,
        });
        console.log(prices);
        if (prices.data) {
            res.json({
                message: "All Prices of given product is : ",
                status: true,
                result: prices.data
            })
        }
        else {
            res.json({
                message: "Could not fetch any prices",
                status: false
            })
        }
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
    }

}

exports.getProducts = async (req, res) => {
    const client = await pool.connect();
    try {
        const products = await stripe.products.list({
        });
        console.log(products);
        if (products.data) {
            res.json({
                message: "All products",
                status: true,
                result: products.data
            })
        }
        else {
            res.json({
                message: "Could not fetch any products",
                status: false
            })
        }
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
    }

}

exports.initiateFreeTrialPayment = async (req, res) => {
    const client = await pool.connect();
    try {
        const { userEmail, user_id, price_id, free_trial_days } = req.body;
        if (!free_trial_days) {
            return (
                res.json({
                    message: "Please provide free_trial_days , As this api will be one time called according to subscription scenerio . so free trial days must be provided , After trial ends it customer will charged on monthly basis normally",
                    status: false
                })
            )
        }
        if (!userEmail || !price_id || !user_id) {
            return (
                res.json({
                    message: "userEmail , user_id and price_id must be provided",
                    status: false
                })
            )
        }


        const price = await stripe.prices.retrieve(
            price_id
        );

        if (!price) {
            return (
                res.json({
                    message: "Not able to get price plan with this id",
                    status: false
                })
            )
        }

        let customer;
        const findCustomer = await stripe.customers.list({
            email: userEmail,
        });

        console.log(findCustomer.data);
        if (findCustomer.data.length > 0) {
            console.log("inside")
            customer = findCustomer.data[0];
        }
        else {
            customer = await stripe.customers.create({
                email: userEmail
            });

        }

        console.log(customer.id)
        if (!customer) { return (res.json({ message: "Could not create customer due to internal issue", status: false })) }

        const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: customer.id },
            { apiVersion: '2020-08-27' }
        );



        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{
                price: price_id,
            }],
            payment_behavior: 'default_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.payment_intent'],
            trial_period_days: free_trial_days
        });



        // console.log(subscription);



        // const subscriptionId = subscription.id
        // const clientSecret = subscription.latest_invoice.payment_intent.client_secret;
        // console.log(clientSecret)
        // const clientpaymentIntentId = subscription.latest_invoice.payment_intent.id
        // const DateData = new Date()
        // const EndDate = new Date(DateData.getTime() + 3 * 24 * 60 * 60 * 1000);


        if (subscription) {
            res.json({
                message: "Free trial for this customer has been created , At the trial period end , stripe will automatically charge customer on monthly basis , Also add card for customer",
                status: true
            })
        }
        else {
            res.json({
                message: "Could not store",
                status: false
            })
        }
    }
    catch (err) {
        console.log(err)
        res.json({
            mesasge: "Error Occurred",
            status: false,
            error: err.message
        })
    } finally {
        client.release();
    }

}

exports.initiatePayment = async (req, res) => {
    const client = await pool.connect();
    try {

        const { userEmail, user_id, price_id } = req.body;
        
        if (!userEmail || !price_id || !user_id) {
            return (
                res.json({
                    message: "userEmail , user_id and price_id must be provided",
                    status: false
                })
            )
        }


        const price = await stripe.prices.retrieve(
            price_id
        );

        if (!price) {
            return (
                res.json({
                    message: "Not able to get price plan with this id",
                    status: false
                })
            )
        }

        let customer;
        const findCustomer = await stripe.customers.list({
            email: userEmail,
        });

        console.log(findCustomer.data.length);
        if (findCustomer.data.length > 0) {
            console.log("inside")
            customer = findCustomer.data[0];
        }
        else {
            customer = await stripe.customers.create({
                email: userEmail
            });

        }

        console.log(customer.id)
        if (!customer) { return (res.json({ message: "Could not create customer due to internal issue", status: false })) }

        const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: customer.id },
            { apiVersion: '2020-08-27' }
        );



        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{
                price: price_id,
            }],
            payment_behavior: 'default_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.payment_intent'],
        });


        const subscriptionId = subscription.id
        const clientSecret = subscription.latest_invoice.payment_intent.client_secret
        const clientpaymentIntentId = subscription.latest_invoice.payment_intent.id
        const DateData = new Date()
        const EndDate = new Date(DateData.getTime() + 3 * 24 * 60 * 60 * 1000);


        if (subscription) {
            res.json({
                message: "payment Initiated successfully , Use the following data to confirm the payment , then use subscription api to save the record after confirming to maintain history",
                status: true,
                result: {
                    unit_amount: price.unit_amount,
                    ephemeralKey: ephemeralKey.secret,
                    stripe_subscription_id: subscription.id,
                    customer_Stripe_Id: customer.id,
                    subscription_client_secret: clientSecret,
                    paymentIntent_Secret: clientpaymentIntentId,
                    price_id: price.id,
                }
            })
        }
        else {
            res.json({
                message: "Could not store",
                status: false
            })
        }
    }
    catch (err) {
        res.json({
            mesasge: "Error Occurred",
            status: false,
            error: err.message
        })
    } finally {
        client.release();
    }

}


exports.cancelSubscription = async (req, res) => {
    const client = await pool.connect();
    try {
        const subscription_id = req.body.subscription_id;
        if (!subscription_id) {
            return (
                res.json({
                    message: "Please Provide subscription_id",
                    status: false
                })
            )
        }
        const updatedSubscription = await stripe.subscriptions.update(
            subscription_id,
            {
                cancel_at_period_end: true,
            }
        );

        if (updatedSubscription) {
            res.json({
                message: "subscription will be cancel at month end",
                status: true,
                result: updatedSubscription
            })
        }
        else {
            res.json({
                message: "Could not fetch any subscription",
                status: false
            })
        }
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
    }

}

exports.checkSubscription = async (req, res) => {
    const client = await pool.connect();
    try {

        const customer_Stripe_Id = req.query.customer_Stripe_Id;
        if (!customer_Stripe_Id) {
            return (
                res.json({
                    message: "Please Provide a customer stripe id",
                    status: false
                })
            )
        }
        const subscriptions = await stripe.subscriptions.list({
            customer: customer_Stripe_Id,
            limit: 1,
        });

        const subscription = subscriptions.data[0];

        if (subscription.status === 'active') {
            res.json({ message: 'Subscription is Active!', status: true });
        } else {
            res.json({ message: 'Subscription is not active!', status: false });
        }
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
    }

}

