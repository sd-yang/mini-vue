import { mutableHandlers, readonlyHandles } from './baseHandlers';

export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers);
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandles);
}

function createActiveObject(raw: any, baseHandles) {
  return new Proxy(raw, baseHandles);
}
