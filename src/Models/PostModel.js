import { types, hasParent, getParent } from 'mobx-state-tree';
import { isString } from 'lodash';
import shortid from 'shortid';

import { User } from './UserModel';
import { values } from "mobx";

export const Post = types
    .model('Post', {
        id: types.optional(types.identifier, () => shortid()),
        title: types.string,
        content: types.string,
        tags: types.array(types.string),
        author: types.maybe(types.reference(types.late(() => User)))
    })
    .views(self => ({

    }))
    .actions(self => ({
        updateTitle(newTitle){
            if(!newTitle || !isString(newTitle) || newTitle === ''){
                console.log(`PostModel@UpdateTitle: Invalid title given. newTitle: '${newTitle}'`);
                return;
            }

            self.title = newTitle;
        },
        updateContent(newContent){
            if(!newContent || !isString(newContent) || newContent === ''){
                console.log(`PostModel@UpdateContent: Invalid content given. newContent: '${newContent}'`);
                return;
            }

            self.content = newContent;
        },
        hasTag(tag){
            return self.tags.indexOf(tag) !== -1;
        },
        addTag(tag){
            if(!tag || !isString(tag) || tag === ''){
                console.log(`PostModel@AddTag: Invalid tag given. tag: '${tag}'`);
                return;
            }

            if(self.hasTag(tag)){
                return;
            }

            self.tags.push(tag);
        },
        removeTag(tag){
            if(!tag || !isString(tag) || tag === ''){
                console.log(`PostModel@RemoveTag: Invalid tag given. tag: '${tag}'`);
                return;
            }

            if(!self.hasTag(tag)){
                console.log(`PostModel@RemoveTag: Post does not have given tag. tag: '${tag}'`);
                return;
            }

            const index = self.tags.indexOf(tag);
            self.tags.splice(index, 1);
        },
        setAuthor(user){
            self.author = user;
        }
    }))

export const PostStore = types
    .model({
        posts: types.map(Post)
    })
    .views(self => ({
        postsWithTag(tag){
            return values(self.posts).filter(post => post.tags.includes(tag));
        },
        getPostByID(id){
            return values(self.posts).find(post => post.id === id);
        }
    }))
    .actions(self => ({
        addPost(post){
            if(!post) return;

            self.posts.put(post);
        },
        removePost(post){
            if(!post) return;

            self.posts.delete(post.id);
        }
    }))
