const format = require('../../../utils/format.js');
const computedBehavior = require('miniprogram-computed');
const apiBehavior = require('../../../behaviors/api.js');

Page({
  behaviors: [computedBehavior, apiBehavior],

  onLoad: function (options) {
    var sameCode = (options.tsCode === this.data.tsCode);
    if (options.indicateType == undefined) {
      options.indicateType = 'grow';
    }
    this.setData({
      tsCode: options.tsCode,
      indicateType: options.indicateType
    });
    if (!sameCode) {
      this.requestData();
    }
  },

  /**
   * 组件的属性列表
   */
  data: {
    checkChosenItem: "",
    indicateType: 'grow',
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
    dprofitPeg: 0,
    growScore: 0,
    revenuePeriod: '2000Q1',
    nprofitPeriod: '2000Q1',
    dprofitPeriod: '2000Q1',
    valScore: 0,
    dividendYields: 0,
    dividendProfitRatio: 0,
    receiveRisk: 0,
    liquidityRisk: 0,
    intangibleRisk: 0,
  },

  requestData: function() {
    this.post('getLatestByCode', this.data.tsCode, this.updatePage.bind(this));
  },

  updatePage: function(data) {
    this.setData(data);
  },

  goToTrend: function(event) {
    var t = event.currentTarget.dataset.t;
    var url = `/p-trend/pages/trend/index?tsCode=${this.data.tsCode}&t=${t}`;
    console.log('Going to trend page ' + url);
    wx.navigateTo({
      url
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
  },

  onIndicateTypeChange: function(event) {
    this.setData({
      indicateType: event.detail.name,
    });
  },

  computed: {
    growTabLabel: function(data) {
      return `成长 ${format.trunc(data.growScore)}`;
    },
    valTabLabel: function(data) {
      return `价值 ${format.trunc(data.valScore)}`;
    }
  },

  onCheckChosenItemChanged: function(e) {
    this.setData({
      checkChosenItem: e.detail
    });
  },

  toShowForecastDetail: function(e) {
    this.setData({
      showForecastDetail: true
    });
  },

  toHideForecastDetail: function(e) {
    this.setData({
      showForecastDetail: false
    });
  },

})