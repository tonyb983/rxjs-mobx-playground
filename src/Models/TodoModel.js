import { values } from 'mobx';
import { types, getParent, destroy, getType, hasParent } from 'mobx-state-tree';
import shortid from 'shortid';
import { isString, isBoolean, uniq } from 'lodash';

import { User } from './UserModel';

export const Todo = types
    .model('Todo', {
        id: types.optional(types.identifier, () => shortid()),
        content: types.optional(types.string, ''),
        tags: types.optional(types.array(types.string), []),
        owner: types.maybe(types.reference(types.late(() => User)))
    })
    .actions(self => ({
        updateContent(c){
            if(!c || !isString(c) || c === '') return;

            self.content = c;
        },
        hasTag(tag){
            if(!tag || !isString(tag) || tag === ''){
                return false;
            }

            return self.tags.indexOf(tag) !== -1
        },
        addTag(tag){
            if(!tag || !isString(tag) || tag === '' || self.tags.indexOf(tag) !== -1) return;

            self.tags.push(tag);
        },
        removeTag(tag){
            if(!tag || !isString(tag) || tag === '') return;

            const index = self.tags.indexOf(tag);
            if(index === -1) return;

            self.tags.splice(index, 1);
        },
        replaceTags(tags){
            if(!Array.isArray(tags)) return;
            const newTags = [];

            tags.forEach(tag => {
                if(isString(tag) && tag !== '' && newTags.indexOf(tag) === -1){
                    newTags.push(tag);
                }
            })

            if(newTags.length === 0){
                return;
            }

            self.tags.splice(0, self.tags.length);
            newTags.forEach(t => self.tags.push(t));
        },
        setOwner(user){
            if(!user){
                console.log(`Todo@SetOwner: undefined user passed in.`);
                return false;
            }

            if(!User.is(user)){
                return false;
            }

            self.owner = user;
            return true;
        }
    }))
    .views(self => ({
        get tagCount(){
            return self.tags.length;
        },
        get tagDisplay(){
            return self.tags.join(' ');
        },
        get store(){
            return getParent(self, 2);
        },
        get todoDB(){
            return getParent(self, 1);
        }
    }));

export const TodoStore = types
    .model({
        todos: types.map(Todo),
        debugMode: false,
    })
    .actions(self => ({
        /**
         * Adds a new todo to the database.
         * @param {{content:String, tags:Array<String>}} todo The todo to add. Can be either a TodoModel or an object with content and tags.
         */
        addTodo(todo){
            if(!todo){
                if(self.debugMode){
                    console.log(`TodoDB@AddTodo: Undefined todo passed in.`);
                }
                return undefined;
            }

            let isModelInstance = true;

            try {
                getType(todo);
            } catch {
                if(self.debugMode){
                    console.log(`TodoDB@AddTodo: Given todo is NOT a model instance.`);
                }
                isModelInstance = false;
            }

            if(!isModelInstance){
                const {
                    content,
                    tags = []
                } = todo;

                if(!isString(content) || !Array.isArray(tags) || (tags.length > 0 && !tags.every(t => isString(t)))){
                    if(self.debugMode){
                        console.log(`TodoDB@AddTodo: Todo does not pass validation. Todo: ${JSON.stringify(todo, null, 2)}`);
                    }
                    return undefined;
                }

                const created = Todo.create({content, tags});
                self.todos.put(created);
                return created;
            } else {
                self.todos.put(todo);
                return todo;
            }
        },
        removeTodo({id}){
            if(!isString(id)){
                if(self.debugMode){
                    console.log(`TodoDB@RemoveTodo: id passed in is not a string.`);
                }
                return;
            }

            if(!self.todos.has(id)){
                if(self.debugMode){
                    console.log(`TodoDB@RemoveTodo: id not found in todo list.`);
                }
                return;
            }

            self.todos.delete(id);
        },
        getTodoByID({id}){
            if(!isString(id)){
                console.log(`TodoDB@FindByID: id passed in is not a string.`);
                return undefined;
            }

            if(!self.todos.has(id)){
                console.log(`TodoDB@RemoveTodo: id not found in todo list.`);
                return;
            }

            return self.todos.get(id);
        },
        isValidID(id){
            return self.todos.has(id);
        },
        setDebug(value){
            if(!isBoolean(value)){
                if(self.debugMode){
                    console.log(`UserDB@SetDebug: value given ('${value}') is not a boolean.`);
                }

                return;
            }

            self.debugMode = value;
        },
        toggleDebug(){
            self.debugMode = !self.debugMode;
        }
    }))
    .views(self => ({
        get allTodos(){
            return values(self.todos);
        },
        get allTags(){
            const tags = [];
            values(self.todos).forEach(todo => todo.tags.forEach(tag => {
                if(tags.indexOf(tag) === -1){
                    tags.push(tag);
                }
            }));
            return tags;
        },
        todosWithContent(query){
            if(!isString(query)){
                if(self.debugMode){
                    console.log(`TodoDB@TodosWithContent: query passed in is not a string.`);
                }
                return [];
            }

            return values(self.todos).filter(todo => todo.content.includes(query))
        },
        todosWithTag(query){
            if(!isString(query)){
                if(self.debugMode){
                    console.log(`TodoDB@TodosWithContent: query passed in is not a string.`);
                }
                return [];
            }

            return values(self.todos).filter(todo => todo.hasTag(query));
        }
    }))


    /*
        PASSWORD REGEX

        Strong:
        var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

        Medium:
        var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
    */
