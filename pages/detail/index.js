// pages/share-detail/index.js
const api = require('../../utils/api.js')

Page({

  onLoad: function (options) {
    if (options.tsCode === this.data.tsCode) {
      return;
    }
    this.setData({
      tsCode: options.tsCode
    });
    this.requestData();
  },

  /**
   * 组件的属性列表
   */
  data: {
    tsCode: '000000.SZ',
    shareName: 'MQ基金',
    close: 1,
    marketValue: 0,
    pb: 1,
    revenue: 0,
    revenueYoy: 0,
    quarterRevenue: 0,
    quarterRevenueYoy: 0,
    nprofit: 0,
    nprofitYoy: 0,
    quarterNprofit: 0,
    quarterNprofitYoy: 0,
    nprofitLtm: 0,
    dprofit: 0,
    dprofitYoy: 0,
    quarterDprofit: 0,
    quarterDprofitYoy: 0,
    dprofitLtm: 0,
    dprofitPe: 0,
    dprofitPeg: 0
  },

  requestData: function() {
    api.post('getLatestByCode', this.data.tsCode, this.updatePage.bind(this));
  },

  updatePage: function(resp) {
    console.log(resp);
    if (resp.errMsg === 'request:ok' && resp.data instanceof Object) {
      this.setData(resp.data);
    } else {
      // TODO err hint
    }
  },

  goToTrend: function(event) {
    var t = event.currentTarget.dataset.t;
    console.log('Going to trend page ' + t);
    wx.navigateTo({
      url: `/pages/trend/index?tsCode=${this.data.tsCode}&t=${t}`
    })
  },

  onShareChosen: function(event) {
    var tsCode = event.detail.tsCode;
    if (tsCode !== this.data.tsCode) {
      this.setData({
        tsCode: tsCode
      });
      this.requestData();
    }
  }

})