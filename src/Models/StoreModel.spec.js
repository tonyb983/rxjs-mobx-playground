import { Store } from './StoreModel';
import { Todo, TodoStore } from "./TodoModel";
import { UserStore, User } from "./UserModel";
import { values } from "mobx";
import { Post, PostStore } from "./PostModel";

describe('Store Model Tests', () => {
    it('Can create the store.', () => {
        const todo1 = Todo.create({content: 'Content 1', tags: ['Tag1', 'Tag3']});
        const todo2 = Todo.create({content: 'Content 2', tags: ['Tag2']});
        const todo3 = Todo.create({content: 'Content 3', tags: ['Tag2', 'Tag3']});

        const todoDB = TodoStore.create({});
        todoDB.addTodo(todo1);
        todoDB.addTodo(todo2);
        todoDB.addTodo(todo3);

        const user1 = {email: 'test', password: 'CmoneyR2', username: 'tonyb983'};
        const user2 = {email: 'test2', password: 'dummydummy', username: 'someguy'};
        const userDB = UserStore.create();
        userDB.createUser(user1);
        userDB.createUser(user2);

        const store = Store.create({todoDB, userDB});
        expect(store).toBeDefined();
    });

    it('Can add a new todo.', () => {
        const todo1 = Todo.create({content: 'Content 1', tags: ['Tag1', 'Tag3']});
        const todo2 = Todo.create({content: 'Content 2', tags: ['Tag2']});
        const todo3 = Todo.create({content: 'Content 3', tags: ['Tag2', 'Tag3']});

        const todoDB = TodoStore.create({});
        todoDB.addTodo(todo1);
        todoDB.addTodo(todo2);
        todoDB.addTodo(todo3);

        const user1 = {email: 'test', password: 'CmoneyR2', username: 'tonyb983'};
        const user2 = {email: 'test2', password: 'dummydummy', username: 'someguy'};
        const userDB = UserStore.create();
        userDB.createUser(user1);
        userDB.createUser(user2);

        const store = Store.create({todoDB, userDB});

        expect(store.todoDB.todos.size).toBe(3);
        const todo4 = Todo.create({content: 'Content 4', tags: ['Tag1','Tag2', 'Tag3', 'Tag4']});
        store.todoDB.addTodo(todo4);
        expect(store.todoDB.todos.size).toBe(4);
        store.todoDB.addTodo({content: 'Content 5', tags: ['Tag1', 'Tag4']});
        expect(store.todoDB.todos.size).toBe(5);
    });

    it('Can associate a todo with a user.', () => {
        const todo1 = Todo.create({content: 'Content 1', tags: ['Tag1', 'Tag3']});
        const todo2 = Todo.create({content: 'Content 2', tags: ['Tag2']});
        const todo3 = Todo.create({content: 'Content 3', tags: ['Tag2', 'Tag3']});

        const todoDB = TodoStore.create({});
        todoDB.addTodo(todo1);
        todoDB.addTodo(todo2);
        todoDB.addTodo(todo3);

        const user1 = {email: 'test', password: 'CmoneyR2', username: 'tonyb983'};
        const user2 = {email: 'test2', password: 'dummydummy', username: 'someguy'};
        const userDB = UserStore.create();
        userDB.createUser(user1);
        userDB.createUser(user2);

        const store = Store.create({todoDB, userDB});

        const found = userDB.getUserByUsername('someguy');

        expect(found).toBeDefined();

        found.associateTodo(todo1);

        //expect(values(found.todos).length).toBe(1);

        //console.log(`Store: ${JSON.stringify(store, null, 2)}`);
    });

    it('Can get all Todos associated with a user.', () => {
        const todo1 = Todo.create({content: 'Content 1', tags: ['Tag1', 'Tag3']});
        const todo2 = Todo.create({content: 'Content 2', tags: ['Tag2']});
        const todo3 = Todo.create({content: 'Content 3', tags: ['Tag2', 'Tag3']});

        const todoDB = TodoStore.create({});
        todoDB.addTodo(todo1);
        todoDB.addTodo(todo2);
        todoDB.addTodo(todo3);

        const user = {email: 'test2', password: 'dummydummy', username: 'someguy'};
        const userDB = UserStore.create();
        userDB.createUser(user);

        const store = Store.create({todoDB, userDB});

        const found = userDB.getUserByUsername('someguy');

        expect(found).toBeDefined();

        found.associateTodo(todo1);
        found.associateTodo(todo2);
        found.associateTodo(todo3);

        // console.log(`Store: ${JSON.stringify(store, null, 2)}`);

        const allTodos = store.userDB.getUserByUsername('someguy').todoList;

        expect(allTodos).toBeDefined();

        // console.log(`AllTodos: ${JSON.stringify(allTodos, null, 2)}`);
    })

    it('Can associate a User to a Post.', () => {
        const post = Post.create({title: 'Post Title', content: 'Post content', tags: ['post1', 'post2']});
        const user = User.create({email: 'test', password: 'dummydummy', username: 'someguy'});
        const userDB = UserStore.create();
        const postDB = PostStore.create();
        postDB.addPost(post);
        userDB.addUser(user);
        const store = Store.create({userDB, postDB});
        console.log(JSON.stringify(store, null, 2));
        const foundPost = values(store.postDB.posts).find(p => p.id === post.id);
        const foundUser = values(store.userDB.users).find(u => u.id === user.id);

        expect(foundPost).toBeDefined();
        expect(foundUser).toBeDefined();

        foundPost.setAuthor(foundUser);

        expect(foundPost.author).toBeDefined();
        console.log(`foundPost.author: ${foundPost.author}`);
    })
})
