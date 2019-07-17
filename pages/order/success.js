// pages/order/success.js
const App = getApp();
Page({

      /**
       * 页面的初始数据
       */
      data: {
            order_id:null
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function (options) {
            if(!options.order_id){
                  wx.switchTab({
                        url: '/pages/index/index',
                  });
            }
            this.setData({
                  order_id:options.order_id
            });
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
      onShareAppMessage: function (e) {
            let params=App.getShareUrlParams({
                  'order_id': this.data.order_id
            });
            return {
                  title: '我在久趣购买了好东西哦，快来看看吧',
                  path: '/pages/order/share?'+params,
                  imageUrl: 'https://shop.yewudaotech.com/temp/10001/ordershare.png'
            }
      },
      goHome:function(){
            wx.switchTab({
                  url: '/pages/index/index',
            })
      }
})