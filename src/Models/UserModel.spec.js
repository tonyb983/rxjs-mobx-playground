import { User, UserStore } from './UserModel';

describe('User Model Tests', () => {
    it('Can create a User', () => {
        const user = User.create({email: 'test', password: 'CmoneyR2', username: 'tonyb983'});

        //console.log(`User: ${JSON.stringify(user, null, 2)}`);

        expect(user).toBeDefined();
        expect(user.passwordStrength()).toBe('Medium');
        expect(user.username).toBe('tonyb983');
    });
});

describe('User Database Tests', () => {
    it('Can create a user database', () => {
        const db = UserStore.create();

        expect(db).toBeDefined();
    });

    it('Can create a user db and add a user.', () => {
        const user1 = {email: 'test', password: 'CmoneyR2', username: 'tonyb983'};
        const user2 = {email: 'test2', password: 'dummydummy', username: 'someguy'};
        const db = UserStore.create();
        const result1 = db.createUser(user1);
        expect(result1).toBe(true);
        expect(db.users.size).toBe(1);
        const result2 = db.createUser(user2);
        expect(result2).toBe(true);
        expect(db.users.size).toBe(2);
    });

    it('Duplicate email address fails when adding.', () => {
        const user1 = {email: 'test', password: 'CmoneyR2', username: 'tonyb983'};
        const user2 = {email: 'test2', password: 'dummydummy', username: 'someguy'};
        const user3 = {email: 'test2', password: 'dummydummy', username: 'failure'};

        const db = UserStore.create();

        const result1 = db.createUser(user1);
        expect(result1).toBe(true);
        expect(db.users.size).toBe(1);

        const result2 = db.createUser(user2);
        expect(result2).toBe(true);
        expect(db.users.size).toBe(2);

        const result3 = db.createUser(user3);
        expect(result3).toBe(false);
        expect(db.users.size).toBe(2);
    });

    it('Duplicate username fails when adding.', () => {
        const user1 = {email: 'test', password: 'CmoneyR2', username: 'tonyb983'};
        const user2 = {email: 'test2', password: 'dummydummy', username: 'someguy'};
        const user3 = {email: 'test3', password: 'dummydummy', username: 'someguy'};

        const db = UserStore.create();

        const result1 = db.createUser(user1);
        expect(result1).toBe(true);
        expect(db.users.size).toBe(1);

        const result2 = db.createUser(user2);
        expect(result2).toBe(true);
        expect(db.users.size).toBe(2);

        const result3 = db.createUser(user3);
        expect(result3).toBe(false);
        expect(db.users.size).toBe(2);
    });

    it('Can correctly add a UserModel to the database.', () => {
        const user = User.create({username: 'Tony', email: 'tonyb983@gmail.com', password: 'Sup29572!!dkal'});
        const user2 = User.create({username: 'Tony2', email: 'tonyb@gmail.com', password: 'Sup29572!!dkal'});
        const db = UserStore.create();
        //db.setDebug(true);

        expect(user).toBeDefined();

        db.createUser(user);
        expect(db.users.size).toBe(1);
        db.createUser(user2);
        expect(db.users.size).toBe(2);

        const failure = db.createUser({username: 'Tony'});
        expect(failure).toBeFalsy();
    })

    it('Can set and toggle Debug Mode.', () => {
        const db = UserStore.create();

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

    it('Can get user by email', () => {
        const user1 = {email: 'test', password: 'CmoneyR2', username: 'tonyb983'};
        const user2 = {email: 'test2', password: 'dummydummy', username: 'someguy'};

        const db = UserStore.create();

        db.createUser(user1);
        db.createUser(user2);

        const found1 = db.getUserByEmail('test');
        expect(found1).toBeDefined();
        expect(found1.username).toBe('tonyb983');
        expect(found1.password).toBe('CmoneyR2');
    })
})
