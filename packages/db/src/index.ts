// server.js
import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth'
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { cors } from 'hono/cors'

// Import functions from the various modules
import {
  createAgent,
  getAgentById,
  updateAgent,
  deleteAgent,
  getAgentsByOrganizationId,
  getAgentEnvVariables,
  insertAgentEnvVariables,
  updateAgentEnvVariables
} from './lib/agents';

import {
  createAgentAnalytics,
  createAgentLog,
  getAgentAnalytics,
  getAgentLogs,
  updateAgentAnalytics,
  deleteAgentAnalytics,
  deleteAgentLogs
} from './lib/analytics';

import {
  createServiceIntegration,
  createBlockchainIntegration,
  getServiceIntegrationById,
  getBlockchainIntegrationById,
  updateServiceIntegration,
  updateBlockchainIntegration,
  deleteServiceIntegration,
  deleteBlockchainIntegration
} from './lib/integrations';

import {
  createOrganization,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
  getOrganizationMember,
  createOrganizationMember,
  getOrganizationByUserId
} from './lib/organizations';

import {
  createSubscriptionPlan,
  createSubscription,
  createPayment,
  getSubscriptionById,
  getSubscriptionByCustomerId,
  getSubscriptionByOrganizationId,
  getSubscriptionAllowance,
  updateSubscription,
  updatePaymentStatus,
  deleteSubscription
} from './lib/subscriptions';

import {
  getUserById,
  createUser,
  updateUser,
  suspendUser,
  deleteUserAccount
} from './lib/users';

const apiPrefix = '/v1';
const authToken = process.env.JWT_DB_API ?? '';

export const app = new Hono();

// Use logger and pretty JSON middleware in development
if (process.env.NODE_ENV !== 'test') {
  app.use(logger());
}
if (process.env.NODE_ENV === 'development') {
  app.use(prettyJSON({ space: 4 }));
}

// CORS should be called before the route
app.use(`${apiPrefix}/*`, cors())

// Bearer auth middleware
app.use(`${apiPrefix}/*`, bearerAuth({ token: authToken }))

// Global error handler and not-found handler
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: 'Internal Server Error' }, 500);
});

app.notFound((c) => c.json({ error: 'Not Found' }, 404));

// Root and health endpoints
app.get('/', (c) => c.text('SYNAPZE DB API Server v0.0.6'));
app.get('/health', (c) => c.text('OK'));

/**
 * =========================
 * AGENTS ENDPOINTS
 * =========================
 */

// Create a new agent
app.post(`${apiPrefix}/agents`, async (c) => {
  try {
    const body = await c.req.json();
    const { organizationId, name, description, status, version, configuration, metadata } = body;
    const agent = await createAgent(
      organizationId,
      name,
      description,
      status,
      version,
      configuration,
      metadata
    );
    return c.json(agent, 201);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to create agent' }, 500);
  }
});

// Get an agent by id (includes envVars, integrations, deployments, analytics, logs)
app.get(`${apiPrefix}/agent/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const agent = await getAgentById(id);
    if (!agent) return c.json({ error: 'Agent not found' }, 404);
    return c.json(agent);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to get agent' }, 500);
  }
});

// Get agents by organization ID
app.get(`${apiPrefix}/agents/:organizationId`, async (c) => {
  try {
    const organizationId = c.req.param('organizationId');
    const agents = await getAgentsByOrganizationId(organizationId);
    return c.json(agents);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to get agents by organization ID' }, 500);
  }
});

// Update an agent by id
app.put(`${apiPrefix}/agents/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { name, description, container_id, status, version, configuration, metadata } = body;
    const updatedAgent = await updateAgent(
      id,
      name,
      description,
      container_id,
      status,
      version,
      configuration,
      metadata
    );
    if (!updatedAgent) return c.json({ error: 'Agent not found' }, 404);
    return c.json(updatedAgent);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to update agent' }, 500);
  }
});

// Delete an agent by id
app.delete(`${apiPrefix}/agents/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const success = await deleteAgent(id);
    if (!success) return c.json({ error: 'Agent not found' }, 404);
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to delete agent' }, 500);
  }
});

/**
 * =========================
 * ORGANIZATION MEMBERS ENDPOINTS
 * =========================
 */

// Add member to organization
app.post(`${apiPrefix}/organizations/:id/members`, async (c) => {
  try {
    const organizationId = c.req.param('id');
    const body = await c.req.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const member = await createOrganizationMember(organizationId, userId, role);
    return c.json(member);
  } catch (error: any) {
    console.error('Failed to add organization member:', error);
    if (error.message === 'Organization not found') {
      return c.json({ error: error.message }, 404);
    }
    if (error.message === 'User is already a member of this organization') {
      return c.json({ error: error.message }, 409);
    }
    return c.json({ error: 'Failed to add organization member' }, 500);
  }
});

// Get organization member
app.get(`${apiPrefix}/organizations/:id/members/:userId`, async (c) => {
  try {
    const organizationId = c.req.param('id');
    const userId = c.req.param('userId');
    const member = await getOrganizationMember(organizationId, userId);
    
    if (!member) {
      return c.json({ error: 'Organization member not found' }, 404);
    }
    
    return c.json(member);
  } catch (error) {
    console.error('Failed to get organization member:', error);
    return c.json({ error: 'Failed to get organization member' }, 500);
  }
});

// Get organization by user ID
app.get(`${apiPrefix}/organizations/:userId/organization`, async (c) => {
  try {
    const userId = c.req.param('userId');
    const organization = await getOrganizationByUserId(userId);
    
    if (!organization) {
      return c.json({ error: 'Organization not found for user' }, 404);
    }
    
    return c.json(organization);
  } catch (error) {
    console.error('Failed to get organization by user ID:', error);
    return c.json({ error: 'Failed to get organization by user ID' }, 500);
  }
});

/**
 * =========================
 * ANALYTICS & LOGS ENDPOINTS
 * =========================
 */

// Create an agent analytics record
app.post(`${apiPrefix}/agents/:id/analytics`, async (c) => {
  try {
    const agentId = c.req.param('id');
    const body = await c.req.json();
    const { metricType, metricValue, context } = body;
    const analyticsRecord = await createAgentAnalytics(agentId, metricType, metricValue, context);
    return c.json(analyticsRecord, 201);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to create agent analytics' }, 500);
  }
});

// Get agent analytics (supports query parameters: metricType, startTime, endTime, limit)
app.get(`${apiPrefix}/agents/:id/analytics`, async (c) => {
  try {
    const agentId = c.req.param('id');
    const metricType = c.req.query('metricType');
    const startTime = c.req.query('startTime');
    const endTime = c.req.query('endTime');
    const limit = Number(c.req.query('limit')) || 100;
    const analytics = await getAgentAnalytics(
      agentId,
      metricType,
      startTime ? new Date(startTime) : undefined,
      endTime ? new Date(endTime) : undefined,
      limit
    );
    return c.json(analytics);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to get agent analytics' }, 500);
  }
});

// Update an agent analytics record by its id
app.put(`${apiPrefix}/analytics/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { metricType, metricValue, context } = body;
    const updatedAnalytics = await updateAgentAnalytics(id, metricType, metricValue, context);
    if (!updatedAnalytics) return c.json({ error: 'Analytics record not found' }, 404);
    return c.json(updatedAnalytics);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to update agent analytics' }, 500);
  }
});

// Delete an agent analytics record by its id
app.delete(`${apiPrefix}/analytics/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const success = await deleteAgentAnalytics(id);
    if (!success) return c.json({ error: 'Analytics record not found' }, 404);
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to delete agent analytics' }, 500);
  }
});

// Create an agent log
app.post(`${apiPrefix}/agents/:id/logs`, async (c) => {
  try {
    const agentId = c.req.param('id');
    const body = await c.req.json();
    const { logMessage, context } = body;
    const logRecord = await createAgentLog(agentId, logMessage, context);
    return c.json(logRecord, 201);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to create agent log' }, 500);
  }
});

// Get agent logs (with optional query parameters for time filtering and limit)
app.get(`${apiPrefix}/agents/:id/logs`, async (c) => {
  try {
    const agentId = c.req.param('id');
    const startTime = c.req.query('startTime');
    const endTime = c.req.query('endTime');
    const limit = Number(c.req.query('limit')) || 100;
    const logs = await getAgentLogs(
      agentId,
      startTime ? new Date(startTime) : undefined,
      endTime ? new Date(endTime) : undefined,
      limit
    );
    return c.json(logs);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to get agent logs' }, 500);
  }
});

// Delete an agent log record by its id
app.delete(`${apiPrefix}/logs/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const success = await deleteAgentLogs(id);
    if (!success) return c.json({ error: 'Log record not found' }, 404);
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to delete agent log' }, 500);
  }
});

/**
 * =========================
 * INTEGRATIONS ENDPOINTS
 * =========================
 */

// Service integration endpoints
app.post(`${apiPrefix}/agents/:id/service-integrations`, async (c) => {
  try {
    const agentId = c.req.param('id');
    const body = await c.req.json();
    const { serviceType, credentials, status, configuration } = body;
    const integration = await createServiceIntegration(
      agentId,
      serviceType,
      credentials,
      status,
      configuration
    );
    return c.json(integration, 201);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to create service integration' }, 500);
  }
});

app.get(`${apiPrefix}/service-integrations/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const integration = await getServiceIntegrationById(id);
    if (!integration) return c.json({ error: 'Service integration not found' }, 404);
    return c.json(integration);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to get service integration' }, 500);
  }
});

app.put(`${apiPrefix}/service-integrations/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { credentials, status, configuration } = body;
    const updatedIntegration = await updateServiceIntegration(id, credentials, status, configuration);
    if (!updatedIntegration) return c.json({ error: 'Service integration not found' }, 404);
    return c.json(updatedIntegration);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to update service integration' }, 500);
  }
});

app.delete(`${apiPrefix}/service-integrations/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const success = await deleteServiceIntegration(id);
    if (!success) return c.json({ error: 'Service integration not found' }, 404);
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to delete service integration' }, 500);
  }
});

// Blockchain integration endpoints
app.post(`${apiPrefix}/agents/:id/blockchain-integrations`, async (c) => {
  try {
    const agentId = c.req.param('id');
    const body = await c.req.json();
    const { chainId, walletAddress, contractAddresses, status, chainConfig } = body;
    const integration = await createBlockchainIntegration(
      agentId,
      chainId,
      walletAddress,
      contractAddresses,
      status,
      chainConfig
    );
    return c.json(integration, 201);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to create blockchain integration' }, 500);
  }
});

app.get(`${apiPrefix}/blockchain-integrations/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const integration = await getBlockchainIntegrationById(id);
    if (!integration) return c.json({ error: 'Blockchain integration not found' }, 404);
    return c.json(integration);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to get blockchain integration' }, 500);
  }
});

app.put(`${apiPrefix}/blockchain-integrations/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { walletAddress, contractAddresses, status, chainConfig } = body;
    const updatedIntegration = await updateBlockchainIntegration(
      id,
      walletAddress,
      contractAddresses,
      status,
      chainConfig
    );
    if (!updatedIntegration) return c.json({ error: 'Blockchain integration not found' }, 404);
    return c.json(updatedIntegration);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to update blockchain integration' }, 500);
  }
});

app.delete(`${apiPrefix}/blockchain-integrations/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const success = await deleteBlockchainIntegration(id);
    if (!success) return c.json({ error: 'Blockchain integration not found' }, 404);
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to delete blockchain integration' }, 500);
  }
});

/**
 * =========================
 * ORGANIZATIONS ENDPOINTS
 * =========================
 */

// Create an organization
app.post(`${apiPrefix}/organizations`, async (c) => {
  try {
    const body = await c.req.json();
    const { name, subscriptionStatus, billingEmail } = body;
    const organization = await createOrganization(name, subscriptionStatus, billingEmail);
    return c.json(organization, 201);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to create organization' }, 500);
  }
});

// Get an organization by id (includes members and agents)
app.get(`${apiPrefix}/organizations/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const organization = await getOrganizationById(id);
    if (!organization) return c.json({ error: 'Organization not found' }, 404);
    return c.json(organization);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to get organization' }, 500);
  }
});

// Update an organization by id
app.put(`${apiPrefix}/organizations/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { name, subscriptionStatus, billingEmail } = body;
    const updatedOrganization = await updateOrganization(id, name, subscriptionStatus, billingEmail);
    if (!updatedOrganization) return c.json({ error: 'Organization not found' }, 404);
    return c.json(updatedOrganization);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to update organization' }, 500);
  }
});

// Delete an organization by id
app.delete(`${apiPrefix}/organizations/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const success = await deleteOrganization(id);
    if (!success) return c.json({ error: 'Organization not found' }, 404);
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to delete organization' }, 500);
  }
});

/**
 * =========================
 * SUBSCRIPTIONS & PAYMENTS ENDPOINTS
 * =========================
 */

// Create a subscription plan
app.post(`${apiPrefix}/subscription-plans`, async (c) => {
  try {
    const body = await c.req.json();
    const { name, description, price, currency, interval, items, metadata } = body;
    const plan = await createSubscriptionPlan(name, description, price, currency, interval, items, metadata);
    return c.json(plan, 201);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to create subscription plan' }, 500);
  }
});

// Create a subscription
app.post(`${apiPrefix}/subscriptions`, async (c) => {
  try {
    const body = await c.req.json();
    const { customerId, organizationId, customerEmail, planId, status, metadata, startDate, nextBillingDate } = body;
    const subscription = await createSubscription(
      customerId,
      organizationId,
      customerEmail,
      planId,
      status,
      metadata,
      new Date(startDate),
      new Date(nextBillingDate)
    );
    return c.json(subscription, 201);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to create subscription' }, 500);
  }
});

// Get a subscription by id (includes billing info and payments)
app.get(`${apiPrefix}/subscriptions/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const subscription = await getSubscriptionById(id);
    if (!subscription) return c.json({ error: 'Subscription not found' }, 404);
    return c.json(subscription);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to get subscription' }, 500);
  }
});

// Get a subscription by organization id (includes billing info and payments)
app.get(`${apiPrefix}/subscriptions/organization/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const subscription = await getSubscriptionByOrganizationId(id);
    if (!subscription) return c.json({ error: 'Subscription not found' }, 404);
    return c.json(subscription);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to get subscription' }, 500);
  }
});

// Get a subscription by customer id (includes billing info and payments)
app.get(`${apiPrefix}/subscriptions/customer/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const subscription = await getSubscriptionByCustomerId(id);
    if (!subscription) return c.json({ error: 'Subscription not found' }, 404);
    return c.json(subscription);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to get subscription' }, 500);
  }
});

// Get subscription allowance by customer id
app.get(`${apiPrefix}/subscriptions/allowance/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const allowance = await getSubscriptionAllowance(id);
    if (!allowance) return c.json({ error: 'Subscription not found' }, 404);
    return c.json(allowance);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to get subscription allowance' }, 500);
  }
});

// Update a subscription by id
app.put(`${apiPrefix}/subscriptions/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { status, endDate, metadata } = body;
    const updatedSubscription = await updateSubscription(
      id,
      status,
      endDate ? new Date(endDate) : undefined,
      metadata
    );
    if (!updatedSubscription) return c.json({ error: 'Subscription not found' }, 404);
    return c.json(updatedSubscription);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to update subscription' }, 500);
  }
});

// Delete a subscription by id
app.delete(`${apiPrefix}/subscriptions/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const success = await deleteSubscription(id);
    if (!success) return c.json({ error: 'Subscription not found' }, 404);
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to delete subscription' }, 500);
  }
});

/**
 * =========================
 * AGENT ENVIRONMENT VARIABLES ENDPOINTS
 * =========================
 */

// Get agent environment variables
app.get(`${apiPrefix}/agents/:id/env-variables`, async (c) => {
  try {
    const id = c.req.param('id');
    const encryptionKey = process.env.ENV_VAR_ENCRYPTION_KEY;
    if (!encryptionKey) {
      return c.json({ error: 'Encryption key not configured' }, 500);
    }
    const variables = await getAgentEnvVariables(id, encryptionKey);
    return c.json(variables);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to get agent environment variables' }, 500);
  }
});

// Create agent environment variables
app.post(`${apiPrefix}/agents/:id/env-variables`, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { variables } = body;
    
    if (!variables || typeof variables !== 'object') {
      return c.json({ error: 'Invalid variables format' }, 400);
    }

    const encryptionKey = process.env.ENV_VAR_ENCRYPTION_KEY;
    if (!encryptionKey) {
      return c.json({ error: 'Encryption key not configured' }, 500);
    }

    const result = await insertAgentEnvVariables(id, variables, encryptionKey);
    return c.json(result, 201);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to create agent environment variables' }, 500);
  }
});

// Update agent environment variables
app.put(`${apiPrefix}/agents/:id/env-variables`, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { variables } = body;
    
    if (!variables || typeof variables !== 'object') {
      return c.json({ error: 'Invalid variables format' }, 400);
    }

    const encryptionKey = process.env.ENV_VAR_ENCRYPTION_KEY;
    if (!encryptionKey) {
      return c.json({ error: 'Encryption key not configured' }, 500);
    }

    const result = await updateAgentEnvVariables(id, variables, encryptionKey);
    return c.json(result);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to update agent environment variables' }, 500);
  }
});

// Create a payment for a subscription
app.post(`${apiPrefix}/payments`, async (c) => {
  try {
    const body = await c.req.json();
    const { subscriptionId, paymentInfo } = body;
    const payment = await createPayment(subscriptionId, paymentInfo);
    return c.json(payment, 201);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to create payment' }, 500);
  }
});

// Update a payment's status
app.put(`${apiPrefix}/payments/:id/status`, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { status, error } = body;
    const updatedPayment = await updatePaymentStatus(id, status, error);
    if (!updatedPayment) return c.json({ error: 'Payment not found' }, 404);
    return c.json(updatedPayment);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to update payment status' }, 500);
  }
});

/**
 * =========================
 * USERS ENDPOINTS
 * =========================
 */

// Get a user by id (includes linked accounts, wallets, farcaster data, etc.)
app.get(`${apiPrefix}/users/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const user = await getUserById(id);
    if (!user) return c.json({ error: 'User not found' }, 404);
    return c.json(user);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to get user' }, 500);
  }
});

// Create a new user (or return an existing user id)
app.post(`${apiPrefix}/users`, async (c) => {
  try {
    const body = await c.req.json();
    const { id, emailAddress, linkedAccounts, mfaMethods, hasAcceptedTerms, createdAt } = body;
    const userId = await createUser(id, emailAddress, linkedAccounts, mfaMethods, hasAcceptedTerms, createdAt);
    return c.json({ id: userId }, 201);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// Update an existing user (e.g. add linked accounts, MFA methods, update terms or verification status)
app.put(`${apiPrefix}/users/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { linkedAccounts, mfaMethods, hasAcceptedTerms, verified, updatedAt } = body;
    const result = await updateUser(id, linkedAccounts, mfaMethods, hasAcceptedTerms, verified, updatedAt);
    if (!result) return c.json({ error: 'User not found or update failed' }, 404);
    return c.json({ verified: result });
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to update user' }, 500);
  }
});

// Suspend a user account
app.post(`${apiPrefix}/users/:id/suspend`, async (c) => {
  try {
    const id = c.req.param('id');
    const suspended = await suspendUser(id);
    if (!suspended) return c.json({ error: 'User not found or suspension failed' }, 404);
    return c.json({ suspended });
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to suspend user' }, 500);
  }
});

// Delete a user account
app.delete(`${apiPrefix}/users/:id`, async (c) => {
  try {
    const id = c.req.param('id');
    const success = await deleteUserAccount(id);
    if (!success) return c.json({ error: 'User not found' }, 404);
    return c.json({ success: true });
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to delete user' }, 500);
  }
});

// Start the Bun server
Bun.serve({
  fetch: app.fetch,
  port: 8787,
});

console.log('🫙 Synapze DB server running on http://localhost:8787');
