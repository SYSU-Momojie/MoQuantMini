// pages/trend/index.js

import * as echarts from '../../components/ec-canvas/echarts';

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
    var options = this.getChartOption();
    console.log(this.chart);
    this.chart.setOption(options);
  },

  getChartOption: function() {
    return {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子"]
      },
      yAxis: [
        {
          name: '销量',
          position: 'left'
        },
        {
          name: '增速',
          position: 'right'
        }
      ],
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10]
        },
        {
          name: '增速',
          type: 'line',
          yAxisIndex: 1,
          data: [0.5, 0.6, 0.3, 0.4]
        }
      ]
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