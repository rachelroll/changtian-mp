const app = getApp()
const CONFIG = require('../../config.js')
const WXAPI = require('../../wxapi/main')
Page({
	data: {
	    goodsId: 0,
        video: '',
        originalInfo: '',
  },
    onLoad(e) {
        console.log(e);
        this.data.goodsId = e.id;
        console.log(this.data.goodsId);
    },

    onShow (){
	    var that = this;
        WXAPI.goodsDetail(this.data.goodsId).then(function (res) {
            if (res.code == 0) {
                that.setData({
                    originalInfo: res.data.basicInfo.source_content,
                    video: res.data.basicInfo.source_video? res.data.basicInfo.source_video: ''
                });
            }
        });
    },
})
