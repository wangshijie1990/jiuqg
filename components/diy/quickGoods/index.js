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
            params:Object,
            dataList:Object
      },
      data:{
            selectedIndex:0,
      },
      observers: {
            
      },
      /**
       * 组件的方法列表
       * 更新属性和数据的方法与更新页面数据的方法类似
       */
      methods: {
            changeQuick:function(e){
                  this.setData({
                        selectedIndex: e.currentTarget.dataset.selected
                  });
            },
            goodsDetail: function (e) {
                  wx.navigateTo({
                        url: '/pages/goods/index?goods_id=' + e.currentTarget.dataset.id,
                  })
            }
      }

})