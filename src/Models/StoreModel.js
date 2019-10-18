import { types } from 'mobx-state-tree';
import { TodoStore } from "./TodoModel";
import { UserStore } from "./UserModel";
import { PostStore } from "./PostModel";

export const Store = types
    .model({
        todoDB: types.optional(types.late(() => TodoStore), {}),
        userDB: types.optional(types.late(() => UserStore), {}),
        postDB: types.optional(types.late(() => PostStore), {})
    })
    .views(self => ({

    }))
    .actions(self => ({

    }))
