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

  it('creates a todo with an optional due date', async () => {
    const res = await request(app).post('/api/v1/todos').send({ title: 'Task with date', dueDate: '2026-11-15' });
    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({
      title: 'Task with date',
      completed: false,
      dueDate: '2026-11-15',
      overdue: false,
    });
  });

  it('rejects an invalid due date', async () => {
    const res = await request(app).post('/api/v1/todos').send({ title: 'Invalid date', dueDate: '2026-02-31' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects a due date containing a time', async () => {
    const res = await request(app).post('/api/v1/todos').send({ title: 'Date with time', dueDate: '2026-11-15T12:00:00Z' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
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

  it('filters overdue todos with ?overdue=true and boundary at today (UTC)', async () => {
    const todayUTC = new Date().toISOString().slice(0, 10);

    // 1. Incomplete todo with past due date -> overdue
    await request(app).post('/api/v1/todos').send({ title: 'Overdue task', dueDate: '2020-01-01' });
    // 2. Completed todo with past due date -> not overdue
    const completedRes = await request(app).post('/api/v1/todos').send({ title: 'Completed old task', dueDate: '2020-01-01' });
    await request(app).patch(`/api/v1/todos/${completedRes.body.data.id}`).send({ completed: true });
    // 3. Incomplete todo due TODAY -> NOT overdue (must be strictly before today)
    await request(app).post('/api/v1/todos').send({ title: 'Due today task', dueDate: todayUTC });
    // 4. Incomplete todo with future due date -> not overdue
    await request(app).post('/api/v1/todos').send({ title: 'Future task', dueDate: '2099-01-01' });
    // 5. Incomplete todo with no due date -> not overdue
    await request(app).post('/api/v1/todos').send({ title: 'No due date task' });

    const overdueRes = await request(app).get('/api/v1/todos?overdue=true');
    expect(overdueRes.status).toBe(200);
    expect(overdueRes.body.data).toHaveLength(1);
    expect(overdueRes.body.data[0]).toMatchObject({
      title: 'Overdue task',
      completed: false,
      dueDate: '2020-01-01',
      overdue: true,
    });
    expect(overdueRes.body.meta.total).toBe(1);

    const nonOverdueRes = await request(app).get('/api/v1/todos?overdue=false');
    expect(nonOverdueRes.status).toBe(200);
    expect(nonOverdueRes.body.data).toHaveLength(4);

    const allRes = await request(app).get('/api/v1/todos');
    expect(allRes.status).toBe(200);
    expect(allRes.body.data).toHaveLength(5);
  });

  it('rejects an invalid overdue query value', async () => {
    const res = await request(app).get('/api/v1/todos?overdue=invalid');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('GET /api/v1/todos/:id', () => {
  it('returns a todo by id with dueDate and overdue status', async () => {
    const createRes = await request(app).post('/api/v1/todos').send({ title: 'Specific task', dueDate: '2020-01-01' });
    const res = await request(app).get(`/api/v1/todos/${createRes.body.data.id}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({
      title: 'Specific task',
      dueDate: '2020-01-01',
      overdue: true,
    });
  });

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

  it('updates a todo due date and allows removing it with null', async () => {
    const { body } = await create('task');
    const updateRes = await request(app).patch(`/api/v1/todos/${body.data.id}`).send({ dueDate: '2026-12-01' });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.dueDate).toBe('2026-12-01');

    const removeRes = await request(app).patch(`/api/v1/todos/${body.data.id}`).send({ dueDate: null });
    expect(removeRes.status).toBe(200);
    expect(removeRes.body.data.dueDate).toBeNull();
  });

  it('rejects an invalid due date on update', async () => {
    const { body } = await create('task');
    const res = await request(app).patch(`/api/v1/todos/${body.data.id}`).send({ dueDate: '2026-02-31' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
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
