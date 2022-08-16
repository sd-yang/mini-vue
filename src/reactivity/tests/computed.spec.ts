import { computed } from '../computed';
import { reactive } from '../reactive';

describe('computed', () => {
  it('happy path', () => {
    const data = reactive({
      count: 1,
    });
    const fn = jest.fn(() => {
      let res = data.count + 1;
      return res;
    });
    const sum = computed(fn);

    expect(fn).not.toHaveBeenCalled();
    expect(sum.value).toBe(2);
    expect(fn).toBeCalledTimes(1);

    // 再次获取的时候，会直接读取缓存的值
    sum.value;
    expect(fn).toBeCalledTimes(1);

    data.count++;
    expect(sum.value).toBe(3);
  });
});
