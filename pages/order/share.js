const App = getApp();

// 枚举类：支付方式
import PayTypeEnum from '../../utils/enum/order/PayType'


Page({

      /**
       * 页面的初始数据
       */
      data: {

            // 配送方式
            //DeliveryTypeEnum,

            // 支付方式
            PayTypeEnum,

            order_id: null,
            order: {},
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad(options) {
            let _this = this;
            _this.data.order_id = options.order_id;
            // 获取订单详情
            _this.getOrderDetail(options.order_id);
      },

      /**
       * 获取订单详情
       */
      getOrderDetail(order_id) {
            let _this = this;
            App._get('user.order/shareDetail', {
                  order_id
            }, result => {
                  _this.setData(result.data);
            }, res => {
                  wx.switchTab({
                        url: '/pages/index/index'
                  });
            });
      },
      onTargetGoods(e) {
            wx.navigateTo({
                  url: `../goods/index?goods_id=${e.currentTarget.dataset.id}`,
            })
      },
      goHome:function(){
            wx.switchTab({
                  url: '/pages/index/index',
            })
      }

      

      

     

      
});