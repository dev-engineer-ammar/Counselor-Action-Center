import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { describe, it } from 'node:test';
import httpMocks, { RequestOptions } from 'node-mocks-http';
import { app } from './server';

const dispatch = async (options: RequestOptions) => {
  const req = httpMocks.createRequest(options);
  const res = httpMocks.createResponse({
    eventEmitter: EventEmitter
  });

  await new Promise<void>((resolve, reject) => {
    res.on('end', resolve);
    res.on('error', reject);
    app(req, res);
  });

  return {
    statusCode: res.statusCode,
    headers: res._getHeaders(),
    body: res._getJSONData() as unknown
  };
};

describe('student action center API', () => {
  it('returns action center data and preserves request IDs on errors', async () => {
    const actionCenterResponse = await dispatch({
      method: 'GET',
      url: '/api/students/stu_001/action-center',
      headers: { 'x-request-id': 'test-action-center' }
    });
    const actionCenterBody = actionCenterResponse.body as {
      student: { id: string };
      urgencyLevel: string;
      tasks: unknown[];
    };

    assert.equal(actionCenterResponse.statusCode, 200);
    assert.equal(actionCenterResponse.headers['x-request-id'], 'test-action-center');
    assert.equal(actionCenterBody.student.id, 'stu_001');
    assert.equal(actionCenterBody.urgencyLevel, 'critical');
    assert.ok(actionCenterBody.tasks.length > 0);

    const invalidStatusResponse = await dispatch({
      method: 'PATCH',
      url: '/api/tasks/tsk_001/status',
      headers: { 'x-request-id': 'test-invalid-status' },
      body: { status: 'blocked' }
    });
    const invalidStatusBody = invalidStatusResponse.body as {
      error: string;
      requestId: string;
    };

    assert.equal(invalidStatusResponse.statusCode, 400);
    assert.equal(invalidStatusResponse.headers['x-request-id'], 'test-invalid-status');
    assert.deepEqual(invalidStatusBody, {
      error: 'Invalid payload status validation data state',
      requestId: 'test-invalid-status'
    });
  });
});
