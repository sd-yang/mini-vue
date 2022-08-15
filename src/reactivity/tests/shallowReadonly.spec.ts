import { isReadonly, shallowReadonly } from '../reactive';

describe('shallowReadonly', () => {
  test('happy path', () => {
    const data = shallowReadonly({ num: 1, data: { name: '' } });
    expect(isReadonly(data.data)).toBe(false);
    expect(isReadonly(data)).toBe(true);
  });

  it('warn on use set', () => {
    console.warn = jest.fn();
    const user = shallowReadonly({ age: 10, n: { foo: 1 } });
    user.n.foo = 10;
    expect(console.warn).not.toHaveBeenCalled();
  });
});
