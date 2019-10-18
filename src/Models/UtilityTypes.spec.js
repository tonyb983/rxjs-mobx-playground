import { types } from 'mobx-state-tree';
import formatDistance from 'date-fns/formatDistance'
import { isNumber } from 'lodash';

import { CreationLogger, createStorable } from './UtilityTypes';
import { Todo } from './TodoModel';

describe('Creation Logger Tests', () => {
    it('Can create a Logging Todo Model', () => {
        const LoggingTodo = types.compose(Todo, CreationLogger);
        LoggingTodo.name = 'LoggingTodo';

        const todo1 = LoggingTodo.create({ content: 'Content 1', tags: ['Tag1', 'Tag2']});
        const todo2 = LoggingTodo.create({ content: 'Content 2', tags: ['Tag1', 'Tag3']});
        const todo3 = LoggingTodo.create({ content: 'Content 1', tags: ['Tag2', 'Tag3']});

        expect(todo1).toBeDefined();
        expect(todo2).toBeDefined();
        expect(todo3).toBeDefined();
    });

    it.todo('Can create Logging Posts');

    it.todo('Fails gracefully when combined with invalid types.');
    it.each`
    a    | b    | expected
    ${1} | ${1} | ${2}
    ${1} | ${2} | ${3}
    ${2} | ${1} | ${3}
    `('returns $expected when $a is added $b', ({a, b, expected}) => {
        expect(a + b).toBe(expected);
    });
})
