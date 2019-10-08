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
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange: function(event) {
      this.setData({hintList: [{tsCode: '000001.SZ', shareName: '平安银行'}, 
        { tsCode: '000002.SZ', shareName: '万科A'}]})
    },
    onBlur: function(event) {
      this.clearHint();
      //setTimeout(this.clearHint.bind(this), 50);
    },
    clearHint: function() {
      this.setData({ hintList: [] });
    },
    handleTap: function (event) {
      this.triggerEvent('chooseShare', { tsCode: event.currentTarget.dataset.id});
    }
  }
})
