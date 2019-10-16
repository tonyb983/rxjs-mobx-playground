import { types } from 'mobx-state-tree';
import sid from 'shortid';
import { isString } from 'lodash';

export const TodoModel = types
    .model({
        id: types.optional(types.identifier, () => sid()),
        content: types.optional(types.string, ''),
        tags: types.optional(types.array(types.string), [])
    })
    .actions(self => ({
        updateContent(c){
            if(!c || c === '') return;

            self.content = c;
        },
        hasTag(tag){
            return self.tags.indexOf(tag) !== -1
        },
        addTag(tag){
            if(!tag || tag === '' || self.tags.indexOf(tag) !== -1) return;

            self.tags.push(tag);
        },
        removeTag(tag){
            if(!tag || tag === '') return;

            const index = self.tags.indexOf(tag);
            if(index === -1) return;

            self.tags.splice(index, 1);
        },
        replaceTags(tags){
            if(!Array.isArray(tags)) return;
            const tagsValid = tags.every(t => isString(t));
            if(!tagsValid){
                console.log(`Tag array ${JSON.stringify(tags, null, 2)} failed the isString test.`);
                return;
            }
            self.tags.splice(0, self.tags.length);
            tags.forEach(t => self.tags.push(t));
        }
    }))
    .views(self => ({
        get tagCount(){
            return self.tags.length;
        },
        get tagDisplay(){
            return self.tags.join(' ');
        }
    }));

    const UserModel = types
        .model({
            id: types.optional(types.identifier, () => sid()),
            name: types.string,
            pass: types.refinement('ValidPassword', types.string, (data) => {
                return data.length > 8;
            }),
            todos: types.optional(types.array(types.reference(TodoModel)), [])
        })
        .actions(self => ({
            associateTodo({id, content, tags}){
                self.todos.push({id, content, tags});
            }
        }))
        .views(self => ({

        }))

    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

    /*
        PASSWORD REGEX

        Strong:
        var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

        Medium:
        var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");


    */
