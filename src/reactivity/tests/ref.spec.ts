import { effect } from '../effect';
import { isRef, proxyRef, ref, unRef } from '../ref';
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
    const obj = { foo: 1 };
    const data = ref(obj);
    expect(data.value.foo).toBe(1);

    let count;
    effect(() => {
      count = data.value.foo;
    });
    expect(count).toBe(1);
    data.value.foo = 2;
    expect(count).toBe(2);
  });

  it('isRef', () => {
    let data = ref(1);
    expect(isRef(data)).toBe(true);
  });

  it('unRef', () => {
    let count = 1;
    let data = ref(count);
    expect(unRef(data)).toEqual(count);
    expect(unRef(1)).toEqual(1);
  });

  it('proxyRef', () => {
    const user = {
      age: ref(10),
      name: 'Hong',
    };

    const proxyUser = proxyRef(user);
    expect(user.age.value).toBe(10);
    expect(proxyUser.age).toBe(10);
    expect(proxyUser.name).toBe('Hong');

    proxyUser.age = 20;
    expect(proxyUser.age).toBe(20);
    expect(user.age.value).toBe(20);

    proxyUser.age = ref(10);
    expect(proxyUser.age).toBe(10);
    expect(user.age.value).toBe(10);
  });
});
