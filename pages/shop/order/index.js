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
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function(options) {
            let _this = this;
            // 设置scroll-view高度
            _this.setListHeight();
            // 设置数据类型
            _this.setData({
                  dataType: options.type || 'all'
            });
      },

      /**
       * 生命周期函数--监听页面初次渲染完成
       */
      onReady: function() {

      },

      /**
       * 生命周期函数--监听页面显示
       */
      onShow: function() {
            this.getOrderList();
      },
      /**
       * 获取订单列表
       */
      getOrderList(isPage, page) {
            let _this = this;
            App._get('shop.order/lists', {
                  page: page || 1,
                  dataType: _this.data.dataType
            }, result => {
                  let resList = result.data.list,
                        dataList = _this.data.list;
                  if (resList.data) {
                        for (var k in resList.data) {
                              var num = 0;
                              for (var l in resList.data[k].goods) {
                                    num += resList.data[k].goods[l].total_num;
                              }
                              resList.data[k]['total_num'] = num;
                        }
                  }
                  if (isPage == true) {
                        _this.setData({
                              'list.data': dataList.data.concat(resList.data),
                              isLoading: false,
                        });
                  } else {
                        _this.setData({
                              list: resList,
                              isLoading: false,
                        });
                  }
            });
      },
      /**
       * 切换标签
       */
      bindHeaderTap(e) {
            this.setData({
                  dataType: e.currentTarget.dataset.type,
                  list: {},
                  isLoading: true,
                  page: 1,
                  no_more: false,
            });
            // 获取订单列表
            this.getOrderList(e.currentTarget.dataset.type);
      },
      /**
       * 生命周期函数--监听页面隐藏
       */
      onHide: function() {

      },

      /**
       * 生命周期函数--监听页面卸载
       */
      onUnload: function() {

      },

      /**
       * 页面相关事件处理函数--监听用户下拉动作
       */
      onPullDownRefresh() {
            wx.stopPullDownRefresh();
      },
      bindDownLoad() {
            // 已经是最后一页
            if (this.data.page >= this.data.list.last_page) {
                  this.setData({
                        no_more: true
                  });
                  return false;
            }
            // 加载下一页列表
            this.getOrderList(true, ++this.data.page);
      },
      /**
       * 设置商品列表高度
       */
      setListHeight() {
            let systemInfo = wx.getSystemInfoSync(),
                  rpx = systemInfo.windowWidth / 750, // 计算rpx
                  tapHeight = Math.floor(rpx * 88), // tap高度
                  scrollHeight = systemInfo.windowHeight - tapHeight; // swiper高度
            this.setData({
                  scrollHeight
            });
      },

      /**
       * 页面上拉触底事件的处理函数
       */
      onReachBottom: function() {

      },

      /**
       * 用户点击右上角分享
       */
      onShareAppMessage: function() {

      }
})