import { Todo, TodoStore } from './TodoModel';

describe('Todo Model Tests', () => {

    it('Creates a blank todo.', () => {
        const todo = Todo.create();

        expect(todo).toBeDefined();
    });

    it('Creates a full todo.', () => {
        const content = "Some Todo Content";
        const tags = ['Tag1', 'Tag2', 'Tag3'];
        const todo = Todo.create({ content, tags });

        //console.log(JSON.stringify(todo, null, 2));

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
        const todo = Todo.create({ content, tags: given });

        //console.log(JSON.stringify(todo, null, 2));

        expect(todo).toBeDefined();
        expect(todo.id).not.toBeFalsy();
        expect(todo.content).toBe(content);
        expect(todo.tagCount).toBe(2);
        expect(todo.tags[0]).toBe('Tag1');
        todo.addTag(addTag);

        //console.log(JSON.stringify(todo, null, 2));
        expect(todo.tagCount).toBe(3);
        expect(todo.tags[2]).toBe('Tag3');
    });

    it('Can update the content of a todo.', () => {
        const content = "Some Todo Content";
        const tags = ['Tag1', 'Tag2', 'Tag3'];
        const todo = Todo.create({ content, tags });

        expect(todo.content).toBe('Some Todo Content');
        todo.updateContent('New Todo Content');
        expect(todo.content).toBe('New Todo Content');
    });

    it('Can remove a tag from a todo.', () => {
        const content = "Some Todo Content";
        const tags = ['Tag1', 'Tag2', 'Tag3'];
        const todo = Todo.create({ content, tags });

        expect(todo.tags.length).toBe(3);
        todo.addTag('Tag4');
        expect(todo.hasTag('Tag4')).toBe(true);
        expect(todo.tags.length).toBe(4);
        todo.removeTag('Tag4');
        expect(todo.hasTag('Tag4')).toBe(false);
        expect(todo.tags.length).toBe(3);
    });

    it('Fails gracefully when trying to remove a tag that doesn\'t exist', () => {
        const content = "Some Todo Content";
        const tags = ['Tag1', 'Tag2', 'Tag3'];
        const todo = Todo.create({ content, tags });

        expect(todo.tagCount).toBe(3);
        todo.removeTag('Tag4');
        expect(todo.tagCount).toBe(3);
    });

    it('Displays the tags correctly.', () => {
        const content = "Some Todo Content";
        const tags = ['Tag1', 'Tag2', 'Tag3'];
        const todo = Todo.create({ content, tags });

        expect(todo.tagDisplay).toBe('Tag1 Tag2 Tag3');
    });

    it('Fails when trying to update content to a blank or invalid string.', () => {
        const content = "Some Todo Content";
        const tags = ['Tag1', 'Tag2', 'Tag3'];
        const todo = Todo.create({ content, tags });

        expect(todo.content).toBe('Some Todo Content');
        todo.updateContent('');
        expect(todo.content).toBe('Some Todo Content');
        todo.updateContent(1234);
        expect(todo.content).toBe('Some Todo Content');
    });

    it('Fails when trying to add a blank or invalid or duplicate tag.', () => {
        const content = "Some Todo Content";
        const tags = ['Tag1', 'Tag2', 'Tag3'];
        const todo = Todo.create({ content, tags });

        expect(todo.tagCount).toBe(3);
        todo.addTag('');
        expect(todo.tagCount).toBe(3);
        todo.addTag('Tag1');
        expect(todo.tagCount).toBe(3);
        todo.addTag(1234);
        expect(todo.tagCount).toBe(3);
    });

    it('Fails when trying to remove a blank or invalid or non-existant tag.', () => {
        const content = "Some Todo Content";
        const tags = ['Tag1', 'Tag2', 'Tag3'];
        const todo = Todo.create({ content, tags });

        expect(todo.tagCount).toBe(3);
        todo.removeTag('');
        expect(todo.tagCount).toBe(3);
        todo.removeTag('Tag5');
        expect(todo.tagCount).toBe(3);
        todo.removeTag(1234);
        expect(todo.tagCount).toBe(3);
    });

    it('Successfully replaces a tag list.', () => {
        const content = "Some Todo Content";
        const firstTags = ['Tag1', 'Tag2', 'Tag3'];
        const secondTags = ['Tag4', 'Tag5'];
        const todo = Todo.create({ content, tags: firstTags });

        expect(todo.tagDisplay).toBe(firstTags.join(' '));
        todo.replaceTags(secondTags);
        expect(todo.tagDisplay).toBe(secondTags.join(' '));
    });

    it('Fails to replace a tag list with an invalid tag array.', () => {
        const content = "Some Todo Content";
        const firstTags = ['Tag1', 'Tag2', 'Tag3'];
        const secondTags = ['', 'Tag1', 'Tag1'];
        const thirdTags = [123, 123, 123];
        const todo = Todo.create({ content, tags: firstTags });

        expect(todo.tagDisplay).toBe(firstTags.join(' '));
        todo.replaceTags(secondTags);
        expect(todo.tagDisplay).toBe('Tag1');
        todo.replaceTags(firstTags);
        expect(todo.tagDisplay).toBe(firstTags.join(' '));
        todo.replaceTags(thirdTags);
        expect(todo.tagDisplay).toBe(firstTags.join(' '));
    });

    it('Successfully computes hasTag', () => {
        const content = "Some Todo Content";
        const tags = ['Tag1', 'Tag2', 'Tag3'];
        const todo = Todo.create({ content, tags });

        expect(todo.hasTag('Tag1')).toBe(true);
        expect(todo.hasTag('Tag4')).toBe(false);
        expect(todo.hasTag(1234)).toBe(false);
    })
});

describe('Todo Database Tests', () => {
    it('Creates an empty Todo Database', () => {
        const db = TodoStore.create({});

        //console.log(`TodoDB: ${JSON.stringify(db, null, 2)}`);

        expect(db).toBeDefined();
    });

    it('Can create a Todo DB with existing todos.', () => {
        const todo1 = Todo.create({content: 'Content 1', tags: ['Tag1', 'Tag3']});
        const todo2 = Todo.create({content: 'Content 2', tags: ['Tag2']});
        const todo3 = Todo.create({content: 'Content 3', tags: ['Tag2', 'Tag3']});

        const db = TodoStore.create({});

        expect(db.todos.size).toBe(0);

        db.addTodo(todo1);
        //console.log(`TodoDB: ${JSON.stringify(db, null, 2)}`);

        expect(db.todos.size).toBe(1);

        db.addTodo(todo2);
        //console.log(`TodoDB: ${JSON.stringify(db, null, 2)}`);

        expect(db.todos.size).toBe(2);

        db.addTodo(todo3);
        //console.log(`TodoDB: ${JSON.stringify(db, null, 2)}`);

        expect(db.todos.size).toBe(3);
    });

    it('Can add and then remove a Todo.',  () => {
        const todo1 = Todo.create({content: 'Content 1', tags: ['Tag1', 'Tag3']});
        const todo2 = Todo.create({content: 'Content 2', tags: ['Tag2']});

        const db = TodoStore.create({});

        db.addTodo(todo1);
        //console.log(`TodoDB: ${JSON.stringify(db, null, 2)}`);

        expect(db.todos.size).toBe(1);

        db.addTodo(todo2);
        //console.log(`TodoDB: ${JSON.stringify(db, null, 2)}`);

        expect(db.todos.size).toBe(2);

        db.removeTodo(todo1);
        //console.log(`TodoDB: ${JSON.stringify(db, null, 2)}`);

        expect(db.todos.size).toBe(1);
    });

    it('Can produce an array of unique tags.', () => {
        const todo1 = Todo.create({content: 'Content 1', tags: ['Tag1', 'Tag3']});
        const todo2 = Todo.create({content: 'Content 2', tags: ['Tag2']});
        const todo3 = Todo.create({content: 'Content 3', tags: ['Tag2', 'Tag3']});

        const db = TodoStore.create({});
        db.addTodo(todo1);
        db.addTodo(todo2);
        db.addTodo(todo3);

        expect(db.allTags.length).toBe(3);
        expect(db.allTags.includes('Tag1')).toBe(true);
    });

    it('Can query based on content.', () => {
        const todo1 = Todo.create({content: 'Content 1', tags: ['Tag1', 'Tag3']});
        const todo2 = Todo.create({content: 'Content 2', tags: ['Tag2']});
        const todo3 = Todo.create({content: 'Content 3', tags: ['Tag2', 'Tag3']});

        const db = TodoStore.create({});
        db.addTodo(todo1);
        db.addTodo(todo2);
        db.addTodo(todo3);

        const success = db.todosWithContent('Content');
        expect(success.length).toBe(3);
        //console.log(`Todos with 'Content': ${JSON.stringify(success, null, 2)}`)

        const failure = db.todosWithContent('xyz');
        expect(failure.length).toBe(0);
    });

    it('Can query based on tag.', () => {
        const todo1 = Todo.create({content: 'Content 1', tags: ['Tag1', 'Tag3']});
        const todo2 = Todo.create({content: 'Content 2', tags: ['Tag2']});
        const todo3 = Todo.create({content: 'Content 3', tags: ['Tag2', 'Tag3']});

        const db = TodoStore.create({});
        db.addTodo(todo1);
        db.addTodo(todo2);
        db.addTodo(todo3);

        const success = db.todosWithTag('Tag2');
        expect(success.length).toBe(2);
        //console.log(`Todos with 'Tag2': ${JSON.stringify(success, null, 2)}`)

        const failure = db.todosWithTag('xyz');
        expect(failure.length).toBe(0);
    });

    it('Can set and toggle Debug Mode.', () => {
        const db = TodoStore.create({});

        expect(db.debugMode).toBe(false);
        db.setDebug(true);
        expect(db.debugMode).toBe(true);
        db.setDebug(false);
        expect(db.debugMode).toBe(false);
        db.toggleDebug();
        expect(db.debugMode).toBe(true);
        db.toggleDebug();
        expect(db.debugMode).toBe(false);
    });

    it('Can add a non-model instance todo based on content and tags.', () => {
        const db = TodoStore.create({});

        db.addTodo({content: 'Content 1', tags: ['Tag1', 'Tag3']});
        expect(db.todos.size).toBe(1);

        db.addTodo({content: 'Content 2', tags: ['Tag2']});
        expect(db.todos.size).toBe(2);

        db.addTodo({content: 'Content 3', tags: ['Tag2', 'Tag3']});
        expect(db.todos.size).toBe(3);
    });

    it('Fails to add a todo without content', () => {
        const db = TodoStore.create({});
        //db.toggleDebug();

        const result = db.addTodo({ tags: ['Tag1', 'Tag3'] });
        expect(db.todos.size).toBe(0);
        expect(result).toBeUndefined();
        const result2 = db.addTodo(undefined);
        expect(result2).toBeUndefined();
    });

    it('Fails to remove an invalid id.', () => {
        const todo1 = Todo.create({content: 'Content 1', tags: ['Tag1', 'Tag3']});
        const todo2 = Todo.create({content: 'Content 2', tags: ['Tag2']});
        const todo3 = Todo.create({content: 'Content 3', tags: ['Tag2', 'Tag3']});

        const db = TodoStore.create({});
        //db.toggleDebug();
        db.addTodo(todo1);
        db.addTodo(todo2);
        db.addTodo(todo3);

        const id1 = todo1.id;

        expect(db.todos.size).toBe(3);
        db.removeTodo({id: id1});
        expect(db.todos.size).toBe(2);
        db.removeTodo(111);
        expect(db.todos.size).toBe(2);
        db.removeTodo(todo2);
        expect(db.todos.size).toBe(1);
        expect(db.isValidID(todo3.id)).toBe(true);
    });
})
