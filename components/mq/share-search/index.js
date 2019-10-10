// components/mq/share-search/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hintList: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange: function(event) {
      // console.log(event);
      this.setData({hintList: [{tsCode: event.detail, shareName: '未知'}]})
    },
    onBlur: function(event) {
      // this.clearHint();
      setTimeout(this.clearHint.bind(this), 100);
    },
    clearHint: function() {
      this.setData({ hintList: [] });
    },
    handleTap: function (event) {
      console.log(event);
      this.triggerEvent('chooseShare', { tsCode: event.currentTarget.dataset.id});
    }
  }
})
