import { isReactive, reactive } from '../reactive';

describe('reactive', () => {
  it('happy path', () => {
    const obj = { count: 1, data: { list: [1, 2, 3] } };
    const data = reactive(obj);

    expect(data).not.toBe(obj);
    expect(data.count).toBe(1);
    data.count++;
    expect(data.count).toBe(2);
    expect(isReactive(data)).toBe(true);
    expect(isReactive(obj)).toBe(false);
    // 嵌套对象
    expect(isReactive(data.data)).toBe(true);
    expect(isReactive(data.data.list)).toBe(true);
  });
});
