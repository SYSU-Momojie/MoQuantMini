// pages/share-detail/index.js
const api = require('../../../utils/api.js')

Page({

  onLoad: function(option) {
    if (option.tsCode === this.data.tsCode) {
      return;
    }
    this.setData({
      'tsCode': option.tsCode
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
    seasonRevenue: 0,
    seasonRevenueYoy: 0,
    seasonNprofit: 0,
    seasonNprofitYoy: 0,
    nprofitLtm: 0,
    nprofitPe: 0,
    nprofitPeg: 0,
    seasonDprofit: 0,
    seasonDprofitYoy: 0,
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
  }

})