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
            params: Object,
            dataList: Object
      },
      data: {
            currentIndex: 0,
            animationData: {}
      },
      attached: function() {
            //console.log('123');
            let _this = this;
            var animation = wx.createAnimation({
                  duration: 3000,
                  timingFunction: 'ease',
            })

            this.animation = animation;
            this.num=0;
            animation.opacity(0.9).step().opacity(0).step();

            this.setData({
                  animationData: animation.export()
            });
      },
      /**
       * 组件的方法列表
       * 更新属性和数据的方法与更新页面数据的方法类似
       */
      methods: {
            goodsDetail:function(e){
                  wx.navigateTo({
                        url: '/pages/goods/index?goods_id='+e.currentTarget.dataset.id,
                  })
            },
            animationend: function() {
                  this.num++;
                  if(this.num%2==0){
                        let _this = this;
                        _this.setData({
                              currentIndex: _this.data.currentIndex + 1
                        }, function () {
                              setTimeout(function () {
                                    _this.animation.opacity(0.9).step().opacity(0).step();
                                    _this.setData({
                                          animationData: _this.animation.export()
                                    });
                              }, parseInt(Math.random() * 2000) + 1000);
                        });
                        
                  }
                  

            }

      }

})