const app = getApp();
const CONFIG = require('../../config.js');
const WXAPI = require('../../wxapi/main');
Page({
	data: {
    freeze:0,
    score_sign_continuous:0,
        orders: ''
  },
	onLoad() {
	},
  onShow() {
    let that = this;
    let token = wx.getStorageSync('token');
      const orderRes = WXAPI.orderInfo(token);
      that.setData({
          orders: orderRes
      });
  },
});
