import { isReadonly, shallowReadonly } from "../reactive"

describe('shallowReadonly', () => {
  test('happy path', () => {
    const data = shallowReadonly({ num: 1, data: { name: '' }});
    expect(isReadonly(data.data)).toBe(false);
    expect(isReadonly(data)).toBe(true);
  })
})