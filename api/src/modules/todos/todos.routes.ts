import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { todosController } from './todos.controller.js';
import { CreateTodoBody, ListTodosQuery, TodoIdParams, UpdateTodoBody } from './todos.schema.js';

export const todosRouter = Router();

todosRouter.get('/', validate({ query: ListTodosQuery }), todosController.list);
todosRouter.post('/', validate({ body: CreateTodoBody }), todosController.create);
todosRouter.get('/:id', validate({ params: TodoIdParams }), todosController.get);
todosRouter.patch('/:id', validate({ params: TodoIdParams, body: UpdateTodoBody }), todosController.update);
todosRouter.delete('/:id', validate({ params: TodoIdParams }), todosController.remove);
