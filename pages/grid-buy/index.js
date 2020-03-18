// pages/grid-buy/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gridRows: [],
    spinShow: false,
    startPrice: 2800,
    endPrice: 2550,
    earnPrice: 3000,
    gridNum: 10,
    firstBuy: 50000,
    gridBuy: 10000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  onChange: function(e) {
    var newData = {};
    newData[e.target.dataset.k] = Number(e.detail);
    this.setData(newData);
  },

  calculate: function() {
    this.spinDisplay(true);
    this.clearGrid();
    console.log(this.data);

    var allCheck = true;
    var list = ['startPrice', 'endPrice', 'earnPrice', 'gridNum', 'firstBuy', 'gridBuy'];
    for (var k in list) {
      allCheck = this.checkInput(list[k]) && allCheck;
    }

    if (!allCheck) {
      this.spinDisplay(false);
      return ;
    }

    if (this.data['startPrice'] <= this.data['endPrice']) {
      this.setData({
        startPriceErr: '需大于最低价'
      });
      this.spinDisplay(false);
      return ;
    }

    var row0 = {
      price: this.data.startPrice,
      cost: 0,
      mv: 0,
      loss: 0,
      lossPercent: 0,
      earn: 0
    };

    var rows = [row0];
    var nowPrice = this.data.startPrice;
    var gridPrice = (this.data.startPrice - this.data.endPrice) / this.data.gridNum;
    
    while (nowPrice >= this.data.endPrice) {
      var lastRow = rows[rows.length - 1];
      var price = nowPrice;
      var thisLoss = (lastRow.price - price) / lastRow.price * lastRow.mv;
      var thisCost = rows.length === 1 ? this.data.firstBuy : this.data.gridBuy;
      var cost = lastRow.cost + thisCost;
      var mv = lastRow.mv - thisLoss + thisCost;
      var loss = lastRow.loss + thisLoss;
      var lossPercent = loss / cost;
      var row = {
        price: price,
        cost: cost,
        mv: mv,
        loss: loss,
        lossPercent: lossPercent,
        earn: 0
      };
      this.calEarn(row);
      rows.push(row);

      nowPrice = nowPrice - gridPrice;
    }

    rows.shift();
    this.setData({
      gridRows: rows
    });
    this.spinDisplay(false);
  },

  calEarn: function(row) {
    var final = this.data.earnPrice;
    var now = row.price;
    var earn = (final - now) / now * row.mv;
    row.earn = (earn - row.loss) / row.cost;
  },

  checkInput: function(field) {
    var errKey = field + 'Err';
    var newData = {};
    if (!(field in this.data) || this.data[field] === '') {
      newData[errKey] = '必填';
    } else if (this.data[field] === NaN) {
      newData[errKey] = '非数字';
    } else if (this.data[field] < 0) {
      newData[errKey] = '非负数';
    } else {
      newData[errKey] = '';
    }
    this.setData(newData);
    return newData[errKey] === '';
  },

  clearGrid: function() {
    this.setData({
      gridRows: []
    });
  },

  spinDisplay: function(b) {
    this.setData({
      spinShow: b
    });
  }
})