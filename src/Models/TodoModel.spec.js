import { TodoModel } from './TodoModel';

describe('Todo Model Tests', () => {

    it('Creates a blank todo.', () => {
        const todo = TodoModel.create();

        expect(todo).toBeDefined();
    })

})
