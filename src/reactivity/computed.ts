import { ReactiveEffect } from './effect';

class ComputedRefImpl {
  private _getter: any;
  private _dirty: any = true;
  private _value: any;
  constructor(getter) {
    this._getter = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
      }
    });
    this._value = null;
  }

  get value() {
    if (this._dirty) {
      // 执行 run 方法，会运行 computed 的方法，从而触发 get 的 track 和 set 的 trigger
      this._value = this._getter.run();
      this._dirty = false;
    }
    return this._value;
  }
}

export function computed(getter) {
  return new ComputedRefImpl(getter);
}
