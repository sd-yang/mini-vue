import { hasChanged, isObject } from './../shared/index';
import { trackEffects, isTracking, triggerEffects } from './effect';
import { reactive } from './reactive';

class RefImpl {
  private _value: any;
  private _originValue: any;
  public dep;
  public __is_Ref;
  constructor(value) {
    this._originValue = value;
    this._value = convert(value);
    this.dep = new Set();
    this.__is_Ref = true;
  }

  // 同样在 get 的时候，要收集依赖
  get value() {
    // 当触发 effect 的情况下才进行依赖收集
    trackRefValue(this);
    return this._value;
  }

  // 在 set 的时候，要触发依赖
  set value(newValue) {
    if (hasChanged(this._originValue, newValue)) {
      this._value = convert(newValue);
      this._originValue = newValue;
      triggerEffects(this.dep);
    }
  }
}

// 转换 object 为 reactive 对象
function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

function trackRefValue(ref) {
  if (isTracking()) {
    trackEffects(ref.dep);
  }
}

export function ref(value) {
  return new RefImpl(value);
}

export function isRef(value) {
  return !!value.__is_Ref;
}

export function unRef(raw) {
  return isRef(raw) ? raw.value : raw;
}

export function proxyRef(raw) {
  return new Proxy(raw, {
    get: function (target, key) {
      return unRef(Reflect.get(target, key));
    },
    set: function (target, key, value) {
      if (isRef(target[key]) && !isRef(value)) {
        return (target[key].value = value);
      }
      return Reflect.set(target, key, value);
    },
  });
}
