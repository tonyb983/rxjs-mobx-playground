import { TodoModel } from './TodoModel';

describe('Todo Model Tests', () => {

    it('Creates a blank todo.', () => {
        const todo = TodoModel.create();

        expect(todo).toBeDefined();
    });

    it('Creates a full todo.', () => {
        const content = "Some Todo Content";
        const tags = ['Tag1', 'Tag2', 'Tag3'];
        const todo = TodoModel.create({ content, tags });

        console.log(JSON.stringify(todo, null, 2));

        expect(todo).toBeDefined();
        expect(todo.id).not.toBeFalsy();
        expect(todo.content).toBe(content);
        expect(todo.tagCount).toBe(3);
        expect(todo.tags[0]).toBe('Tag1');
    });

    it('Can add a tag to a todo', () => {
        const content = "Some Todo Content";
        const given = ['Tag1', 'Tag2'];
        const addTag = 'Tag3';
        const expected = ['Tag1', 'Tag2', addTag];
        const todo = TodoModel.create({ content, tags: given });

        console.log(JSON.stringify(todo, null, 2));

        expect(todo).toBeDefined();
        expect(todo.id).not.toBeFalsy();
        expect(todo.content).toBe(content);
        expect(todo.tagCount).toBe(2);
        expect(todo.tags[0]).toBe('Tag1');
        todo.addTag(addTag);

        console.log(JSON.stringify(todo, null, 2));
        expect(todo.tagCount).toBe(3);
        expect(todo.tags[2]).toBe('Tag3');
    })

})
