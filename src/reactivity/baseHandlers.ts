import { track, trigger } from './effect';
import { ReactiveFlags } from './reactive';

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);

function createGetter(readonly = false) {
  return function (target, key) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !readonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return readonly;
    }
    const res = Reflect.get(target, key);
    if (!readonly) {
      track(target, key);
    }
    return res;
  };
}

function createSetter() {
  return function (target, key, value) {
    const res = Reflect.set(target, key, value);
    trigger(target, key);
    return res;
  };
}

export const mutableHandlers = {
  get,
  set,
};

export const readonlyHandles = {
  get: readonlyGet,
  set: function (target) {
    console.warn(`${target} is readonly, can not change!`);
    return true;
  },
};
