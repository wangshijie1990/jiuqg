const App = getApp();

Page({

      /**
       * 页面的初始数据
       */
      data: {
            isData: false,
            words: {},
            user: {},
            dealer: {},
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function (options) {
            /*wx.login({
                  success(res) {
                        if (res.code) {
                              let code=res.code;
                              wx.getWeRunData({
                                    success(res) {
                                          App._post_form('user.WeRun/getrundata', { code:code,encryptedData: res.encryptedData, iv: res.iv }, function (result) {
                                                console.log(result);
                                          });
                                    },
                                    fail(res) {
                                    }
                              })
                        } else {
                              console.log('登录失败！')
                        }
                  }
            });*/
      },

      /**
       * 生命周期函数--监听页面显示
       */
      onShow: function () {
            this.getShopCenter();
      },

      /**
       * 获取门店中心数据
       */
      getShopCenter: function () {
            let _this = this;
            App._get('shop.clerk/center', {}, function (result) {
                  _this.setData(result.data);
            });   
      },
      /*核销扫一扫*/
      scan:function(){
            wx.scanCode({
                  onlyFromCamera: true,
                  success(res) {
                        if(res.path){
                              
                              wx.navigateTo({
                                    url: '/'+res.path,
                              })
                        }
                        //console.log(res)
                  }
            })
      },
      /*提现*/
      draw:function(){
            wx.navigateTo({
                  url: '/pages/shop/withdraw/index'
            }) 
      },
      onTargetOrder(e) {
            // 记录formid
            App.saveFormId(e.detail.formId);
            let urls = {
                  all: '/pages/shop/order/index?type=all',
                  payment: '/pages/shop/order/index?type=payment',
                  transfer: '/pages/shop/order/index?type=transfer',
                  receive: '/pages/shop/order/index?type=receive',
            };
            // 转跳指定的页面
            wx.navigateTo({
                  url: urls[e.currentTarget.dataset.type]
            })
      },
      onTargetSharingOrder(e) {
            // 记录formid
            App.saveFormId(e.detail.formId);
            let urls = {
                  all: '/pages/shop/sharingorder/index?type=all',
                  transfer: '/pages/shop/sharingorder/index?type=transfer',
                  receive: '/pages/shop/sharingorder/index?type=receive',
            };
            // 转跳指定的页面
            wx.navigateTo({
                  url: urls[e.currentTarget.dataset.type]
            })
      },
      triggerApply:function(e){
            wx.redirectTo({
                  url: '/pages/shop/apply/index',
            })
      }
})