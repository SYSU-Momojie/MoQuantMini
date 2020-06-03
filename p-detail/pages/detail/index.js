const format = require('../../../utils/format.js');
const computedBehavior = require('miniprogram-computed');
const apiBehavior = require('../../../behaviors/api.js');
const indicator = require('../../../utils/indicator.js');

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
    pepb: 0,
    roe: 0,
    dprofitMargin: 0,
    turnoverRate: 0,
    equityMultiplier: 0,
    receiveRisk: 0,
    liquidityRisk: 0,
    intangibleRisk: 0,
    cashDebtRate: 0,
  },

  requestData: function() {
    this.post('getLatestByCode', this.data.tsCode, this.updatePage.bind(this));
  },

  updatePage: function(data) {
    var daily = data.dailyIndicators;
    var quarter = data.quarterIndicators;
    var shareInfo = {
      tsCode: data.tsCode,
      shareName: data.shareName,
      close: indicator.getValueFromMap(daily, 'close'),
      marketValue: indicator.getValueFromMap(daily, 'total_mv'),
      pb: indicator.getValueFromMap(daily, 'pb'),
      revenue: indicator.getValueFromMap(quarter, 'revenue'),
      revenueYoy: indicator.getYoyFromMap(quarter, 'revenue'),
      quarterRevenue: indicator.getValueFromMap(quarter, 'revenue_quarter'),
      quarterRevenueYoy: indicator.getYoyFromMap(quarter, 'revenue_quarter'),
      nprofit: indicator.getValueFromMap(quarter, 'nprofit'),
      nprofitYoy: indicator.getYoyFromMap(quarter, 'nprofit'),
      quarterNprofit: indicator.getValueFromMap(quarter, 'nprofit_quarter'),
      quarterNprofitYoy: indicator.getYoyFromMap(quarter, 'nprofit_quarter'),
      nprofitLtm: indicator.getValueFromMap(quarter, 'nprofit_ltm'),
      dprofit: indicator.getValueFromMap(quarter, 'dprofit'),
      dprofitYoy: indicator.getYoyFromMap(quarter, 'dprofit'),
      quarterDprofit: indicator.getValueFromMap(quarter, 'dprofit_quarter'),
      quarterDprofitYoy: indicator.getYoyFromMap(quarter, 'dprofit_quarter'),
      dprofitLtm: indicator.getValueFromMap(quarter, 'dprofit_ltm'),
      dprofitPe: indicator.getValueFromMap(daily, 'pe'),
      dprofitPeg: indicator.getValueFromMap(daily, 'peg'),
      growScore: indicator.getValueFromMap(daily, 'grow_score'),
      revenuePeriod: '2000Q1',
      nprofitPeriod: '2000Q1',
      dprofitPeriod: '2000Q1',
      valScore: indicator.getValueFromMap(daily, 'val_score'),
      dividendYields: indicator.getValueFromMap(daily, 'dividend_yields'),
      dividendProfitRatio: indicator.getValueFromMap(quarter, 'dividend_ratio'),
      roe: indicator.getValueFromMap(quarter, 'roe'),
      dprofitMargin: indicator.getValueFromMap(quarter, 'dprofit_margin'),
      turnoverRate: indicator.getValueFromMap(quarter, 'turnover_rate'),
      equityMultiplier: indicator.getValueFromMap(quarter, 'equity_multiplier'),
      receiveRisk: indicator.getValueFromMap(quarter, 'receive_risk'),
      liquidityRisk: indicator.getValueFromMap(quarter, 'liquidity_risk'),
      intangibleRisk: indicator.getValueFromMap(quarter, 'intangible_risk'),
      cashDebtRate: indicator.getValueFromMap(quarter, 'cash_debt_rate'),
    };
    this.setData(shareInfo);
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