import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { todosRepository } from '../src/modules/todos/todos.repository.js';

const app = createApp();
const create = (title: string) => request(app).post('/api/v1/todos').send({ title });

beforeEach(() => todosRepository.clear());

describe('health', () => {
  it('GET /healthz answers ok', async () => {
    const res = await request(app).get('/healthz');
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('ok');
  });
});

describe('POST /api/v1/todos', () => {
  it('creates a todo, not completed', async () => {
    const res = await create('  Buy milk ');
    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({ title: 'Buy milk', completed: false });
    expect(res.body.data.id).toEqual(expect.any(String));
  });

  it('rejects an empty title', async () => {
    const res = await create('   ');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects unknown fields', async () => {
    const res = await request(app).post('/api/v1/todos').send({ title: 'x', completed: true });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects malformed JSON', async () => {
    const res = await request(app).post('/api/v1/todos').set('content-type', 'application/json').send('{"title":');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('BAD_REQUEST');
  });
});

describe('GET /api/v1/todos', () => {
  it('lists todos with pagination meta', async () => {
    await create('one');
    await create('two');
    await create('three');
    const res = await request(app).get('/api/v1/todos?page=2&limit=2');
    expect(res.status).toBe(200);
    expect(res.body.data.map((t: { title: string }) => t.title)).toEqual(['three']);
    expect(res.body.meta).toEqual({ page: 2, limit: 2, total: 3 });
  });

  it('caps the page size at 100', async () => {
    const res = await request(app).get('/api/v1/todos?limit=500');
    expect(res.status).toBe(400);
  });
});

describe('GET /api/v1/todos/:id', () => {
  it('returns 404 for an unknown todo', async () => {
    const res = await request(app).get('/api/v1/todos/3f0c7a7e-1b2c-4d3e-8f90-123456789abc');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
    expect(res.body.error.requestId).toEqual(expect.any(String));
  });

  it('returns 400 for an id that is not a uuid', async () => {
    const res = await request(app).get('/api/v1/todos/abc');
    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/v1/todos/:id', () => {
  it('renames a todo', async () => {
    const { body } = await create('old');
    const res = await request(app).patch(`/api/v1/todos/${body.data.id}`).send({ title: 'new' });
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('new');
  });

  it('marks a todo completed', async () => {
    const { body } = await create('task');
    const res = await request(app).patch(`/api/v1/todos/${body.data.id}`).send({ completed: true });
    expect(res.status).toBe(200);
    expect(res.body.data.completed).toBe(true);
  });

  it('rejects an empty update', async () => {
    const { body } = await create('task');
    const res = await request(app).patch(`/api/v1/todos/${body.data.id}`).send({});
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/v1/todos/:id', () => {
  it('deletes a todo', async () => {
    const { body } = await create('task');
    expect((await request(app).delete(`/api/v1/todos/${body.data.id}`)).status).toBe(204);
    expect((await request(app).get(`/api/v1/todos/${body.data.id}`)).status).toBe(404);
  });
});
