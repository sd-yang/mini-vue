import { extend } from './../shared/index';
class ReactiveEffect {
  private _fn: any;
  deps = [];
  active = true;
  onStop?: () => void;
  // 通过声明 public 可以被外部调用
  constructor(fn, public scheduler?) {
    this._fn = fn;
  }

  run() {
    // 将实例给到 activeEffect，用来进行依赖收集
    activeEffect = this;
    return this._fn();
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
}

// get 拦截的时候进行依赖收集，根据 target 使用 Map 进行收集
const targetMap = new Map();
export const track = (target, key) => {
  // target -> key -> dep
  // 从收集到的容器中，根据 key 获取具体的值
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map(); // 创建一个 Map 去存储对象的 key 值
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  if (!activeEffect) return;
  
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
};

// 依赖改变的时候，要自动进行更新
export const trigger = (target, key) => {
  const depsMap = targetMap.get(target);
  const deps = depsMap.get(key);
  for (const effect of deps) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
};

let activeEffect;
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
