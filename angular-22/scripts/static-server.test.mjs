import assert from 'node:assert/strict';
import test from 'node:test';

import { sendInternalServerError } from './static-server.mjs';

test('internal server errors do not expose exception details', () => {
  const result = {};
  const response = {
    writeHead(status, headers) {
      result.status = status;
      result.headers = headers;
    },
    end(body) {
      result.body = body;
    }
  };
  const originalConsoleError = console.error;
  console.error = () => {};

  try {
    sendInternalServerError(response, new Error('/private/path/secret.txt'));
  } finally {
    console.error = originalConsoleError;
  }

  assert.equal(result.status, 500);
  assert.equal(result.body, 'Internal server error');
  assert.equal(result.body.includes('/private/path'), false);
});
