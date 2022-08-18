import { render } from './renderer';
import { createVNode } from './vnode';

// 接收根组件
export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      // component -> VNode 将组件转换为 VNode，后续的一系列操作针对 vnode 来进行
      const vnode = createVNode(rootComponent);
      render(vnode, rootContainer);
    },
  };
}
