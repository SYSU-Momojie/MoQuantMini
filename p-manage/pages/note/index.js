const computedBehavior = require('miniprogram-computed');
const apiBehavior = require('../../../behaviors/api.js');

Page({
  behaviors: [computedBehavior, apiBehavior],

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    eventBrief: "",
    noetDetail: "",
    noetConclusion: "",
    shareList: []
  },

  onShareChosen: function(e) {
    var tsCode = event.detail.tsCode;
    var shareName = event.detail.shareName;

    var exists = false;
    for (var i in this.data.shareList) {
      var item = this.data.shareList[i];
      if (item.tsCode === tsCode) {
        exists = true;
        break;
      }
    }

    if (!exists) {
      var arr = this.data.shareList;
      arr = [];
      arr.append({tsCode, shareName});
      this.setData({shareList: arr});
    }
  }
})