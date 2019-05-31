const app = getApp();
const CONFIG = require('../../config.js');
const WXAPI = require('../../wxapi/main');
Page({
	data: {
    freeze:0,
    score_sign_continuous:0,
    orders: {}
  },
	onLoad() {
	},
  onShow() {
    let that = this;
    let token = wx.getStorageSync('token');
      WXAPI.orderInfo(token).then(function(res) {
          console.log(res.data);
              that.setData({
                  orders: res.data
              });
              console.log(8989);
              console.log(that.data.orders);
      });
  },
});
