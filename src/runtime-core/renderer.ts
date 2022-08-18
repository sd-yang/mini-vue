import { isObject } from './../shared/index';
import { createComponentInstance, setupComponent } from './component';

export function render(vnode, container) {
  patch(vnode, container);
}

// 处理组件
function patch(vnode, container) {
  // 组件类型元素的处理
  if (isObject(vnode.type)) {
    processComponent(vnode, container);
  } else if (typeof vnode.type === 'string') {
    processElement(vnode, container);
  }
}

// 处理解析出来的元素类型
function processElement(vnode, container) {
  mountElement(vnode, container);
}

function processComponent(vnode: any, container: any) {
  // 挂载组件
  mountComponent(vnode, container);
}

function mountElement(vnode: any, container: any) {
  const { type, children, props } = vnode;
  // 将 根元素 存到虚拟节点上
  const el = (vnode.el = document.createElement(type));

  if (typeof children === 'string') {
    el.textContent = children;
  } else if (Array.isArray(children)) {
    mountChildren(children, el);
  }

  for (const key in props) {
    const val = props[key];
    el.setAttribute(key, val);
  }

  container.append(el);
}

function mountChildren(vnode, container) {
  vnode.children.forEach((v) => {
    patch(v, container);
  });
}

function mountComponent(initialVNode: any, container) {
  // 获取组件实例
  const instance = createComponentInstance(initialVNode);
  setupComponent(instance);
  // 完成 setup 之后调用 render
  setupRenderEffect(instance, initialVNode, container);
}

function setupRenderEffect(instance: any, initialVNode, container) {
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);
  patch(subTree, container);

  initialVNode.el = subTree.el;
}
