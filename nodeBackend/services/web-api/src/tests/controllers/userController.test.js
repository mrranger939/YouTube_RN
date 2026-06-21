import test from "node:test";
import assert from "node:assert/strict";

import * as userCtrl from "../../controllers/userController.js";
import * as db from "../../services/db.js";

function makeRes() {
  let statusCode = null;
  let body = null;

  return {
    status(code) {
      statusCode = code;
      return this;
    },

    json(obj) {
      body = obj;
      return { statusCode, body };
    },

    _get() {
      return { statusCode, body };
    },
  };
}

/* -------------------------------------------------------------------------- */
/* userDetails */
/* -------------------------------------------------------------------------- */

test("userDetails returns 404 when user not found", async () => {
  const req = {
    params: {
      userId: "u1",
    },
  };

  const res = makeRes();

  const origFindById = db.User.findById;

  try {
    db.User.findById = () => ({
      select: async () => null,
    });

    await userCtrl.userDetails(req, res);

    const r = res._get();

    assert.equal(r.statusCode, 404);

    assert.deepEqual(r.body, {
      success: false,
      message: "User not found",
    });
  } finally {
    db.User.findById = origFindById;
  }
});

test("userDetails returns user details successfully", async () => {
  const req = {
    params: {
      userId: "u1",
    },
  };

  const res = makeRes();

  const origFindById = db.User.findById;

  try {
    const mockUser = {
      _id: "u1",
      username: "john",
      email: "john@test.com",
    };

    db.User.findById = () => ({
      select: async () => mockUser,
    });

    await userCtrl.userDetails(req, res);

    const r = res._get();

    assert.equal(r.statusCode, 200);

    assert.deepEqual(r.body, {
      success: true,
      data: mockUser,
    });
  } finally {
    db.User.findById = origFindById;
  }
});

test("userDetails returns 500 when database throws error", async () => {
  const req = {
    params: {
      userId: "u1",
    },
  };

  const res = makeRes();

  const origFindById = db.User.findById;
  const origConsoleError = console.error;

  try {
    console.error = () => {};

    db.User.findById = () => ({
      select: async () => {
        throw new Error("Database Error");
      },
    });

    await userCtrl.userDetails(req, res);

    const r = res._get();

    assert.equal(r.statusCode, 500);

    assert.deepEqual(r.body, {
      success: false,
      message: "Internal server error",
    });
  } finally {
    db.User.findById = origFindById;
    console.error = origConsoleError;
  }
});