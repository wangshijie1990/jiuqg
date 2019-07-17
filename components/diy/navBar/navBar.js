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

      /**
       * 组件的方法列表
       * 更新属性和数据的方法与更新页面数据的方法类似
       */
      methods: {

            /**
             * 跳转到指定页面
             */
            navigationTo: function(e) {
                  //console.log(e);
                  if(e.currentTarget.dataset.url.indexOf('tel:')!=-1){
                        wx.makePhoneCall({
                              phoneNumber: e.currentTarget.dataset.url.split(':')[1]
                        })
                        return true;
                  }
                  App.navigationTo(e.currentTarget.dataset.url);
            },

      }
})