import { shallowReadonly } from '../reactivity/reactive';
import { emit } from './componentEmit';
import { initProps } from './componentProps';
import { PublicInstanceProxyHandles } from './componentPublicInstance';
import { initSlots } from './componentSlots';

// 创建组件实例
export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    slots: {},
    emit: () => {},
  };

  component.emit = emit.bind(null, component) as any;

  return component;
}

// 初始化组件
export function setupComponent(instance) {
  // initProps initSlots
  // 处理接收 props
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);
  setupStatefulComponent(instance);
}

// 处理调用 setup 之后的返回值
function setupStatefulComponent(instance: any) {
  const Component = instance.vnode.type;

  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandles);

  const { setup } = Component;

  if (setup) {
    // 返回存在两种类型 Object Function
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    });
    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance, setupResult: any) {
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult;
  }

  finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
  const Component = instance.type;
  if (Component.render) {
    instance.render = Component.render;
  }
}
