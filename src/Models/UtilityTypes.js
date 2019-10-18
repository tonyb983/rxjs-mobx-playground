import { types, flow, getSnapshot, getType, isType,  } from 'mobx-state-tree';
import shortid from 'shortid';
import { isString } from 'lodash';

export const Identifiable = types
    .model({
        id: types.optional(types.identifier, () => shortid())
    })
    .views(self => ({}))
    .actions(self => ({}));

export function createIdentifiableList(idType){
    if(!isType(idType)){
        console.log(`CreateIdentifiableList: Given idType is not a type. idType: ${JSON.stringify(idType, null, 2)}`);
        return undefined;
    }

    return types
        .model({
            items: types.map(idType)
        })
        .actions(self => ({
            findByID(id){
                if(!id || !isString(id)){
                    console.log(`IdentifiableList: Given id is not a string.`);
                    return undefined;
                }

                if(!self.items.has(id)){
                    console.log(`IdentifiableList: Given id is not in collection.`);
                    return undefined;
                }

                return self.items.get(id);
            }
        }))
}

export const CreationLogger = types
    .model()
    .actions(self => ({
        afterCreate() {
            console.log("Instantiated " + getType(self).name);
        }
    }))

export function createStorable(collection, id = 'id'){
    return types
    .model({})
    .actions(self => ({
        save: flow(function* save(){
            try {
                yield window.fetch(`https://localhost:3001/${collection}/${self[id]}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify(getSnapshot(self))
                })
            } catch(e) {
                console.error(`Failed to Save: ${e}`);
            }
        })
    }))
}
