// pages/share-detail/index.js
Page({

  onLoad: function (option) {
    console.log(option)
    console.log(this.data);
  },

  /**
   * 组件的属性列表
   */
  data: {
    tsCode: '000001.SZ',
    shareName: '平安银行',
    close: 15.59
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})