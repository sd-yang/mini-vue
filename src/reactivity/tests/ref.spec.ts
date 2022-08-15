import { effect } from '../effect';
import { ref } from '../ref';
describe('ref', () => {
  it('happy path', () => {
    let data = ref(1);
    expect(data.value).toBe(1);
    let count = 0;
    let sum;
    effect(() => {
      count++;
      sum = data.value + 1;
    });

    expect(count).toBe(1);
    expect(sum).toBe(2);
    data.value++;
    expect(count).toBe(2);
    expect(sum).toBe(3);

    // 当值不改变的时候，不会进行更改
    data.value = 2;
    expect(count).toBe(2);
    expect(sum).toBe(3);
  });

  it('object can use ref', () => {
    const obj = { foo : 1 };
    const data = ref(obj);
    expect(data.value.foo).toBe(1);

    let count;
    effect(() => {
      count = data.value.foo;
    });
    expect(count).toBe(1);
    data.value.foo = 2;
    expect(count).toBe(2);
  })
});
