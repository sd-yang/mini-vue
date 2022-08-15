import { extend } from './../shared/index';

let activeEffect;
let shouldTrack;
const targetMap = new Map();

class ReactiveEffect {
  private _fn: any;
  deps = new Set();
  active = true;
  onStop?: () => void;
  constructor(fn, public scheduler?) {
    this._fn = fn;
  }

  run() {
    // 将实例给到 activeEffect，用来进行依赖收集
    if (!this.active) {
      // 在 stop 调用之后，直接调用 runner 的话，会直接执行 fn
      return this._fn();
    }
    activeEffect = this;
    shouldTrack = true; // 在正常情况 active 下，每次都可以执行依赖收集
    const results = this._fn(); // 正常情况下，fn 执行，读取到 reactive 的值会触发 track，此时 shouldTrack 为 true，可以 get set
    shouldTrack = false; // 进行关闭，之后如果 stop 执行，将不进行依赖收集了。此时，reactive 的 get set 就不会触发收集和执行 run 了
    return results;
  }

  stop() {
    // 调用 stop 的时候，将之前存储的 dep 删除
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
  effect.deps.clear();
}

export const track = (target, key) => {
  if (!isTracking()) return;

  // target -> key -> dep
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }

  trackEffects(dep);
};

export function trackEffects(dep) {
  if (dep.has(activeEffect)) return;
  dep.add(activeEffect);
  activeEffect.deps.add(dep);
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}

// 依赖改变的时候，要自动进行更新
export const trigger = (target, key) => {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const deps = depsMap.get(key);
  triggerEffects(deps);
};

export const triggerEffects = (deps) => {
  for (const effect of deps) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
};

export const effect = (fn, options: any = {}) => {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  extend(_effect, options);
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
};

export const stop = (runner) => {
  runner.effect.stop();
};
