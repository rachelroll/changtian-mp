const WXAPI = require('../../wxapi/main')
const CONFIG = require('../../config.js')
//获取应用实例
var app = getApp()
Page({
    data: {
        inputShowed: false, // 是否显示搜索框
        inputVal: "", // 搜索框内容
        category_box_width: 750, //分类总宽度
        goodsRecommend: [], // 推荐商品
        indicatorDots: true,
        autoplay: true,
        interval: 3000,
        duration: 1000,
        loadingHidden: false, // loading
        userInfo: {},
        swiperCurrent: 0,
        selectCurrent: 0,
        categories: [],
        activeCategoryId: 0,
        goods: [],

        scrollTop: 0,
        loadingMoreHidden: true,

        curPage: 1,
        pageSize: 20,
        cateScrollTop: 0
    },

    tabClick: function(e) {
        let offset = e.currentTarget.offsetLeft;
        if (offset > 150) {
            offset = offset - 150
        } else {
            offset = 0;
        }
        this.setData({
            activeCategoryId: e.currentTarget.id,
            curPage: 1,
            cateScrollTop: offset
        });
        this.getGoodsList(this.data.activeCategoryId);
    },
    //事件处理函数
    swiperchange: function(e) {
        //console.log(e.detail.current)
        this.setData({
            swiperCurrent: e.detail.current
        })
    },
    toDetailsTap: function(e) {
        console.log('点击详情页的携带参数');
        console.log(e)
        wx.navigateTo({
            url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
        })
    },

    bindTypeTap: function(e) {
        this.setData({
            selectCurrent: e.index
        })
    },

    // 溯源页面
    toOriginInfo: function (e) {
        console.log('点击溯源页的携带参数');
        console.log(e)
        wx.navigateTo({
            url: "/pages/origin-info/index?id=" + e.currentTarget.dataset.id
        })
    },

    onLoad: function(e) {
        wx.showShareMenu({
            withShareTicket: true
        })
        const that = this;
        if (e && e.scene) {
            const scene = decodeURIComponent(e.scene)
            if (scene) {
                wx.setStorageSync('referrer', scene.substring(11))
            }
        }
        wx.setNavigationBarTitle({
            title: wx.getStorageSync('mallName')
        })
        /**
         * 示例：
         * 调用接口封装方法
         */
        WXAPI.banners({
            // type: 'new'
        }).then(function(res) {
            console.log('banner');
            console.log(res.data)
            if (res.code == 700) {
                // wx.showModal({
                //     title: '提示',
                //     content: '请在后台添加 banner 轮播图片，自定义类型填写 new',
                //     showCancel: false
                // })
            } else {
                that.setData({
                    banners: res.data,
                    slogan: res.slogan
                });
            }
        }).catch(function(e) {
            wx.showToast({
                title: res.msg,
                icon: 'none'
            })
        })
        WXAPI.goodsCategory().then(function(res) {

            console.log('categories:');
            console.log(res.data);
            // let categories = [{
            //   id: 0,
            //   icon: '/images/fl.png',
            //   name: "全部"
            // }];
            let categories = [];
            // if (res.code == 0) {
            categories = categories.concat(res.data)
            // }
            const _n = Math.ceil(categories.length / 2)
            that.setData({
                categories: categories,
                category_box_width: 300 * _n,
                activeCategoryId: 0,
                curPage: 1
            });

            console.log(11111111)
            console.log(that.data.category_box_width)
            that.getGoodsList(0);
        });
        WXAPI.goods({
            recommendStatus: 1
        }).then(res => {
            if (res.code === 0){
                that.setData({
                    goodsRecommend: res.data
                })
            }
        });
        // that.getCoupons()
        // that.getNotice()
        // that.kanjiaGoods()
        // that.pingtuanGoods()
    },
    onPageScroll(e) {
        let scrollTop = this.data.scrollTop
        this.setData({
            scrollTop: e.scrollTop
        })
    },

    getGoodsList: function(categoryId, append) {
        if (categoryId == 0) {
            categoryId = "";
        }
        var that = this;
        wx.showLoading({
            "mask": true
        })
        WXAPI.goods({
            id: categoryId,
            nameLike: that.data.inputVal,
            page: this.data.curPage,
            pageSize: this.data.pageSize
        }).then(function(res) {
            console.log('商品列表');
            console.log(res.data)
            wx.hideLoading();
            if (res.code == 404 || res.code == 700) {
                let newData = {
                    loadingMoreHidden: false
                }
                if (!append) {
                    newData.goods = []
                }
                that.setData(newData);
                return
            }
            let goods = [];
            if (append) {
                goods = that.data.goods
            }
            for (var i = 0; i < res.data.length; i++) {
                goods.push(res.data[i]);
            }
            console.log(goods);
            that.setData({
                loadingMoreHidden: true,
                goods: goods,
            });
        })
    },

    onShareAppMessage: function() {
        return {
            title: '"' + wx.getStorageSync('mallName') + '" ' + CONFIG.shareProfile,
            path: '/pages/index/index?inviter_id=' + wx.getStorageSync('uid')
        }
    },
    getNotice: function() {
        var that = this;
        WXAPI.noticeList({pageSize: 5}).then(function (res) {
            if (res.code == 0) {
                that.setData({
                    noticeList: res.data
                });
            }
        })
    },
    toSearch: function() {
        this.setData({
            curPage: 1
        });
        this.getGoodsList(this.data.activeCategoryId);
    },
    // onReachBottom: function() {
    //     this.setData({
    //         curPage: this.data.curPage + 1
    //     });
    //     this.getGoodsList(this.data.activeCategoryId, true)
    // },
    // onPullDownRefresh: function() {
    //     this.setData({
    //         curPage: 1
    //     });
    //     this.getGoodsList(this.data.activeCategoryId)
    //     wx.stopPullDownRefresh()
    // },
    // 以下为搜索框事件
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value
        });
    },
});
