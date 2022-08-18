import { h } from '../../lib/guide-mini-vue.esm.js';

export const App = {
  setup() {
    return {
      msg: 'mini-vue',
    };
  },

  render() {
    return h('div', { class: 'red' }, 'hi, vue' + this.msg);
  },
};
