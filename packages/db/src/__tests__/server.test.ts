// server.test.ts
import { test, expect, jest } from "bun:test";
import { app } from "../"; // adjust the path if necessary

// Import all underlying functions so that we can spy on them.
import * as agentsModule from "../lib/agents";
import * as analyticsModule from "../lib/analytics";
import * as integrationsModule from "../lib/integrations";
import * as organizationsModule from "../lib/organizations";
import * as subscriptionsModule from "../lib/subscriptions";
import * as usersModule from "../lib/users";

// Helper function to simulate a request using the Hono app instance.
async function runRequest(url: string, options?: RequestInit) {
  const req = new Request(url, options);
  return app.fetch(req);
}

/** 
 * -------------------------
 * ROOT ENDPOINTS
 * -------------------------
 */
test("GET / returns server version text", async () => {
  const res = await runRequest("http://localhost:8787/");
  expect(res.status).toBe(200);
  const text = await res.text();
  expect(text).toContain("SYNAPZE DB API Server");
});

test("GET /health returns OK", async () => {
  const res = await runRequest("http://localhost:8787/health");
  expect(res.status).toBe(200);
  const text = await res.text();
  expect(text).toBe("OK");
});

test("GET /non-existent returns 404", async () => {
  const res = await runRequest("http://localhost:8787/non-existent");
  expect(res.status).toBe(404);
  const json = await res.json();
  expect(json).toEqual({ error: "Not Found" });
});

/** 
 * -------------------------
 * AGENTS ENDPOINTS
 * -------------------------
 */
test("POST /v1/agents creates an agent", async () => {
  const fakeAgent = { id: "agent1", name: "Test Agent" };
  const spy = jest.spyOn(agentsModule, "createAgent").mockResolvedValue(fakeAgent);
  
  const payload = {
    organizationId: "org1",
    name: "Test Agent",
    description: "Agent description",
    status: "active",
    version: "1.0",
    configuration: { key: "value" },
    metadata: { meta: "data" }
  };
  const res = await runRequest("http://localhost:8787/v1/agents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  expect(res.status).toBe(201);
  const json = await res.json();
  expect(json).toEqual(fakeAgent);
  spy.mockRestore();
});

test("GET /v1/agents/:id retrieves an agent", async () => {
  const fakeAgent = { id: "agent1", name: "Test Agent" };
  const spy = jest.spyOn(agentsModule, "getAgentById").mockResolvedValue(fakeAgent);
  
  const res = await runRequest("http://localhost:8787/v1/agents/agent1");
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toEqual(fakeAgent);
  spy.mockRestore();
});

test("PUT /v1/agents/:id updates an agent", async () => {
  const updatedAgent = { id: "agent1", name: "Updated Agent" };
  const spy = jest.spyOn(agentsModule, "updateAgent").mockResolvedValue(updatedAgent);
  
  const payload = {
    name: "Updated Agent",
    description: "Updated description",
    status: "inactive",
    version: "1.1",
    configuration: { new: "config" },
    metadata: { new: "meta" }
  };
  const res = await runRequest("http://localhost:8787/v1/agents/agent1", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toEqual(updatedAgent);
  spy.mockRestore();
});

test("DELETE /v1/agents/:id deletes an agent", async () => {
  const spy = jest.spyOn(agentsModule, "deleteAgent").mockResolvedValue(true);
  
  const res = await runRequest("http://localhost:8787/v1/agents/agent1", {
    method: "DELETE"
  });
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toEqual({ success: true });
  spy.mockRestore();
});

/** 
 * -------------------------
 * ANALYTICS ENDPOINTS
 * -------------------------
 */
test("POST /v1/agents/:id/analytics creates an analytics record", async () => {
  const fakeAnalytics = { id: "analytic1", metricType: "test" };
  const spy = jest.spyOn(analyticsModule, "createAgentAnalytics").mockResolvedValue(fakeAnalytics);
  
  const payload = {
    metricType: "test",
    metricValue: { a: 1 },
    context: { info: "test" }
  };
  const res = await runRequest("http://localhost:8787/v1/agents/agent1/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  expect(res.status).toBe(201);
  const json = await res.json();
  expect(json).toEqual(fakeAnalytics);
  spy.mockRestore();
});

test("GET /v1/agents/:id/analytics retrieves analytics records", async () => {
  const fakeAnalyticsList = [{ id: "analytic1", metricType: "test" }];
  const spy = jest.spyOn(analyticsModule, "getAgentAnalytics").mockResolvedValue(fakeAnalyticsList);
  
  const res = await runRequest("http://localhost:8787/v1/agents/agent1/analytics");
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toEqual(fakeAnalyticsList);
  spy.mockRestore();
});

test("PUT /v1/analytics/:id updates an analytics record", async () => {
  const updatedAnalytics = { id: "analytic1", metricType: "updated" };
  const spy = jest.spyOn(analyticsModule, "updateAgentAnalytics").mockResolvedValue(updatedAnalytics);
  
  const payload = {
    metricType: "updated",
    metricValue: { a: 2 },
    context: { info: "updated" }
  };
  const res = await runRequest("http://localhost:8787/v1/analytics/analytic1", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toEqual(updatedAnalytics);
  spy.mockRestore();
});

test("DELETE /v1/analytics/:id deletes an analytics record", async () => {
  const spy = jest.spyOn(analyticsModule, "deleteAgentAnalytics").mockResolvedValue(true);
  
  const res = await runRequest("http://localhost:8787/v1/analytics/analytic1", {
    method: "DELETE"
  });
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toEqual({ success: true });
  spy.mockRestore();
});

/** 
 * -------------------------
 * LOGS ENDPOINTS
 * -------------------------
 */
test("POST /v1/agents/:id/logs creates a log record", async () => {
  const fakeLog = { id: "log1", logMessage: "Test log" };
  const spy = jest.spyOn(analyticsModule, "createAgentLog").mockResolvedValue(fakeLog);
  
  const payload = {
    logMessage: "Test log",
    context: { detail: "info" }
  };
  const res = await runRequest("http://localhost:8787/v1/agents/agent1/logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  expect(res.status).toBe(201);
  const json = await res.json();
  expect(json).toEqual(fakeLog);
  spy.mockRestore();
});

test("GET /v1/agents/:id/logs retrieves log records", async () => {
  const fakeLogs = [{ id: "log1", logMessage: "Test log" }];
  const spy = jest.spyOn(analyticsModule, "getAgentLogs").mockResolvedValue(fakeLogs);
  
  const res = await runRequest("http://localhost:8787/v1/agents/agent1/logs");
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toEqual(fakeLogs);
  spy.mockRestore();
});

test("DELETE /v1/logs/:id deletes a log record", async () => {
  const spy = jest.spyOn(analyticsModule, "deleteAgentLogs").mockResolvedValue(true);
  
  const res = await runRequest("http://localhost:8787/v1/logs/log1", {
    method: "DELETE"
  });
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toEqual({ success: true });
  spy.mockRestore();
});

/** 
 * -------------------------
 * INTEGRATIONS ENDPOINTS - SERVICE INTEGRATIONS
 * -------------------------
 */
test("POST /v1/agents/:id/service-integrations creates a service integration", async () => {
  const fakeIntegration = { id: "si1", serviceType: "test" };
  const spy = jest.spyOn(integrationsModule, "createServiceIntegration").mockResolvedValue(fakeIntegration);
  
  const payload = {
    serviceType: "test",
    credentials: { user: "test" },
    status: "active",
    configuration: { conf: "value" }
  };
  const res = await runRequest("http://localhost:8787/v1/agents/agent1/service-integrations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  expect(res.status).toBe(201);
  const json = await res.json();
  expect(json).toEqual(fakeIntegration);
  spy.mockRestore();
});

test("GET /v1/service-integrations/:id retrieves a service integration", async () => {
  const fakeIntegration = { id: "si1", serviceType: "test" };
  const spy = jest.spyOn(integrationsModule, "getServiceIntegrationById").mockResolvedValue(fakeIntegration);
  
  const res = await runRequest("http://localhost:8787/v1/service-integrations/si1");
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toEqual(fakeIntegration);
  spy.mockRestore();
});

test("PUT /v1/service-integrations/:id updates a service integration", async () => {
  const updatedIntegration = { id: "si1", serviceType: "updated" };
  const spy = jest.spyOn(integrationsModule, "updateServiceIntegration").mockResolvedValue(updatedIntegration);
  
  const payload = {
    credentials: { user: "updated" },
    status: "inactive",
    configuration: { conf: "new" }
  };
  const res = await runRequest("http://localhost:8787/v1/service-integrations/si1", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toEqual(updatedIntegration);
  spy.mockRestore();
});

test("DELETE /v1/service-integrations/:id deletes a service integration", async () => {
  const spy = jest.spyOn(integrationsModule, "deleteServiceIntegration").mockResolvedValue(true);
  
  const res = await runRequest("http://localhost:8787/v1/service-integrations/si1", {
    method: "DELETE"
  });
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toEqual({ success: true });
  spy.mockRestore();
});

/** 
 * -------------------------
 * INTEGRATIONS ENDPOINTS - BLOCKCHAIN INTEGRATIONS
 * -------------------------
 */
test("POST /v1/agents/:id/blockchain-integrations creates a blockchain integration", async () => {
  const fakeIntegration = { id: "bi1", chainId: 1 };
  const spy = jest.spyOn(integrationsModule, "createBlockchainIntegration").mockResolvedValue(fakeIntegration);
  
  const payload = {
    chainId: 1,
    walletAddress: "0x123",
    contractAddresses: { token: "0xabc" },
    status: "active",
    chainConfig: { config: "value" }
  };
  const res = await runRequest("http://localhost:8787/v1/agents/agent1/blockchain-integrations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  expect(res.status).toBe(201);
  const json = await res.json();
  expect(json).toEqual(fakeIntegration);
  spy.mockRestore();
});

test("GET /v1/blockchain-integrations/:id retrieves a blockchain integration", async () => {
  const fakeIntegration = { id: "bi1", chainId: 1 };
  const spy = jest.spyOn(integrationsModule, "getBlockchainIntegrationById").mockResolvedValue(fakeIntegration);
  
  const res = await runRequest("http://localhost:8787/v1/blockchain-integrations/bi1");
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toEqual(fakeIntegration);
  spy.mockRestore();
});

test("PUT /v1/blockchain-integrations/:id updates a blockchain integration", async () => {
  const updatedIntegration = { id: "bi1", chainId: 2 };
  const spy = jest.spyOn(integrationsModule, "updateBlockchainIntegration").mockResolvedValue(updatedIntegration);
  
  const payload = {
    walletAddress: "0x456",
    contractAddresses: { token: "0xdef" },
    status: "inactive",
    chainConfig: { config: "new" }
  };
  const res = await runRequest("http://localhost:8787/v1/blockchain-integrations/bi1", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toEqual(updatedIntegration);
  spy.mockRestore();
});

test("DELETE /v1/blockchain-integrations/:id deletes a blockchain integration", async () => {
  const spy = jest.spyOn(integrationsModule, "deleteBlockchainIntegration").mockResolvedValue(true);
  
  const res = await runRequest("http://localhost:8787/v1/blockchain-integrations/bi1", {
    method: "DELETE"
  });
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toEqual({ success: true });
  spy.mockRestore();
});

/** 
 * -------------------------
 * ORGANIZATIONS ENDPOINTS
 * -------------------------
 */
test("POST /v1/organizations creates an organization", async () => {
  const fakeOrg = { id: "org1", name: "Test Org" };
  const spy = jest.spyOn(organizationsModule, "createOrganization").mockResolvedValue(fakeOrg);
  
  const payload = {
    name: "Test Org",
    subscriptionStatus: "active",
    billingEmail: "org@example.com"
  };
  const res = await runRequest("http://localhost:8787/v1/organizations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  expect(res.status).toBe(201);
  const json = await res.json();
  expect(json).toEqual(fakeOrg);
  spy.mockRestore();
});

test("GET /v1/organizations/:id retrieves an organization", async () => {
  const fakeOrg = { id: "org1", name: "Test Org" };
  const spy = jest.spyOn(organizationsModule, "getOrganizationById").mockResolvedValue(fakeOrg);
  
  const res = await runRequest("http://localhost:8787/v1/organizations/org1");
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toEqual(fakeOrg);
  spy.mockRestore();
});

test("PUT /v1/organizations/:id updates an organization", async () => {
  const updatedOrg = { id: "org1", name: "Updated Org" };
  const spy = jest.spyOn(organizationsModule, "updateOrganization").mockResolvedValue(updatedOrg);
  
  const payload = {
    name: "Updated Org",
    subscriptionStatus: "inactive",
    billingEmail: "updated@example.com"
  };
  const res = await runRequest("http://localhost:8787/v1/organizations/org1", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toEqual(updatedOrg);
  spy.mockRestore();
});

test("DELETE /v1/organizations/:id deletes an organization", async () => {
  const spy = jest.spyOn(organizationsModule, "deleteOrganization").mockResolvedValue(true);
  
  const res = await runRequest("http://localhost:8787/v1/organizations/org1", {
    method: "DELETE"
  });
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toEqual({ success: true });
  spy.mockRestore();
});

/** 
 * -------------------------
 * SUBSCRIPTIONS & PAYMENTS ENDPOINTS
 * -------------------------
 */
test("POST /v1/subscription-plans creates a subscription plan", async () => {
  const fakePlan = { id: "plan1", name: "Basic Plan" };
  const spy = jest.spyOn(subscriptionsModule, "createSubscriptionPlan").mockResolvedValue(fakePlan);
  
  const payload = {
    name: "Basic Plan",
    description: "Basic subscription",
    price: 10,
    currency: "USD",
    interval: "monthly"
  };
  const res = await runRequest("http://localhost:8787/v1/subscription-plans", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  expect(res.status).toBe(201);
  const json = await res.json();
  expect(json).toEqual(fakePlan);
  spy.mockRestore();
});

test("POST /v1/subscriptions creates a subscription", async () => {
  const fakeSub = { id: "sub1", customerEmail: "cust@example.com" };
  const spy = jest.spyOn(subscriptionsModule, "createSubscription").mockResolvedValue(fakeSub);
  
  const payload = {
    customerEmail: "cust@example.com",
    planId: "plan1",
    status: "active",
    startDate: new Date().toISOString(),
    nextBillingDate: new Date(Date.now() + 86400000).toISOString() // +1 day
  };
  const res = await runRequest("http://localhost:8787/v1/subscriptions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  expect(res.status).toBe(201);
  const json = await res.json();
  expect(json).toEqual(fakeSub);
  spy.mockRestore();
});

test("GET /v1/subscriptions/:id retrieves a subscription", async () => {
  const fakeSub = { id: "sub1", customerEmail: "cust@example.com" };
  const spy = jest.spyOn(subscriptionsModule, "getSubscriptionById").mockResolvedValue(fakeSub);
  
  const res = await runRequest("http://localhost:8787/v1/subscriptions/sub1");
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toEqual(fakeSub);
  spy.mockRestore();
});

test("PUT /v1/subscriptions/:id updates a subscription", async () => {
  const updatedSub = { id: "sub1", status: "inactive" };
  const spy = jest.spyOn(subscriptionsModule, "updateSubscription").mockResolvedValue(updatedSub);
  
  const payload = {
    status: "inactive",
    endDate: new Date().toISOString()
  };
  const res = await runRequest("http://localhost:8787/v1/subscriptions/sub1", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toEqual(updatedSub);
  spy.mockRestore();
});

test("DELETE /v1/subscriptions/:id deletes a subscription", async () => {
  const spy = jest.spyOn(subscriptionsModule, "deleteSubscription").mockResolvedValue(true);
  
  const res = await runRequest("http://localhost:8787/v1/subscriptions/sub1", {
    method: "DELETE"
  });
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toEqual({ success: true });
  spy.mockRestore();
});

test("POST /v1/payments creates a payment", async () => {
  const fakePayment = { id: "pay1", subscriptionId: "sub1" };
  const spy = jest.spyOn(subscriptionsModule, "createPayment").mockResolvedValue(fakePayment);
  
  const payload = {
    subscriptionId: "sub1",
    paymentInfo: {
      paymentMethod: "card",
      amount: 10,
      currency: "USD"
    }
  };
  const res = await runRequest("http://localhost:8787/v1/payments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  expect(res.status).toBe(201);
  const json = await res.json();
  expect(json).toEqual(fakePayment);
  spy.mockRestore();
});

test("PUT /v1/payments/:id/status updates a payment status", async () => {
  const updatedPayment = { id: "pay1", status: "completed" };
  const spy = jest.spyOn(subscriptionsModule, "updatePaymentStatus").mockResolvedValue(updatedPayment);
  
  const payload = {
    status: "completed",
    error: null
  };
  const res = await runRequest("http://localhost:8787/v1/payments/pay1/status", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toEqual(updatedPayment);
  spy.mockRestore();
});

/** 
 * -------------------------
 * USERS ENDPOINTS
 * -------------------------
 */
test("GET /v1/users/:id retrieves a user", async () => {
  const fakeUser = { id: "user1", email: "user@example.com", linkedAccounts: [], wallets: [], farcaster: null };
  const spy = jest.spyOn(usersModule, "getUserById").mockResolvedValue(fakeUser);
  
  const res = await runRequest("http://localhost:8787/v1/users/user1");
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toEqual(fakeUser);
  spy.mockRestore();
});

test("POST /v1/users creates a user", async () => {
  const fakeUserId = "user1";
  const spy = jest.spyOn(usersModule, "createUser").mockResolvedValue(fakeUserId);
  
  const payload = {
    id: fakeUserId,
    emailAddress: "user@example.com",
    linkedAccounts: [],
    mfaMethods: [],
    hasAcceptedTerms: true,
    createdAt: new Date().toISOString()
  };
  const res = await runRequest("http://localhost:8787/v1/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  expect(res.status).toBe(201);
  const json = await res.json();
  expect(json).toEqual({ id: fakeUserId });
  spy.mockRestore();
});

test("PUT /v1/users/:id updates a user", async () => {
  // Assume updateUser returns a boolean or value indicating verification.
  const spy = jest.spyOn(usersModule, "updateUser").mockResolvedValue(true);
  
  const payload = {
    linkedAccounts: [],
    mfaMethods: [],
    hasAcceptedTerms: true,
    verified: true,
    updatedAt: new Date().toISOString()
  };
  const res = await runRequest("http://localhost:8787/v1/users/user1", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toEqual({ verified: true });
  spy.mockRestore();
});

test("POST /v1/users/:id/suspend suspends a user", async () => {
  const spy = jest.spyOn(usersModule, "suspendUser").mockResolvedValue(true);
  
  const res = await runRequest("http://localhost:8787/v1/users/user1/suspend", {
    method: "POST"
  });
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toEqual({ suspended: true });
  spy.mockRestore();
});

test("DELETE /v1/users/:id deletes a user", async () => {
  const spy = jest.spyOn(usersModule, "deleteUserAccount").mockResolvedValue(true);
  
  const res = await runRequest("http://localhost:8787/v1/users/user1", {
    method: "DELETE"
  });
  expect(res.status).toBe(200);
  const json = await res.json();
  expect(json).toEqual({ success: true });
  spy.mockRestore();
});
