import { Fragment, Text } from './vnode';
import { ShapeFlags } from '../shared/ShapeFlags';
import { createComponentInstance, setupComponent } from './component';

export function render(vnode, container) {
  patch(null, vnode, container);
}

// 处理组件
function patch(vnode, container, parentComponent) {
  const { shapeFlag, type } = vnode;
  // 组件类型元素的处理
  switch (type) {
    case Fragment:
      processFragment(vnode, container, parentComponent);
      break;
    case Text:
      processText(vnode, container);
      break;
    default:
      if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container, parentComponent);
      } else if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container, parentComponent);
      }
  }
}

function processText(vnode, container) {
  const { children } = vnode;
  const textNode = (vnode.el = document.createTextNode(children));
  container.append(textNode);
}

function processFragment(vnode: any, container, parentComponent) {
  mountComponent(vnode, container, parentComponent);
}

// 处理解析出来的元素类型
function processElement(vnode, container, parentComponent) {
  mountElement(vnode, container, parentComponent);
}

function processComponent(vnode: any, container: any, parentComponent) {
  // 挂载组件
  mountComponent(vnode, container, parentComponent);
}

function mountElement(vnode: any, container: any, parentComponent) {
  const { type, children, props, shapeFlag } = vnode;
  // 将 根元素 存到虚拟节点上
  const el = (vnode.el = document.createElement(type));

  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el, parentComponent);
  }

  for (const key in props) {
    const val = props[key];
    const isOn = (key: string) => /^on[A-Z]/.test(key);
    if (isOn(key)) {
      const eventKey = key.slice(2).toLowerCase();
      el.addEventListener(eventKey, val);
    } else {
      el.setAttribute(key, val);
    }
  }

  container.append(el);
}

function mountChildren(vnode, container, parentComponent) {
  vnode.children.forEach((v) => {
    patch(v, container, parentComponent);
  });
}

function mountComponent(initialVNode: any, container, parentComponent) {
  // 获取组件实例
  const instance = createComponentInstance(initialVNode, parentComponent);
  setupComponent(instance);
  // 完成 setup 之后调用 render
  setupRenderEffect(instance, initialVNode, container);
}

function setupRenderEffect(instance: any, initialVNode, container) {
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);
  patch(subTree, container, instance);

  initialVNode.el = subTree.el;
}
