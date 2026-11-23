import assert from 'node:assert/strict';
import { once } from 'node:events';
import { test } from 'node:test';
import { createApp } from '../../src/app.js';

test('GET / presenta la pantalla de recepción y el panel derecho', async (context) => {
  const server = createApp().listen(0, '127.0.0.1');
  context.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  }));
  await once(server, 'listening');

  const response = await fetch(`http://127.0.0.1:${server.address().port}/`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /text\/html/);
  const html = await response.text();
  assert.match(html, /Registrar cita médica/);
  assert.match(html, /for="nss"/);
  assert.match(html, /id="panel-derecho"/);
});
