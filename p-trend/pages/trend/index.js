// pages/trend/index.js

import * as echarts from '../../components/ec-canvas/echarts';
const api = require('../../../behaviors/api.js');
const computedBehavior = require('miniprogram-computed');
const format = require('../../../utils/format.js');

const trendConst = {
  'PB': {
    'cat1': 'PBPE',
    'periodList': []
  },
  'PE': {
    'cat1': 'PBPE',
    'periodList': []
  },
  'REVENUE': {
    'cat1': 'GROWTH',
    'periodList': ['REPORT', 'QUARTER', 'LTM']
  },
  'NPROFIT': {
    'cat1': 'GROWTH',
    'periodList': ['REPORT', 'QUARTER', 'LTM']
  },
  'DPROFIT': {
    'cat1': 'GROWTH',
    'periodList': ['REPORT', 'QUARTER', 'LTM']
  },
  'DIVIDEND_YIELDS': {
    'cat1': 'DIVIDEND',
    'periodList': []
  },
  'DIVIDEND_RATIO': {
    'cat1': 'DIVIDEND',
    'periodList': []
  },
  'ROE': {
    'cat1': 'DUPONT',
    'periodList': []
  },
  'DPROFIT_MARGIN': {
    'cat1': 'DUPONT',
    'periodList': []
  },
  'TURNOVER_RATE': {
    'cat1': 'DUPONT',
    'periodList': []
  },
  'EQUITY_MULTIPLIER': {
    'cat1': 'DUPONT',
    'periodList': []
  },
};

Page({
  behaviors: [computedBehavior, api],

  /**
   * 页面的初始数据
   */
  data: {
    tsCode: '000000.SZ',
    shareName: 'MQ基金',
    trendCategory: 'PBPE',
    trendType: 'PB',
    lastTrendType: {
      'PBPE': 'PB',
      'GROWTH': 'REVENUE',
      'DIVIDEND': 'DIVIDEND_YIELDS',
      'DUPONT': 'ROE',
    },
    showQuarter: false,
    trendPeriod: 'QUARTER',
    ec: {
      lazyLoad: true
    },
    chartInit: false,
    chartDisposed: false,
    cacheData: {},
    trendYear: 1,
    trendYearStr: '1'
  },

  computed: {
    showPeriodOptions: function(data) {
      var trend = trendConst[data.trendType];
      if (trend === null || trend === undefined) {
        return false;
      }
      return trend.periodList.length > 0;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.resetData(options.tsCode, options.t)
    this.initChart();
  },

  resetData: function (tsCode, trendType) {
    var trend = trendConst[trendType];
    var lastTrendType = this.data.lastTrendType;
    lastTrendType[trend.cat1] = trendType;
    this.setData({
      tsCode: tsCode,
      trendCategory: trend.cat1,
      trendType: trendType
    });
  },

  onTrendPeriodChange: function (event) {
    this.setData({
      trendPeriod: event.detail.name
    });
    if (this.data.chartInit) {
      this.requestData();
    }
  },

  onTrendCategoryChange: function (event) {
    var cat = event.detail.name;
    var trendType = this.data.lastTrendType[cat];
    var trend = trendConst[trendType];
    var trendPeriod = '';
    for (var i = 0 ; i < trend.periodList.length ; i++) {
      if (i === 0 || trend.periodList[i] === this.data.trendPeriod) {
        trendPeriod = trend.periodList[i];
      }
    }
    
    this.setData({
      trendCategory: trend.cat1,
      trendType: trendType,
      showQuarter: trend.isQuarter,
      trendPeriod: trendPeriod
    });
    if (this.data.chartInit) {
      this.requestData();
    }
  },

  onTrendTypeChange: function (event) {
    console.log(event);
    var trendType = event.detail.name;
    var trend = trendConst[trendType];
    var lastTrendType = this.data.lastTrendType;
    lastTrendType[trend.cat1] = trendType;
    this.setData({
      trendType: trendType,
      showQuarter: trend.isQuarter,
      lastTrendType: lastTrendType
    });
    if (this.data.chartInit) {
      this.requestData();
    }
  },

  onTrendYearChange: function (event) {
    this.setData({
      trendYearStr: event.detail.name,
      trendYear: parseInt(event.detail.name),
    });
    if (this.data.chartInit) {
      this.requestData();
    }
  },

  initChart: function () {
    if (this.data.chartInit) {
      this.requestData();
      return;
    }

    var chartComponent = this.selectComponent('#mychart-dom-bar');
    chartComponent.init(this.initCallback.bind(this));
  },

  initCallback: function (canvas, width, height) {
    // 获取组件的 canvas、width、height 后的回调函数
    // 在这里初始化图表
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height
    });

    // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
    this.chart = chart;

    this.setData({
      chartInit: true,
      chartDisposed: false
    });

    // 注意这里一定要返回 chart 实例，否则会影响事件处理等
    console.log('Chart Init');
    setTimeout(this.requestData.bind(this), 1000);
    return chart;
  },

  requestData: function () {
    if (!this.data.chartInit) {
      console.log("not ready");
      return;
    }

    var name = this.getIndicatorName();
    var cacheData = this.data.cacheData[name];
    if (cacheData !== null && cacheData !== undefined && cacheData.c === true) {
      this.updateChart(cacheData);
    } else {
      
      var param = {
        tsCode: this.data.tsCode,
        indicatorName: name.toLowerCase()
      };

      this.post('getTrendByCode', param, this.updateAfterRequest.bind(this));
    }
  },

  getIndicatorName: function () {
    var indicatorName = this.data.trendType;
    if (this.data.trendPeriod !== '' && this.data.trendPeriod !== 'REPORT') {
      indicatorName = indicatorName + '_' + this.data.trendPeriod
    }
    return indicatorName;
  },

  updateAfterRequest: function (data) {
    if (data.x.length === 0) {
      //
      return;
    }
    data.c = true;
    var cacheData = this.data.cacheData;
    var name = this.getIndicatorName();
    cacheData[name] = data;
    this.setData({
      cacheData
    });
    this.updateChart(this.data.cacheData[name]);
  },

  updateChart: function (data) {
    console.log(data);
    var options = this.getChartOption(data);
    console.log(options);
    this.chart.setOption(options);
  },

  getChartOption: function (listToShow) {
    var s = this.startIndex(listToShow.x);
    var yList = [];
    var series = [];
    var showX = false;
    var trend = trendConst[this.data.trendType]
    if (trend.cat1 === 'PBPE') {
      yList = [
        {
          name: this.data.trendType,
          position: 'left',
          axisLabel: {
            formatter: function (value, index) {
              return format.unit(value);
            },
            fontSize: 10,
          }
        },
        {
          show: false
        }
      ];
      series = [
        {
          name: this.data.trendType,
          type: 'line',
          itemStyle: {
            opacity: 0
          },
          yAxis: 0,
          data: format.truncArr(listToShow.vl1.slice(s))
        },
        {
          name: '',
          yAxisIndex: 1,
          type: 'line',
          data: [],
          showSymbol: false
        }
      ];
    } else if (trend.cat1 === 'GROWTH') {
      yList = [
        {
          name: this.convertTrendTypeToLabel(this.data.trendType),
          position: 'left',
          axisLabel: {
            formatter: function (value, index) {
              return format.unit(value);
            },
            fontSize: 10,
          }
        },
        {
          name: '增速',
          position: 'right',
          axisLabel: {
            formatter: function (value, index) {
              return format.percent(value);
            },
            fontSize: 10,
          },
          show: true
        }
      ];
      series = [
        {
          name: this.convertTrendTypeToLabel(this.data.trendType),
          type: 'bar',
          yAxisIndex: 0,
          data: listToShow.vl1.slice(s)
        },
        {
          name: '增速',
          type: 'line',
          itemStyle: {
            opacity: 0
          },
          yAxisIndex: 1,
          data: listToShow.vl2.slice(s)
        },
      ];
    } else if (trend.cat1 === 'DIVIDEND' || trend.cat1 === 'DUPONT') {
      yList = [
        {
          name: this.convertTrendTypeToLabel(this.data.trendType),
          position: 'left',
          axisLabel: {
            formatter: function (value, index) {
              return format.percent(value);
            },
            fontSize: 10,
          }
        },
        {
          show: false
        }
      ];
      series = [
        {
          name: this.convertTrendTypeToLabel(this.data.trendType),
          type: 'line',
          yAxisIndex: 0,
          data: listToShow.vl1.slice(s),
          itemStyle: {
            opacity: 0
          },
        },
        {
          name: '',
          yAxisIndex: 1,
          type: 'line',
          data: []
        }
      ];
    }
    return {
      title: {
        show: false
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        renderMode: 'richText',
        axisPointer: {
          type: 'cross',
          label: {
            show: false,
          }
        },
        precision: 2,
        formatter: this.formatTooltip.bind(this),
      },
      legend: {
      },
      xAxis: {
        type: 'category',
        data: listToShow.x.slice(s)
      },
      yAxis: yList,
      series: series
    };
  },

  formatTooltip: function (paramList) {
    var trend = trendConst[this.data.trendType]
    var text = '';
    if (paramList.length > 0) {
      text += `${paramList[0].axisValueLabel}\n`;
    }
    for (var i = 0; i < paramList.length; i++) {
      var param = paramList[i];
      var value = param.value;
      var vstr;
      if (trend.cat1 === 'GROWTH') {
        vstr = i === 0 ? format.unit(value) : format.percent(value);
      } else if (trend.cat1 === 'PBPE') {
        vstr = value.toString();
      } else if (trend.cat1 === 'DIVIDEND' || trend.cat1 === 'DUPONT') {
        vstr = format.percent(value);
      }
      text += `${param.seriesName}: ${vstr}\n`;
    }
    return text;
  },

  convertTrendTypeToLabel: function (trendType) {
    if (trendType === 'PE') {
      return 'PE';
    } else if (trendType === 'PB') {
      return 'PB';
    } else if (trendType === 'REVENUE') {
      return '营业收入';
    } else if (trendType === 'NPROFIT') {
      return '归母净利';
    } else if (trendType === 'DPROFIT') {
      return '扣非净利';
    } else if (trendType === 'DIVIDEND_YIELDS') {
      return '股息率';
    } else if (trendType === 'DIVIDEND_RATIO') {
      return '分红率';
    } else if (trendType === 'ROE') {
      return 'ROE';
    } else if (trendType === 'DPROFIT_MARGIN') {
      return '净利率';
    } else if (trendType === 'TURNOVER_RATE') {
      return '周转率';
    } else if (trendType === 'EQUITY_MULTIPLIER') {
      return '权益乘数';
    }
    return '错啦';
  },

  startIndex: function (x) {
    if (this.data.trendYear === 0) {
      return 0;
    }
    var dStr = x[x.length - 1];
    var year = parseInt(dStr.substr(0, 4)) - this.data.trendYear;
    var targetX = year + dStr.substr(4);
    for (var i = 0; i < x.length; i++) {
      if (x[i] >= targetX) {
        return i;
      }
    }
    return x.length;
  },

  onShareChosen: function (event) {
    var tsCode = event.detail.tsCode;
    if (tsCode !== this.data.tsCode) {
      this.resetData(tsCode, this.data.trendType);
      this.requestData();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  dispose: function () {
    console.log("dispose");
    if (this.chartDisposed) {
      return;
    }
    if (this.chart) {
      this.chart.dispose();
    }
    this.setData({
      chartInit: false,
      chartDisposed: true
    });
  }
})