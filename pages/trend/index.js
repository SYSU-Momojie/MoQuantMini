// pages/trend/index.js

import * as echarts from '../../components/ec-canvas/echarts';
const api = require('../../utils/api.js');
const format = require('../../utils/format.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tsCode: '000000.SZ',
    shareName: 'MQ基金',
    trendType: 'PB',
    showQuarter: false,
    trendQuarter: 'QUARTER',
    ec: {
      lazyLoad: true
    },
    chartInit: false,
    chartDisposed: false,
    cacheData: {},
    trendPeriod: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.resetData(options.tsCode, options.t)
    this.initChart();
    console.log(this.data);
    setTimeout(this.requestData.bind(this), 1000);
  },

  resetData: function(tsCode, trendType) {
    this.setData({
      tsCode: tsCode,
      trendType: trendType,
      showQuarter: this.needQuartOrYear(trendType),
      cacheData: {
        'PE': { x: [], vl1: [], vl2: [], c: false },
        'PB': { x: [], vl1: [], vl2: [], c: false },
        'REVENUE_YEAR': { x: [], vl1: [], vl2: [], c: false },
        'REVENUE_QUARTER': { x: [], vl1: [], vl2: [], c: false },
        'NPROFIT_YEAR': { x: [], vl1: [], vl2: [], c: false },
        'NPROFIT_QUARTER': { x: [], vl1: [], vl2: [], c: false },
        'DPROFIT_YEAR': { x: [], vl1: [], vl2: [], c: false },
        'DPROFIT_QUARTER': { x: [], vl1: [], vl2: [], c: false },
      },
    });
  },

  onTrendQuarterChange: function(event) {
    this.setData({
      trendQuarter: event.detail.name,
    });
    this.requestData();
  },

  onTrendTypeChange: function(event) {
    console.log(event);
    this.setData({
      trendType: event.detail.name,
      showQuarter: this.needQuartOrYear(event.detail.name),
    });
    this.requestData();
  },

  onTrendPeriodChange: function(event) {
    this.setData({
      trendPeriod: parseInt(event.detail.name),
    });
    this.requestData();
  },

  needQuartOrYear: function (trendTab) {
    if (trendTab === null || trendTab === undefined) {
      trendTab = this.data.trendType;
    }
    console.log(trendTab);
    if (trendTab === 'REVENUE' || trendTab === 'NPROFIT' || trendTab === 'DPROFIT') {
      return true;
    }
    return false;
  },

  initChart: function() {
    if (this.data.chartInit) {
      this.requestData();
      return ;
    }

    var chartComponent = this.selectComponent('#mychart-dom-bar');
    chartComponent.init(this.initCallback.bind(this));
  },

  initCallback: function(canvas, width, height) {
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
    return chart;
  },

  requestData: function() {
    if (!this.data.chartInit) {
      console.log("not ready");
      return ;
    }

    if (this.data.cacheData[this.getRequestTrend()].c === true) {
      this.updateChart(this.data.cacheData[this.getRequestTrend()]);
    } else {
      var param = {
        tsCode: this.data.tsCode,
        trendType: this.getRequestTrend(),
      };
      
      api.post('getTrendByCode', param, this.updateAfterRequest.bind(this));
    }
  },

  getRequestTrend: function() {
    return this.data.trendType + (this.needQuartOrYear() ? '_' + this.data.trendQuarter : '');
  },

  updateAfterRequest: function(resp) {
    if (resp.errMsg === 'request:ok' && resp.data instanceof Object) {
      console.log(resp.data);
      var data = resp.data;
      if (data.x.length === 0) {
        //
        return ;
      }
      data.c = true;
      var cacheData = this.data.cacheData;
      cacheData[this.getRequestTrend()] = data;
      this.setData({
        cacheData
      });
      this.updateChart(this.data.cacheData[this.getRequestTrend()]);
    } else {
      // TODO err hint
    }
  },

  updateChart: function(data) {
      console.log(data);
      var options = this.getChartOption(data);
      console.log(options);
      this.chart.setOption(options);
  },

  getChartOption: function(data) {
    var s = this.startIndex(data.x);
    var yList = [];
    var series = [];
    var showX = false;
    if (this.data.trendType === 'PB' || this.data.trendType === 'PE') {
      yList = [
        {
          name: this.data.trendType,
          position: 'left',
          axisLabel: {
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
          yAxis: 0,
          data: format.truncArr(data.vl1.slice(s))
        },
        {
          type: 'line',
          data: []
        }
      ];
    } else if (this.needQuartOrYear()) {
      yList = [
        {
          name: this.convertTrendTypeToLabel(this.data.trendType),
          position: 'left',
          axisLabel: {
            formatter: function(value, index) {
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
          data: data.vl1.slice(s)
        },
        {
          name: '增速',
          type: 'line',
          yAxisIndex: 1,
          data: data.vl2.slice(s)
        },
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
        data: data.x.slice(s)
      },
      yAxis: yList,
      series: series
    };
  },

  formatTooltip: function (paramList) {
    var text = '';
    if (paramList.length > 0) {
      text += `${paramList[0].axisValueLabel}\n`;
    }
    for (var i = 0; i < paramList.length; i++) {
      var param = paramList[i];
      var value = param.value;
      var vstr;
      if (this.needQuartOrYear()) {
        vstr = i === 0 ? format.unit(value) : format.percent(value);
      } else {
        vstr = value.toString();
      }
      text += `${param.seriesName}: ${vstr}\n`;
    }
    return text;
  },

  convertTrendTypeToLabel: function(trendType) {
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
    }
    return '错啦';
  },

  startIndex: function(x) {
    if (this.data.trendPeriod === 0) {
      return 0;
    }
    var dStr = x[x.length - 1];
    var year = parseInt(dStr.substr(0, 4)) - this.data.trendPeriod;
    var targetX = year + dStr.substr(4);
    for (var i = 0 ; i < x.length ; i++) {
      if (x[i] >= targetX) {
        return i;
      }
    }
    return x.length;
  },

  onShareChosen: function(event) {
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

  dispose: function() {
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