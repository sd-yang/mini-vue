import { reactive } from '../reactive';

describe('reactive', () => {
  it('happy path', () => {
    const obj = { count: 1 };
    const data = reactive(obj);

    expect(data).not.toBe(obj);
    expect(data.count).toBe(1);
    data.count++;
    expect(data.count).toBe(2);
  });
});
