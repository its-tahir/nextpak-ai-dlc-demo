import type { Request, Response } from 'express';
import { todosService } from './todos.service.js';
import type { CreateTodoInput, ListTodosInput, UpdateTodoInput } from './todos.schema.js';

type Validated<T> = { body: T; params: { id: string }; query: T };
const input = <T>(res: Response) => res.locals.validated as Validated<T>;

export const todosController = {
  list(_req: Request, res: Response) {
    const { items, meta } = todosService.list(input<ListTodosInput>(res).query);
    res.json({ data: items, meta });
  },
  get(_req: Request, res: Response) {
    res.json({ data: todosService.get(input(res).params.id) });
  },
  create(req: Request, res: Response) {
    const todo = todosService.create(input<CreateTodoInput>(res).body);
    req.log.info({ todoId: todo.id }, 'todo created');
    res.status(201).json({ data: todo });
  },
  update(_req: Request, res: Response) {
    const { params, body } = input<UpdateTodoInput>(res);
    res.json({ data: todosService.update(params.id, body) });
  },
  remove(_req: Request, res: Response) {
    todosService.remove(input(res).params.id);
    res.status(204).end();
  },
};
