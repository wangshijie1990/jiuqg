const App = getApp();

Page({

      /**
       * 页面的初始数据
       */
      data: {

      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function(options) {

      },

      /**
       * 生命周期函数--监听页面显示
       */
      onShow: function() {
            // 获取推广二维码
            this.getPoster();
      },

      /**
       * 获取推广二维码
       */
      getPoster: function() {
            let _this = this;
            wx.getStorage({
                  key: 'selectedShopId',
                  success(res) {
                        wx.showLoading({
                              title: '加载中',
                        });
                        App._get('page/qrcode', {shop_id:res.data}, function (result) {
                              _this.setData(result.data);
                        }, null, function () {
                              wx.hideLoading();
                        });
                  },
                  fail(){
                        wx.redirectTo({
                              url: '/pages/index/index',
                        })
                  }
            });
            
            
      },

      previewImage: function() {
            wx.previewImage({
                  current: this.data.qrcode,
                  urls: [this.data.qrcode]
            })
      },
      save:function(){
            if(this.data.qrcode){
                  wx.showLoading({
                        title: '保存中',
                  });
                  let _this=this;
                  wx.downloadFile({
                        url: this.data.qrcode,
                        success(res) {
                              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                              if (res.statusCode === 200) {
                                    //console.log(res.tempFilePath);
                                    _this.imgPath = res.tempFilePath; 
                                    _this.saveToLocal(res.tempFilePath);
                              }
                        }
                  });
            }
            
      },
      saveToLocal:function(f){
            //console.log(f);
            
            wx.saveImageToPhotosAlbum({
                  filePath: f,
                  success(res) {
                        wx.showToast({
                              title: '保存成功',
                        })
                  }
            });
            wx.hideLoading();
      }

})