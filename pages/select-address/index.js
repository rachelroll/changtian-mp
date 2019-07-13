const WXAPI = require('../../wxapi/main')
const app = getApp()
Page({
  data: {
    addressList: []
  },

  selectTap: function(e) {
      console.log(e);
    var id = e.currentTarget.dataset.id;
      console.log(id);
    WXAPI.updateAddress({
      token: wx.getStorageSync('token'),
      id: id,
      isDefault: 1
    }).then(function(res) {
      wx.navigateBack({})
    })
  },

  addAddess: function() {
    wx.navigateTo({
      url: "/pages/address-add/index"
    })
  },

  editAddess: function(e) {
    wx.navigateTo({
      url: "/pages/address-add/index?id=" + e.currentTarget.dataset.id
    })
  },

  onLoad: function() {
    console.log('onLoad')


  },
  onShow: function() {
    this.initShippingAddress();
  },
  initShippingAddress: function() {
    var that = this;
    WXAPI.queryAddress(wx.getStorageSync('token')).then(function(res) {
        // console.log('地址列表:'.res.data);
      // if (res.code == 0) {
        that.setData({
          addressList: res.data
        });
      // } else if (res.code == 700) {
      //   that.setData({
      //     addressList: null
      //   });
      // }
    })
  }

})
