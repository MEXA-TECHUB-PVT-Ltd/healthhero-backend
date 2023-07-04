app.post('/create-pricing', async (req, res) => {
    // "Unlimited Searches;Access to all gpt engine;AnyFeature 3" 
    // split by semi colon 
    console.log(req.body.features)
    const prices = await stripe.prices.create({
      product: req.body.product_id,
      unit_amount: req.body.unit_amount,
      lookup_key: 'chat-gpt',
      currency: 'usd',
      metadata: {
        featuresList: req.body.features
      },
      nickname: req.body.description
    });
  
    res.send({
      publishableKey: Publishable_Key,
      prices: prices,
    });
  });
  // create price list 
  app.post('/update-pricing', async (req, res) => {
    const prices = await stripe.prices.update(req.body.price_Id, { active: false });
  
    res.send({
      publishableKey: Publishable_Key,
      prices: prices,
    });
  });
  // get price list 
  app.get('/get-all-pricing', async (req, res) => {
    const prices = await stripe.prices.list({
      // lookup_keys: ['Monthly', 'sample_premium'],
      lookup_keys: ['chat-gpt'],
      expand: ['data.product'],
      active: true
    });
  
    res.send({
      publishableKey: Publishable_Key,
      prices: prices.data,
    });
  
  });
  // get price list 
  app.post('/check-subscription', async (req, res) => {
    const subscriptions = await stripe.subscriptions.list({
      customer: req.body.customer_Stripe_Id,
      limit: 1,
    });
  
    const subscription = subscriptions.data[0];
  
    if (subscription.status === 'active') {
      res.json({ message: 'Subscription is active!', status: true });
    } else {
      res.json({ message: 'Subscription is not active!', status: false });
    }
  
  });
  // Cancel 
  app.post('/cancel-subscription', async (req, res) => {
    const updatedSubscription = await stripe.subscriptions.update(
      req.body.subscription_id,
      {
        cancel_at_period_end: true,
      }
    );
    res.json({ message: 'Subscription canceled at the end of the billing period:', data: updatedSubscription });
  
  });
  // Create subscription
  app.post("/checkout1", async (req, res) => {
    const { customer_Id, priceId, customeremail } = req.body;
    // get pricing 
    const prices = stripe.prices.retrieve(
      priceId,
      async function (err, price) {
        if (err) {
          res.json({ message: 'Error retrieving price:', error: err });
        } else {
          // res.json('Price retrieved:', price);
          let pricing_obj = price.unit_amount
          // create customer 
          const customer = await stripe.customers.create({
            email: customeremail,
          });
  
          const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: customer.id },
            { apiVersion: '2020-08-27' }
          );
          // Subscription create 
          try {
            const subscription = await stripe.subscriptions.create({
              customer: customer.id,
              items: [{
                price: priceId,
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
            const Transaction = new TransactionModel({
              _id: mongoose.Types.ObjectId(),
              user_Id: customer_Id,
              user_email: customeremail,
              paymentIntent_Secret: clientpaymentIntentId,
              customer_Stripe_Id: customer.id,
              ephemeralKey: ephemeralKey.secret,
              paymentStatus: 'succeeded',
              priceId: priceId,
              amount: pricing_obj,
              subscriptionId: subscriptionId,
              clientSecretSubscription: clientSecret,
              startingdate: DateData.toISOString(),
              freeTrialEndDate: EndDate.toISOString(),
            });
            Transaction.save((error, result) => {
              if (error) {
                res.status(200).json({ result: error, error: true, message: "Error Creating Transaction", statusCode: 200 })
              } else {
                const updateData = {
                  customer_Stripe_id: result.customer_Stripe_Id,
                  subscription: {
                    subscription_plan_id: result.subscriptionId,
                    pricing_selected: result.priceId,
                    clientSecretSubscription: result.clientSecretSubscription,
                    startingdate: result.startingdate,
                    freeTrialEndDate: result.freeTrialEndDate,
                    customer_Stripe_id: result.customer_Stripe_Id,
                  }
  
                }
                const options = {
                  new: true
                }
                userModel.findByIdAndUpdate(customer_Id, updateData, options, (error, result) => {
                  if (error) {
                    // res.status(200).json({ result: result, error: false, message: error.message, statusCode: 200 })
  
                  } else {
                    // res.status(200).json({ result: result, error: false, message: "Updated Successfully", statusCode: 200 })
  
                  }
                })
                res.status(200).json({ result: result, error: false, message: "Created Successfully", statusCode: 200 })
                // res.sendStatus(200)
              }
            })
          } catch (error) {
            return res.status(400).send({ error: { message: error.message } });
          }
  
        }
      }
    );
  
    // res.json(prices)
  
  });