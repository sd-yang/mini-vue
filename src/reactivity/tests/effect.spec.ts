import { effect, stop } from '../effect';
import { reactive } from './../reactive';
describe('effect', () => {
  it('happy path', () => {
    const count = reactive({ number: 1 });
    let nextData: any;
    effect(() => {
      nextData = count.number + 1;
    });
    expect(nextData).toBe(2);
    count.number++;
    expect(nextData).toBe(3);
  });

  it('effect return runner', () => {
    let foo = 0;
    const runner = effect(() => {
      foo++;
      return 'foo';
    });
    expect(foo).toBe(1);
    const res = runner();
    expect(res).toBe('foo');
    expect(foo).toBe(2);
  });

  it('scheduler', () => {
    // 1. effect 第一次不会执行 schedule，正常执行函数
    // 2. 当调用响应式对象的时候，会调用 schedule，函数不执行
    // 3. 调用 runner 方法，执行里面函数的值
    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    expect(dummy).toBe(1);
    run();
    expect(dummy).toBe(2);
  });

  it('stop', () => {
    let dummy;
    const obj = reactive({ count: 1 });
    const runner = effect(() => {
      dummy = obj.count;
    });
    expect(dummy).toBe(1);
    stop(runner);
    obj.count = 2;
    expect(dummy).toBe(1);
    runner();
    expect(dummy).toBe(2);
  });

  it('onStop', () => {
    const obj = reactive({ foo: 1 });
    const onStop = jest.fn();
    let dummy;
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { onStop }
    );

    stop(runner);
    expect(onStop).toBeCalledTimes(1);
  });
});
