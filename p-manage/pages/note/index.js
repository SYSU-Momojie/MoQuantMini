const computedBehavior = require('miniprogram-computed');
const apiBehavior = require('../../../behaviors/api.js');

import Toast from '@vant/weapp/toast/toast';

Page({
  behaviors: [computedBehavior, apiBehavior],

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    eventBrief: "",
    noteDetail: "",
    noteConclusion: "",
    shareList: []
  },

  onLoad: function (options) {
    if (options.id === undefined) {
      return ;
    }
    this.requestData(options.id);
  },

  requestData: function(id) {
    this.post('getNote', id, this.afterFetch.bind(this));
  },

  afterFetch: function(data) {
    var shareList = [];
    if (data.relatedShareList !== undefined) {
      for (var i in data.relatedShareList) {
        shareList.push({
          tsCode: data.relatedShareList[i].tsCode,
          shareName: data.relatedShareList[i].shareName
        })
      }
    }
    this.setData({
      id: data.id,
      eventBrief: data.eventBrief,
      noteDetail: data.noteDetail,
      noteConclusion: data.noteConclusion,
      shareList: shareList
    });
  },

  onShareChosen: function(e) {
    var tsCode = e.detail.tsCode;
    var shareName = e.detail.shareName;

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
      arr.push({tsCode, shareName});
      this.setData({shareList: arr});
    }
  },

  removeShare: function(e) {
    var toRemove = e.currentTarget.dataset.code;
    var newarr = [];
    for (var i in this.data.shareList) {
      var item = this.data.shareList[i];
      if (item.tsCode === toRemove) {
        continue;
      }
      newarr.push(item);
    }
    this.setData({shareList: newarr});
  },

  saveNote: function(e) {
    var param = {
      eventBrief: this.data.eventBrief,
      noteDetail: this.data.noteDetail,
      noteConclusion: this.data.noteConclusion
    };
    if (this.data.id != 0) {
      param.id = this.data.id;
    }
    var codeList = [];
    for (var i in this.data.shareList) {
      var item = this.data.shareList[i];
      codeList.push(item.tsCode);
    }
    param.tsCodeList = codeList;
    var url = this.data.id != 0 ? 'manage/editNote' : 'manage/addNote';
    this.post(url, param, this.afterSave.bind(this));
  },

  afterSave: function(data) {
    var opts = {
      selector: '#manage-note-toast',
      message: data.msg
    };
    if (data.success === true) {
      Toast.success(opts);
      if (this.data.id === 0) {
        this.setData({
          id: data.data
        });
      }
    } else {
      Toast.fail(opts);
    }
  },

  updateInput: function(e) {
    var data = {};
    data[e.currentTarget.dataset.name] = e.detail;
    this.setData(data);
  },

  deleteNote: function(e) {
    if (this.data.id == 0) {
      return ;
    }
    this.post('manage/deleteNote', this.data.id, this.afterDelete.bind(this));
  },

  afterDelete: function(data) {
    var opts = {
      selector: '#manage-note-toast',
      message: data.msg
    };
    if (data.success === true) {
      Toast.success(opts);
      this.setData({id: 0});
    } else {
      Toast.fail(opts);
    }
  }
})