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
            dataList: Object,
            params: Object,
      },
      observers: {

      },
      data: {
            selectedIndex: 0,
            loading:false
      },
      /**
       * 组件的方法列表
       * 更新属性和数据的方法与更新页面数据的方法类似
       */
      methods: {
            changeAdvice: function (e) {
                  //console.log(this.properties);
                  this.setData({
                        selectedIndex: e.currentTarget.dataset.selected
                  });
            },
            goodsDetail: function (e) {
                  wx.navigateTo({
                        url: '/pages/goods/index?goods_id=' + e.currentTarget.dataset.id,
                  })
            },
            load: function (e) {
                  let _this=this;
                  let _selectedIndex = this.data.selectedIndex;
                  if (this.data.dataList[_selectedIndex].list.current_page == this.data.dataList[_selectedIndex].list.last_page){
                        return false;
                  }
                  if(this.data.loading){
                        return false;
                  }
                  App._get('goods/lists', {
                        page: this.data.dataList[_selectedIndex].list.current_page+1,
                        category_id: this.data.dataList[_selectedIndex].tag_value,
                  }, result => {
                        let resList = result.data.list;
                        let temp = _this.data.dataList;
                        temp[_selectedIndex].list.current_page=resList.current_page;
                        temp[_selectedIndex].list.last_page = resList.last_page;
                        temp[_selectedIndex].list.data = temp[_selectedIndex].list.data.concat(resList.data);
                        _this.setData({
                              dataList: temp,
                              isLoading: false,
                        }); 
                  });

                  
                  //console.log(this.data.dataList[this.data.selectedIndex].list.data);
                  console.log('get event bottom');
            },
            addCart:function(e){
                  App._post_form('cart/add', {
                        goods_id: e.currentTarget.dataset.id,
                        goods_num: 1,
                        goods_sku_id: e.currentTarget.dataset.sku_id,
                  }, (result) => {
                        wx.setTabBarBadge({
                              index: 2,
                              text: result.data.cart_total_num.toString()
                        })
                        App.showSuccess(result.msg);
                  });
            }

      }

})