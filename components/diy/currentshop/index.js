const App = getApp();

Component({

      options: {
            addGlobalClass: true,
      },

      /**
       * 组件的属性列表
       * 用于组件自定义设置
       */
      properties: {
            itemIndex: String,
            itemStyle: Object,
            shop: Object,
            params:Object,
            selectedShopId:Number
      },
      observers: {
            'selectedShopId': function () {
                  if(this.data.selectedShopId==0){
                        let _this = this;
                        wx.getStorage({
                              key: 'selectedShopId',
                              success(res) {
      
                                    App._get('shop/detail', {
                                          "shop_id": res.data
                                    }, function (result) {
                                          if(!result.data.detail){
                                                wx.navigateTo({
                                                      url: '/pages/_select/extract_point/index?selected_id=0'
                                                });
                                                return false;  
                                          }
                                          wx.setStorage({
                                                key: 'selectedShopId',
                                                data: res.data,
                                          });
                              
                                          result.data.detail.logo_image = result.data.detail.logo.file_path;
                                          _this.setData({ selectedShopId:res.data,'shop': result.data.detail });
                                          
                                    });
                                    
                              },
                              fail(res){
                                    wx.navigateTo({
                                          url: '/pages/_select/extract_point/index?selected_id=0'
                                    });
                              }
                        })
                        
                  }
                  else{
                        let _this=this;
                        App._get('shop/detail', {
                              "shop_id": this.data.selectedShopId
                        }, function (result) {
                              wx.setStorage({
                                    key: 'selectedShopId',
                                    data: _this.data.selectedShopId,
                              })
                              result.data.detail.logo_image = result.data.detail.logo.file_path;
                              _this.setData({'shop':result.data.detail});
                              //console.log(_this.data);
                        });
                  }
            },
      },
      /**
       * 组件的方法列表
       * 更新属性和数据的方法与更新页面数据的方法类似
       */
      methods: {

            /**
             * 跳转门店详情页
             */
            _onTargetSwitch(e) {
                  // 记录formid
                  App.saveFormId(e.detail.formId);
                  /*wx.navigateTo({
                        url: '/pages/shop/detail/index?shop_id=' + e.detail.target.dataset.id,
                  });*/
                  wx.navigateTo({
                        url: '/pages/_select/extract_point/index?selected_id='+this.data.selectedShopId
                  });
            }
      }

})