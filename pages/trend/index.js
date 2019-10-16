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
    trendType: 'pb',
    ec: {
      lazyLoad: true
    },
    chartInit: false,
    chartDisposed: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.tsCode === this.data.tsCode && options.t === this.data.t) {
      return;
    }
    this.setData({
      tsCode: options.tsCode,
      trendType: options.t
    });
    this.initChart();
    setTimeout(this.requestData.bind(this), 200);
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
    var param = {
      tsCode: this.data.tsCode,
      trendType: this.data.trendType
    };
    var resp = {
      errMsg: 'request:ok',
      data: {
        x: ['01', '02', '03', '01', '02', '03', '01', '02', '03'],
        vl1: [0.123, 0.223, 0.3, 0.1, 0.2, 0.3, 0.1, 0.2, 0.3],
        vl2: [0.223, 0.33, 0.4, 0.2, 0.3, 0.4, 0.2, 0.1, 0.2]
      }
    };
    // this.updateChart(resp);
    api.post('getTrendByCode', param, this.updateChart.bind(this));    
  },

  updateChart: function(resp) {
    if (resp.errMsg === 'request:ok' && resp.data instanceof Object) {
      console.log(resp.data);
      var options = this.getChartOption(resp.data);
      console.log(options);
      this.chart.setOption(options);
    } else {
      // TODO err hint
    }
  },

  getChartOption: function(data) {
    var yList = [];
    var series = [];
    var showX = false;
    if (this.data.trendType === 'PB') {
      yList = [
        {
          name: 'PB',
          position: 'left'
        }
      ];
      series = [
        {
          name: 'PB',
          type: 'line',
          yAxis: 0,
          data: format.truncArr(data.vl1)
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
        formatter: function (paramList) {
          console.log(paramList);
          var text = '';
          if (paramList.length > 0) {
            text += `${paramList[0].axisValueLabel}\n`;
          }
          for (var i = 0 ; i < paramList.length ; i++) {
            var param = paramList[i];
            console.log(param);
            text += `${param.seriesName}: ${param.value}\n`;
          }
          return text;
        }
      },
      legend: {
      },
      xAxis: {
        type: 'category',
        data: data.x,
        axisPointer: {
        },
        axisTick: {
          alignWithLabel: true
        },
      },
      yAxis: yList,
      series: series
    };
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