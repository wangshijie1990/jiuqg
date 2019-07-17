const App = getApp();

// 枚举类：发货方式
import DeliveryTypeEnum from '../../../utils/enum/DeliveryType.js';

// 枚举类：支付方式
import PayTypeEnum from '../../../utils/enum/order/PayType'

Page({

      /**
       * 页面的初始数据
       */
      data: {

            dataType: 'all', // 列表类型
            list: [], // 订单列表
            scrollHeight: null, // 列表容器高度

            DeliveryTypeEnum, // 配送方式
            PayTypeEnum, // 支付方式

            no_more: false, // 没有更多数据
            isLoading: true, // 是否正在加载中

            page: 1, // 当前页码

            showQRCodePopup: false, // 核销码弹窗显示隐藏
            QRCodeImage: '', // 核销码图片

      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad(options) {
            let _this = this,
                  scene = App.getSceneData(options);
            // 记录options
            _this.setData({
                  options: scene
            });
            // 获取订单列表
            //_this.getOrderList(scene.uid);
            _this.getOrderList(10074);
      },

      /**
       * 生命周期函数--监听页面显示
       */
      onShow() {

      },
      changeChecked: function (e) {
            console.log(e);
            let _this = this,
                  index = e.currentTarget.dataset.index,
                  checked = !_this.data.list[index].checked;
            _this.setData({
                  ['list[' + index + '].checked']: checked
            });
      },
      /**
       * 获取订单列表
       */
      getOrderList(user_id) {
            let _this = this;
            App._get('shop.order/extractLists', {
                  user_id: user_id
            }, result => {
                  let list=result.data.list;
                  if(list){
                        for(var k in list){
                              list[k].checked=true;
                        }
                        _this.setData({
                              list: list,
                              isLoading: false,
                        });
                  }
                  
            });
      },
      onSubmitExtract:function(){
            let order_ids=[];
            for(var k in this.data.list){
                  if(this.data.list[k].checked){
                        order_ids.push(this.data.list[k].order_id);
                  }
            }
            if(order_ids.length==0){
                  return false;
            }
            let _this = this;
            wx.showModal({
                  title: "提示",
                  content: "确认核销全部订单吗？",
                  success(o) {
                        if (o.confirm) {
                              App._post_form('shop.order/batchExtract', {
                                    order_ids: order_ids.join(',')
                              }, result => {
                                    App.showSuccess(result.msg, () => {
                                          // 获取订单详情
                                          //_this.getOrderList();
                                          wx.redirectTo({
                                                url: '/pages/shop/manage/index',
                                          })
                                    });
                              });
                        }
                  }
            });
      }
});