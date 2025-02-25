interface PaymentInfo {
  paymentMethod: string;
  amount: number;
  currency: string;
  stripeChargeId?: string;
  stripeCustomerId?: string;
  stripePaymentIntentId?: string;
  stripeInvoiceId?: string;
  stripeCardLast4?: string;
  stripeCardBrand?: string;
  stripeReceiptUrl?: string;
}

export async function createSubscriptionPlan(
  name: string,
  description: string,
  price: number,
  currency: string,
  interval: string,
  items: number,
  metadata: Record<string, string>
) {
  try {
    const now = new Date().toISOString();
    const result = await Bun.sql`
      INSERT INTO subscription_plans (
        name, description, price, currency, interval, items, metadata,
        created_at, updated_at
      )
      VALUES (
        ${name}, ${description}, ${price}, ${currency}, ${interval},
        ${items}, ${JSON.stringify(metadata) ?? '{}'}, ${now}, ${now}
      )
      RETURNING *
    `.values();

    return result[0] ?? null;
  } catch (error) {
    console.error('Failed to create subscription plan:', error);
    throw error;
  }
}

export async function createSubscription(
  customerId: string,
  organizationId: string,
  customerEmail: string,
  planId: string,
  status: string,
  metadata: Record<string, string>,
  startDate: Date,
  nextBillingDate: Date
) {
  try {
    const now = new Date().toISOString();
    const result = await Bun.sql`
      INSERT INTO subscriptions (
        customer_id, organization_id, customer_email, plan_id, status, metadata, start_date, 
        next_billing_date, created_at, updated_at
      )
      VALUES (
        ${customerId}, ${organizationId}, ${customerEmail}, ${planId}, ${status}, ${JSON.stringify(metadata) ?? '{}'} ${startDate.toISOString()},
        ${nextBillingDate.toISOString()}, ${now}, ${now}
      )
      RETURNING *
    `.values();

    return result[0] ?? null;
  } catch (error) {
    console.error('Failed to create subscription:', error);
    throw error;
  }
}

export async function createPayment(subscriptionId: string, paymentInfo: PaymentInfo) {
  try {
    const now = new Date().toISOString();
    const result = await Bun.sql`
      INSERT INTO payments (
        subscription_id, payment_method, amount, currency, status,
        stripe_charge_id, stripe_customer_id, stripe_payment_intent_id,
        stripe_invoice_id, stripe_card_last4, stripe_card_brand,
        stripe_receipt_url, created_at, updated_at
      )
      VALUES (
        ${subscriptionId}, ${paymentInfo.paymentMethod}, ${paymentInfo.amount},
        ${paymentInfo.currency}, 'pending', ${paymentInfo.stripeChargeId},
        ${paymentInfo.stripeCustomerId}, ${paymentInfo.stripePaymentIntentId},
        ${paymentInfo.stripeInvoiceId}, ${paymentInfo.stripeCardLast4},
        ${paymentInfo.stripeCardBrand}, ${paymentInfo.stripeReceiptUrl},
        ${now}, ${now}
      )
      RETURNING *
    `.values();

    return result[0] ?? null;
  } catch (error) {
    console.error('Failed to create payment:', error);
    throw error;
  }
}

export async function getSubscriptionById(id: string) {
  try {
    const subscription = await Bun.sql`
      SELECT s.*, sp.name as plan_name, sp.price as plan_price
      FROM subscriptions s
      LEFT JOIN subscription_plans sp ON s.plan_id = sp.id
      WHERE s.id = ${id}
    `.values();

    const billingInfo = await Bun.sql`
      SELECT * FROM billing_information
      WHERE subscription_id = ${id}
    `.values();

    const payments = await Bun.sql`
      SELECT * FROM payments
      WHERE subscription_id = ${id}
      ORDER BY created_at DESC
    `.values();

    return {
      ...subscription[0],
      billingInfo: billingInfo[0] ?? null,
      payments
    };
  } catch (error) {
    console.error('Failed to get subscription:', error);
    throw error;
  }
}

export async function getSubscriptionByCustomerId(customer_id: string) {
  try {
    const subscription = await Bun.sql`
      SELECT s.*, sp.name as plan_name, sp.price as plan_price
      FROM subscriptions s
      LEFT JOIN subscription_plans sp ON s.plan_id = sp.id
      WHERE s.customer_id = ${customer_id}
    `.values();

    const billingInfo = await Bun.sql`
      SELECT * FROM billing_information
      WHERE subscription_id = ${subscription[0][0]}
    `.values();

    const payments = await Bun.sql`
      SELECT * FROM payments
      WHERE subscription_id = ${subscription[0][0]}
      ORDER BY created_at DESC
    `.values();

    return {
      ...subscription[0],
      billingInfo: billingInfo[0] ?? null,
      payments
    };
  } catch (error) {
    console.error('Failed to get subscription:', error);
    throw error;
  }
}


export async function getSubscriptionByOrganizationId(organization_id: string) {
  try {
    const subscription = await Bun.sql`
      SELECT s.*, sp.name as plan_name, sp.price as plan_price
      FROM subscriptions s
      LEFT JOIN subscription_plans sp ON s.plan_id = sp.id
      WHERE s.organization_id = ${organization_id}
    `.values();

    const billingInfo = await Bun.sql`
      SELECT * FROM billing_information
      WHERE subscription_id = ${subscription[0][0]}
    `.values();

    const payments = await Bun.sql`
      SELECT * FROM payments
      WHERE subscription_id = ${subscription[0][0]}
      ORDER BY created_at DESC
    `.values();

    return {
      ...subscription[0],
      billingInfo: billingInfo[0] ?? null,
      payments
    };
  } catch (error) {
    console.error('Failed to get subscription:', error);
    throw error;
  }
}


export async function getSubscriptionAllowance(customer_id: string) {
  try {
    const subscription = await Bun.sql`
      SELECT s.id, s.status, sp.items, sp.name, sp.price
      FROM subscriptions s
      LEFT JOIN subscription_plans sp ON s.plan_id = sp.id
      WHERE s.customer_id = ${customer_id}
    `.values();

    return {
      id: subscription[0][0],
      status: subscription[0][1],
      items: subscription[0][2],
      plan_name: subscription[0][3],
      plan_price: subscription[0][4]
    };
  } catch (error) {
    console.error('Failed to get subscription:', error);
    throw error;
  }
}


export async function updateSubscription(
  id: string,
  status?: string,
  endDate?: Date,
  metadata?: Record<string, string>
) {
  try {
    const now = new Date().toISOString();
    const result = await Bun.sql`
      UPDATE subscriptions 
      SET status = COALESCE(${status}, status),
          end_date = COALESCE(${endDate?.toISOString()}, end_date),
          updated_at = ${now},
          metadata = COALESCE(${JSON.stringify(metadata) ?? '{}'}, metadata)
      WHERE id = ${id}
      RETURNING *
    `.values();

    return result[0] ?? null;
  } catch (error) {
    console.error('Failed to update subscription:', error);
    throw error;
  }
}

export async function updatePaymentStatus(
  id: string,
  status: string,
  error?: string
) {
  try {
    const now = new Date().toISOString();
    const result = await Bun.sql`
      UPDATE payments 
      SET status = ${status},
          error_message = ${error},
          updated_at = ${now}
      WHERE id = ${id}
      RETURNING *
    `.values();

    return result[0] ?? null;
  } catch (error) {
    console.error('Failed to update payment status:', error);
    throw error;
  }
}

export async function deleteSubscription(id: string) {
  try {
    // Delete associated records first
    await Bun.sql`DELETE FROM billing_information WHERE subscription_id = ${id}`;
    await Bun.sql`DELETE FROM payments WHERE subscription_id = ${id}`;
    
    // Finally delete the subscription
    const result = await Bun.sql`
      DELETE FROM subscriptions 
      WHERE id = ${id}
      RETURNING id
    `.values();

    return result[0]?.id ? true : false;
  } catch (error) {
    console.error('Failed to delete subscription:', error);
    throw error;
  }
}
