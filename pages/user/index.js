let App = getApp();
const countdown = require('../../utils/countdown.js');
Page({

      /**
       * 页面的初始数据
       */
      data: {
            userInfo: {}, // 用户信息
            orderCount: {}, // 订单数量
            couponCount: {}, // 优惠券数量
            //endtime:[{'date':'2019-06-26 12:00:00',dynamic:{'hou':'00','min':'00','sec':'00'}}]//结束时间
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function(options) {
            
            //countdown.onSetTimeList(this,'endtime' );
            //this.getUserDetail();

      },

      /**
       * 生命周期函数--监听页面显示
       */
      onShow: function() {
            // 获取当前用户信息
            this.getUserDetail();
      },

      /**
       * 获取当前用户信息
       */
      getUserDetail: function() {
            let _this = this;
            App._get('user.index/detail', {}, function(result) {
                  _this.setData(result.data);
            });
      },

      /**
       * 订单导航跳转
       */
      onTargetOrder(e) {
            // 记录formid
            App.saveFormId(e.detail.formId);
            let urls = {
                  all: '/pages/order/index?type=all',
                  payment: '/pages/order/index?type=payment',
                  received: '/pages/order/index?type=received',
                  transfer: '/pages/order/index?type=transfer',
                  refund: '/pages/order/refund/index',
            };
            // 转跳指定的页面
            wx.navigateTo({
                  url: urls[e.currentTarget.dataset.type]
            })
      },

      /**
       * 菜单列表导航跳转
       */
      onTargetMenus(e) {
            // 记录formId
            App.saveFormId(e.detail.formId);
            wx.navigateTo({
                  url: '/' + e.currentTarget.dataset.url
            })
      },

      /**
       * 跳转我的钱包页面
       */
      onTargetWallet(e) {
            // 记录formId
            App.saveFormId(e.detail.formId);
            wx.navigateTo({
                  url: './wallet/index'
            })
      },

      /**
       * 跳转我的优惠券页面
       */
      onTargetCoupon(e) {
            // 记录formId
            App.saveFormId(e.detail.formId);
            wx.navigateTo({
                  url: './coupon/coupon'
            })
      },
      showQrcode:function(){
            wx.previewImage({
                  current: this.data.qrcodeUrl, // 当前显示图片的http链接
                  urls: [this.data.qrcodeUrl] // 需要预览的图片http链接列表
            })
      },
      onPullDownRefresh:function(){
            this.getUserDetail();
            wx.stopPullDownRefresh();
      }
})