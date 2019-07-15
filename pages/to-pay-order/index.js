const app = getApp()
const WXAPI = require('../../wxapi/main')

Page({
  data: {
      totalScoreToPay: 0,
      goodsList: [],
      isNeedLogistics: 0, // 是否需要物流信息
      allGoodsPrice: 0,
      yunPrice: 0,
      allGoodsAndYunPrice: 0,
      goodsJsonStr: "",
      orderType: "", //订单类型，购物车下单或立即支付下单，默认是购物车，
      peisongType: 'kd' // 配送方式 kd,zq 分别表示快递/到店自取
  },
  onShow: function () {
    const that = this;
    let shopList = [];
    //立即购买下单
    if ("buyNow" == that.data.orderType) {
      var buyNowInfoMem = wx.getStorageSync('buyNowInfo');
        console.log('立即下单', buyNowInfoMem);
      that.data.kjId = buyNowInfoMem.kjId;
      if (buyNowInfoMem && buyNowInfoMem.shopList) {
        shopList = buyNowInfoMem.shopList
      }
    } else {
      //购物车下单
      var shopCarInfoMem = wx.getStorageSync('shopCarInfo');
        console.log('购物车下单', shopCarInfoMem);
      that.data.kjId = shopCarInfoMem.kjId;
      if (shopCarInfoMem && shopCarInfoMem.shopList) {
        // shopList = shopCarInfoMem.shopList
        shopList = shopCarInfoMem.shopList.filter(entity => {
          return entity.active;
        });
      }
    }
    that.setData({
      goodsList: shopList,
      peisongType: that.data.peisongType
    });
    that.initShippingAddress();
  },

  onLoad: function (e) {
    let _data = {
      isNeedLogistics: 1
    }
    if (e.orderType) {
      _data.orderType = e.orderType
    }
    // if (e.pingtuanOpenId) {
    //   _data.pingtuanOpenId = e.pingtuanOpenId
    // }
    this.setData(_data);
  },

  getDistrictId: function (obj, aaa) {
    if (!obj) {
      console.log(1)
      return "";
    }
    if (!aaa) {
      console.log(2)
      return "";
    }
    console.log(aaa)
    return aaa;
  },

  createOrder: function (e) {
      var that = this;
      var loginToken = wx.getStorageSync('token') // 用户登录 token
      var remark = ""; // 备注信息
      if (e) {
          remark = e.detail.value.remark; // 备注信息
      }
      let postData = {
          token: loginToken,
          goodsJsonStr: that.data.goodsJsonStr,
          comments: remark,
          peisongType: that.data.peisongType
      };

      if (!that.data.curAddressData) {
          wx.hideLoading();
          wx.showModal({
              title: '错误',
              content: '请先设置您的收货地址！',
              showCancel: false
          })
          return;
      }
      postData.provinceId = that.data.curAddressData.provinceId;
      postData.cityId = that.data.curAddressData.cityId;
      if (that.data.curAddressData.districtId) {
          postData.districtId = that.data.curAddressData.districtId;
      }
      postData.address = that.data.curAddressData.address;
      postData.linkMan = that.data.curAddressData.linkMan;
      postData.mobile = that.data.curAddressData.mobile;
      postData.code = that.data.curAddressData.code;
      console.log(postData);
      WXAPI.orderCreate(postData).then(function (res) {
          if (res.code != 0) {
              wx.showModal({
                  title: '错误',
                  content: '你好',
                  showCancel: false
              })
              return;
          }
          if (e && "buyNow" != that.data.orderType) {
              // 清空购物车数据
              wx.removeStorageSync('shopCarInfo');
          }
          if (!e) {
              that.setData({
                  totalScoreToPay: res.data.score,
                  isNeedLogistics: res.data.isNeedLogistics,
                  allGoodsPrice: res.data.amountTotle,
                  allGoodsAndYunPrice: res.data.amountLogistics + res.data.amountTotle,
                  yunPrice: res.data.amountLogistics
              });
              // that.getMyCoupons();
              return;
          }
          // WXAPI.addTempleMsgFormid({
          //     token: wx.getStorageSync('token'),
          //     type: 'form',
          //     formId: e.detail.formId
          // })
          // 配置模板消息推送
          // var postJsonString = {};
          // postJsonString.keyword1 = {
          //     value: res.data.dateAdd,
          //     color: '#173177'
          // }
          // postJsonString.keyword2 = {
          //     value: res.data.amountReal + '元',
          //     color: '#173177'
          // }
          // postJsonString.keyword3 = {
          //     value: res.data.orderNumber,
          //     color: '#173177'
          // }
          // postJsonString.keyword4 = {
          //     value: '订单已关闭',
          //     color: '#173177'
          // }
          // postJsonString.keyword5 = {
          //     value: '您可以重新下单，请在30分钟内完成支付',
          //     color: '#173177'
          // }
          // WXAPI.sendTempleMsg({
          //     module: 'order',
          //     business_id: res.data.id,
          //     trigger: -1,
          //     postJsonString: JSON.stringify(postJsonString),
          //     template_id: 'mGVFc31MYNMoR9Z-A9yeVVYLIVGphUVcK2-S2UdZHmg',
          //     type: 0,
          //     token: wx.getStorageSync('token'),
          //     url: 'pages/index/index'
          // })
          // postJsonString = {};
          // postJsonString.keyword1 = {
          //     value: '您的订单已发货，请注意查收',
          //     color: '#173177'
          // }
          // postJsonString.keyword2 = {
          //     value: res.data.orderNumber,
          //     color: '#173177'
          // }
          // postJsonString.keyword3 = {
          //     value: res.data.dateAdd,
          //     color: '#173177'
          // }
          // WXAPI.sendTempleMsg({
          //     module: 'order',
          //     business_id: res.data.id,
          //     trigger: 2,
          //     postJsonString: JSON.stringify(postJsonString),
          //     template_id: 'Arm2aS1rsklRuJSrfz-QVoyUzLVmU2vEMn_HgMxuegw',
          //     type: 0,
          //     token: wx.getStorageSync('token'),
          //     url: 'pages/order-details/index?id=' + res.data.id
          // })
          // 下单成功，跳转到订单管理界面
          wx.redirectTo({
              url: "/pages/order-list/index"
          });
          // wx.showModal({
          //     title: '提交订单成功',
          //     content: res.msg,
          //     showCancel: true
          // });
      });
    },
  initShippingAddress: function () {
      var that = this;
      console.log(89898)
      console.log(wx.getStorageSync('token'));
      WXAPI.defaultAddress(wx.getStorageSync('token')).then(function (res) {
          if (res.code == 0) {
              console.log('地址信息', res.data);
              that.setData({
                  curAddressData: res.data
              });
          } else {
              that.setData({
                  curAddressData: null
              });
          }
          that.processYunfei();
      })
  },
  processYunfei: function () {
    var that = this;
    var goodsList = this.data.goodsList;
    var goodsJsonStr = "[";
    var isNeedLogistics = 0;
    var allGoodsPrice = 0;

    for (let i = 0; i < goodsList.length; i++) {
      let carShopBean = goodsList[i];

      if (carShopBean.logistics) {
        isNeedLogistics = 1;
      }
      allGoodsPrice += carShopBean.price * carShopBean.number;

      var goodsJsonStrTmp = '';
      if (i > 0) {
        goodsJsonStrTmp = ",";
      }

      goodsJsonStrTmp += '{"goodsId":' + carShopBean.goodsId + ',"number":' + carShopBean.number + '}';
      goodsJsonStr += goodsJsonStrTmp;
    }
    goodsJsonStr += "]";
      console.log(11111);
    console.log(goodsJsonStr);
    that.setData({
      isNeedLogistics: isNeedLogistics,
      goodsJsonStr: goodsJsonStr,
        allGoodsPrice: allGoodsPrice,
    });

    console.log(99999)
    console.log(that.data.isNeedLogistics)
    // that.createOrder(); // 创建订单
  },
  addAddress: function () {
    wx.navigateTo({
      url: "/pages/address-add/index"
    })
  },
  selectAddress: function () {
    wx.navigateTo({
      url: "/pages/select-address/index"
    })
  },
  radioChange (e) {
    this.setData({
      peisongType: e.detail.value
    })
  }
})
