const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");

const JWT_SECRET = "b2df9426acb4bb8b88a66d983b";

const TEST_EMAIL = `testuser_${Date.now()}@example.com`;
const TEST_PASSWORD = "123456";

describe("Users API", () => {
  let token;
  let userId;

  beforeAll(async () => {
    // Register
    await request(app)
      .post("/api/auth/register")
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

    // Login to get token
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

    expect(loginRes.statusCode).toBe(200);
    token = loginRes.body.token;

    const decoded = jwt.verify(token, JWT_SECRET);
    userId = decoded.userId;
  });

  describe("GET /api/users", () => {
    it("should return 401 when no token is provided", async () => {
      const res = await request(app).get("/api/users");

      expect(res.statusCode).toBe(401);
      expect(res.body.mesage).toBe("Access Denied.");
    });

    it("should return 401 when token is invalid", async () => {
      const res = await request(app)
        .get("/api/users")
        .set("Authorization", "Bearer invalid.token.here");

      expect(res.statusCode).toBe(401);
      expect(res.body.mesage).toBe("Invalid Token.");
    });

    it("should return current user when token is valid", async () => {
      const res = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.user).toBeDefined();
      expect(res.body.user.id).toBe(userId);
      expect(res.body.user.email).toBe(TEST_EMAIL);
      expect(res.body.user.password).toBeUndefined();
    });
  });

  describe("PUT /api/users", () => {
    it("should return 401 when no token is provided", async () => {
      const res = await request(app)
        .put("/api/users")
        .send({ email: "new@example.com" });

      expect(res.statusCode).toBe(401);
    });

    it("should update user email when token is valid", async () => {
      const newEmail = `updated_${Date.now()}@example.com`;

      const res = await request(app)
        .put("/api/users")
        .set("Authorization", `Bearer ${token}`)
        .send({ email: newEmail });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.message).toBe("User updated Succesfully.");

      // Confirm via GET
      const getRes = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${token}`);

      expect(getRes.body.user.email).toBe(newEmail);
    });

    it("should update password when provided", async () => {
      const newPassword = "NewPassword456!";

      const res = await request(app)
        .put("/api/users")
        .set("Authorization", `Bearer ${token}`)
        .send({
          email: `pwd_${Date.now()}@example.com`,
          password: newPassword,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
    });
  });
});