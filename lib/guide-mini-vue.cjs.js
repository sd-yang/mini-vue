'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var isObject = function (data) {
    return typeof data === 'object' && data !== null;
};

// 创建组件实例
function createComponentInstance(vnode) {
    var component = {
        vnode: vnode,
        type: vnode.type,
        setupState: {}
    };
    return component;
}
// 初始化组件
function setupComponent(instance) {
    // initProps initSlots
    setupStatefulComponent(instance);
}
// 处理调用 setup 之后的返回值
function setupStatefulComponent(instance) {
    var Component = instance.vnode.type;
    instance.proxy = new Proxy({}, {
        get: function (target, key) {
            var setupState = instance.setupState;
            if (key in setupState) {
                return setupState[key];
            }
        }
    });
    var setup = Component.setup;
    if (setup) {
        // 返回存在两种类型 Object Function
        var setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    var Component = instance.type;
    if (Component.render) {
        instance.render = Component.render;
    }
}

function render(vnode, container) {
    patch(vnode, container);
}
// 处理组件
function patch(vnode, container) {
    // 组件类型元素的处理
    if (isObject(vnode.type)) {
        processComponent(vnode, container);
    }
    else if (typeof vnode.type === 'string') {
        processElement(vnode, container);
    }
}
// 处理解析出来的元素类型
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function processComponent(vnode, container) {
    // 挂载组件
    mountComponent(vnode, container);
}
function mountElement(vnode, container) {
    var type = vnode.type, children = vnode.children, props = vnode.props;
    var el = document.createElement(type);
    if (typeof children === 'string') {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        mountChildren(children, el);
    }
    for (var key in props) {
        var val = props[key];
        el.setAttribute(key, val);
    }
    container.append(el);
}
function mountChildren(vnode, container) {
    vnode.children.forEach(function (v) {
        patch(v, container);
    });
}
function mountComponent(vnode, container) {
    // 获取组件实例
    var instance = createComponentInstance(vnode);
    setupComponent(instance);
    // 完成 setup 之后调用 render
    setupRenderEffect(instance, container);
}
function setupRenderEffect(instance, container) {
    var proxy = instance.proxy;
    var subTree = instance.render.call(proxy);
    patch(subTree, container);
}

// 将组件转换成虚拟节点
function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children,
    };
    return vnode;
}

// 接收根组件
function createApp(rootComponent) {
    return {
        mount: function (rootContainer) {
            // component -> VNode 将组件转换为 VNode，后续的一系列操作针对 vnode 来进行
            var vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        },
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
