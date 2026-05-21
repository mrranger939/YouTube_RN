import test from 'node:test';
import assert from 'node:assert/strict';

import * as commentCtrl from '../../controllers/commentController.js';
import * as db from '../../services/db.js';

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
/* postComment */
/* -------------------------------------------------------------------------- */

test('postComment returns 400 when videoId missing', async () => {
  const req = {
    body: {
      commentText: 'hello',
    },
    user: {
      user_id: 'u1',
    },
  };

  const res = makeRes();

  await commentCtrl.postComment(req, res);

  const r = res._get();

  assert.equal(r.statusCode, 400);

  assert.deepEqual(r.body, {
    error: 'videoId and commentText are required',
  });
});

test('postComment returns 404 when video not found', async () => {
  const req = {
    body: {
      videoId: 'vid1',
      commentText: 'hello',
    },
    user: {
      user_id: 'u1',
    },
  };

  const res = makeRes();

  const origFindOne = db.Video.findOne;

  try {
    db.Video.findOne = async () => null;

    await commentCtrl.postComment(req, res);

    const r = res._get();

    assert.equal(r.statusCode, 404);

    assert.deepEqual(r.body, {
      error: 'Video not found',
    });
  } finally {
    db.Video.findOne = origFindOne;
  }
});

test('postComment returns 404 when parent comment not found', async () => {
  const req = {
    body: {
      videoId: 'vid1',
      parentCommentId: 'c1',
      commentText: 'reply',
    },
    user: {
      user_id: 'u1',
    },
  };

  const res = makeRes();

  const origVideoFindOne = db.Video.findOne;
  const origCommentFindOne = db.Comment.findOne;

  try {
    db.Video.findOne = async () => ({});
    db.Comment.findOne = async () => null;

    await commentCtrl.postComment(req, res);

    const r = res._get();

    assert.equal(r.statusCode, 404);

    assert.deepEqual(r.body, {
      error: 'Parent comment not found for this video',
    });
  } finally {
    db.Video.findOne = origVideoFindOne;
    db.Comment.findOne = origCommentFindOne;
  }
});
test('postComment creates comment successfully', async () => {
  const req = {
    body: {
      videoId: 'vid1',
      commentText: 'nice video',
    },
    user: {
      user_id: 'u1',
    },
  };

  const res = makeRes();

  const origVideoFindOne = db.Video.findOne;
  const origCreate = db.Comment.create;

  try {
    db.Video.findOne = async () => ({});

    db.Comment.create = async () => ({});

    await commentCtrl.postComment(req, res);

    const r = res._get();

    assert.equal(r.statusCode, 201);

    assert.match(
      r.body.message,
      /created comment successfully with id:/
    );
  } finally {
    db.Video.findOne = origVideoFindOne;
    db.Comment.create = origCreate;
  }
});

/* -------------------------------------------------------------------------- */
/* getComment */
/* -------------------------------------------------------------------------- */

test('getComment returns 404 when comment not found', async () => {
  const req = {
    params: {
      commentUUID: 'c1',
    },
  };

  const res = makeRes();

  const origFindOne = db.Comment.findOne;

  try {
    db.Comment.findOne = () => ({
      lean: async () => null,
    });

    await commentCtrl.getComment(req, res);

    const r = res._get();

    assert.equal(r.statusCode, 404);

    assert.deepEqual(r.body, {
      error: 'comment not found',
    });
  } finally {
    db.Comment.findOne = origFindOne;
  }
});

test('getComment returns comment successfully', async () => {
  const req = {
    params: {
      commentUUID: 'c1',
    },
  };

  const res = makeRes();

  const origFindOne = db.Comment.findOne;

  try {
    db.Comment.findOne = () => ({
      lean: async () => ({
        id: 'c1',
        commentText: 'hello',
      }),
    });

    await commentCtrl.getComment(req, res);

    const r = res._get();

    assert.equal(r.statusCode, null);

    assert.deepEqual(r.body, {
      id: 'c1',
      commentText: 'hello',
    });
  } finally {
    db.Comment.findOne = origFindOne;
  }
});

/* -------------------------------------------------------------------------- */
/* getCommentsByVideoId */
/* -------------------------------------------------------------------------- */

test('getCommentsByVideoId returns comments', async () => {
  const req = {
    params: {
      videoId: 'vid1',
    },
  };

  const res = makeRes();

  const origFind = db.Comment.find;

  try {
    db.Comment.find = () => ({
      lean: async () => ([
        { id: 'c1' },
        { id: 'c2' },
      ]),
    });

    await commentCtrl.getCommentsByVideoId(req, res);

    const r = res._get();

    assert.equal(r.statusCode, 200);

    assert.deepEqual(r.body, [
      { id: 'c1' },
      { id: 'c2' },
    ]);
  } finally {
    db.Comment.find = origFind;
  }
});

/* -------------------------------------------------------------------------- */
/* getRepliesByCommentId */
/* -------------------------------------------------------------------------- */

test('getRepliesByCommentId returns replies', async () => {
  const req = {
    params: {
      commentId: 'c1',
    },
  };

  const res = makeRes();

  const origFind = db.Comment.find;

  try {
    db.Comment.find = () => ({
      lean: async () => ([
        { id: 'r1', parentCommentId: 'c1' },
      ]),
    });

    await commentCtrl.getRepliesByCommentId(req, res);

    const r = res._get();

    assert.equal(r.statusCode, 200);

    assert.deepEqual(r.body, [
      { id: 'r1', parentCommentId: 'c1' },
    ]);
  } finally {
    db.Comment.find = origFind;
  }
});