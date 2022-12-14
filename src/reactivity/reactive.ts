import { isObject } from './../shared/index';
import { mutableHandlers, readonlyHandles, shallowReadonlyHandles } from './baseHandlers';

export enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
}

export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers);
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandles);
}

export function shallowReadonly(raw) {
  return createActiveObject(raw, shallowReadonlyHandles);
}

export function isProxy(raw) {
  return isReactive(raw) || isReadonly(raw);
}

export function isReactive(raw) {
  return !!raw[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(raw) {
  return !!raw[ReactiveFlags.IS_READONLY];
}

function createActiveObject(raw: any, baseHandles) {
  if (!isObject(raw)) {
    console.warn(`target ${raw} 必须是一个对象!`);
    return raw;
  }
  return new Proxy(raw, baseHandles);
}
