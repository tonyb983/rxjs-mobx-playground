import { types, getParent, hasParent, getParentOfType } from 'mobx-state-tree';
import { values } from 'mobx';
import shortid from 'shortid';
import { isString, isBoolean } from 'lodash';
import { Todo, TodoStore } from "./TodoModel";
import { Store } from "./StoreModel";

const emailRegex = new RegExp('/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/');
const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
const mediumRegex = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})');

export const User = types
    .model('User', {
        id: types.optional(types.identifier, () => shortid()),
        username: types.string,
        password: types.refinement('Password', types.string, (data) => data.length > 7),
        email: types.refinement('Email', types.string, (data) => {
            // TODO Email validation
            return true;
        }),
        todos: types.optional(types.array(types.reference(types.late(() => Todo))), [])
    })
    .views(self => ({
        passwordStrength(){
            if(mediumRegex.test(self.password)){
                return 'Medium';
            }

            if(strongRegex.test(self.password)){
                return 'Strong';
            }

            return 'Weak';
        },
        get store(){
            return getParent(self, 2);
        },
        get userDB(){
            return getParent(self, 1);
        },
        get todoList(){
            const todoDB = getParentOfType(self, Store).todoDB;
            return self.todos.filter(id => todoDB.isValidID(id)).map(id => todoDB.findByID(id));
        }
    }))
    .actions(self => ({
        associateTodo(todo){
            if(!todo){

            }
            const isModel = Todo.is(todo);
            const isID = isString(todo);

        },
        validateTodos(){
            const todoDB = getParent(self, 2).todoDB;
            if(!todoDB){
                console.log(`User@ValidateTodos: No TodoDB present.`);
                return;
            }

            const newList = self.todos.filter(id => todoDB.isValidID(id));
            self.todos.clear();
            newList.forEach(id => self.todos.push(id));
        }
    }));

export const UserStore = types
    .model({
        users: types.map(User),
        debugMode: false
    })
    .views(self => ({
        get store(){
            return getParent(self);
        },
        get allUsernames(){
            return values(self.users).map(u => u.username);
        },
        get allEmails(){
            return values(self.users).map(u => u.email);
        },
        getUserByID(id){
            if(!isString(id)){
                if(self.debugMode){
                    console.log(`UserDB@GetUserByID: id given is not a string. id: ${id}`);
                }
                return undefined;
            }

            return self.users.get(id);
        },
        getUserByUsername(username){
            if(!isString(username)){
                if(self.debugMode){
                    console.log(`UserDB@GetUserByID: Username given is not a string. username: ${username}`);
                }
                return undefined;
            }

            return values(self.users).find(u => u.username === username);
        },
        getUserByEmail(email){
            if(!isString(email)){
                if(self.debugMode){
                    console.log(`UserDB@GetUserByID: email given is not a string. email: ${email}`);
                }
                return undefined;
            }

            return values(self.users).find(u => u.email === email);
        },
        allTodosForUser(user){
            if(User.is(user)){
                return user.allTodos;
            }
        }
    }))
    .actions(self => ({
        /**
         * Registers a new user. Given user can be either a UserModel or an object with username, password, and email.
         * @param {{username: String, email: String, password: String}} user The new user to register.
         * @returns {Boolean} True if successfully registered the user, false otherwise.
         */
        createUser(user){
            if(!user){
                if(self.debugMode){
                    console.log(`UserDB@CreateUser: undefined user given.`);
                }
                return false;
            }

            if(User.is(user)){
                if(self.debugMode){
                    console.log(`UserDB@CreateUser: Given user is an instance of the User model, use 'addUser' instead of 'createUser'.`);
                }
                return self.addUser(user);
            }

            const {
                username,
                email,
                password,
            } = user;

            if(!username || !isString(username) || username === ''){
                if(self.debugMode){
                    console.log(`UserDB@CreateUser: Invalid Username given. username: '${username}'`);
                }
                return false;
            }

            if(!password || !isString(password) || password === ''){
                if(self.debugMode){
                    console.log(`UserDB@CreateUser: Invalid password given. password: '${password}'`);
                }
                return false;
            }

            if(!email || !isString(email) || email === ''){
                if(self.debugMode){
                    console.log(`UserDB@CreateUser: Invalid email given. email: '${email}'`);
                }
                return false;
            }

            if(self.allUsernames.includes(username)){
                if(self.debugMode){
                    console.log(`UserDB@CreateUser: Username is already in database. username:'${username}' allUsernames: ${JSON.stringify(self.allUsernames, null, 2)}`);
                }
                return false;
            }

            if(self.allEmails.includes(email)){
                if(self.debugMode){
                    console.log(`UserDB@CreateUser: Email is already in database. email:'${email}' allEmails: ${JSON.stringify(self.allEmails, null, 2)}`);
                }
                return false;
            }

            // TODO Check password strength.
            const created = User.create({email, password, username});
            self.users.put(created);
            return true;
        },
        addUser(user){
            if(!user){
                if(self.debugMode){
                    console.log(`UserDB@AddUser: undefined user given.`);
                }
                return false;
            }

            if(!User.is(user)){
                if(self.debugMode){
                    console.log(`UserDB@AddUser: Given user is not an instance of the User model. Did you mean to use createUser?`);
                }
                return self.createUser(user);
            }

            if(self.users.has(user)){
                if(self.debugMode){
                    console.log(`UserDB@AddUser: Given user already exists in UserDB.`);
                }
                return false;
            }

            if(self.allUsernames.includes(user.username)){
                if(self.debugMode){
                    console.log(`UserDB@AddUser: Given username already exists in UserDB.`);
                }
                return false;
            }

            if(self.allEmails.includes(user.email)){
                if(self.debugMode){
                    console.log(`UserDB@AddUser: Given username already exists in UserDB.`);
                }
                return false;
            }

            self.users.put(user);
            return true;
        },
        setDebug(value){
            if(!isBoolean(value)){
                if(self.debugMode){
                    console.log(`TodoDB@SetDebug: value given ('${value}') is not a boolean.`);
                }

                return;
            }

            self.debugMode = value;
        },
        toggleDebug(){
            self.debugMode = !self.debugMode;
        }
    }))
