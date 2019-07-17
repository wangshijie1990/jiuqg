const App = getApp();
const QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
import Toptips from '../../../components/toptips/toptips';

Page({

      /**
       * 页面的初始数据
       */
      data: {
            selectedId: -1,
            isAuthor: true,
            currentShop: false,
            isLoading: true, // 是否正在加载中
            shopList: [], // 门店列表,
            currentLocation: '未获取到详细地址',
            width:200,
            searchIcon:true,
            holderKeyword:'搜索团长'
      },
      translateLocation: function (latitude, longitude) {
            let qqmapsdk = new QQMapWX({
                  key: 'IV7BZ-LX2KF-S7EJB-NBGOA-QDAXJ-PSF7A'
            });
            let _this = this;
            qqmapsdk.reverseGeocoder({
                  location: {
                        latitude: latitude,
                        longitude: longitude
                  },
                  success: function (res) {

                        if (res.result.formatted_addresses.recommend) {
                              _this.setData({
                                    currentLocation: res.result.formatted_addresses.recommend
                              });
                        }

                  },
                  fail: function (res) {
                        console.log(res);
                  }
            });
      },
      /**
       * 生命周期函数--监听页面加载
       */
      onLoad(options) {
            let _this = this;
            // 记录已选中的id
            try {
                  if (options.selected_id) {
                        _this.setData({
                              selectedId: options.selected_id
                        });
                  }
            }
            catch (e) {
                  cosole.log(e);
            }
            // 获取默认门店列表
            _this.getShopList();
            _this.getCurrentShop();
            // 获取用户坐标
            _this.getLocation((res) => {

                  _this.setData({
                        longitude: res.longitude,
                        latitude: res.latitude
                  }, function () {
                        _this.getShopList(res.longitude, res.latitude);
                        _this.translateLocation(res.latitude, res.longitude);
                        _this.getCurrentShop(res.longitude, res.latitude);
                  });

                  
            });
      },
      getCurrentShop(longitude, latitude) {
            let _this = this;
            wx.getStorage({
                  key: 'selectedShopId',
                  success(res) {
                        App._get('shop/detail', {
                              "shop_id": res.data,
                              longitude: longitude,
                              latitude: latitude
                        }, function (result) {

                              //result.data.detail.logo_image = result.data.detail.logo.file_path;
                              if(result.data.detail){
                                    _this.setData({
                                          'currentShop': result.data.detail
                                    });
                              }

                        });

                  }
                  
            })
      },
      search(e) {
            let _this = this;
            if (e.detail.value.length) {
                  App._get('shop/lists', {
                        keyword: e.detail.value,
                        longitude: this.data.longitude || '',
                        latitude: this.data.latitude || '',
                  }, (result) => {
                        _this.setData({
                              shopList: result.data.list,
                              isLoading: false
                        });
                  });
            }
            //console.log(e);
      },
      focus:function(){
            this.setData({
                  width:500,
                  searchIcon:false
            })
      },
      blur: function () {
            this.setData({
                  width: 200,
                  searchIcon:true
            })
      },
      /**
       * 获取门店列表
       */
      getShopList(longitude, latitude) {
            let _this = this;
            _this.setData({
                  isLoading: true
            });
            App._get('shop/lists', {
                  longitude: longitude || '',
                  latitude: latitude || ''
            }, (result) => {
                  _this.setData({
                        shopList: result.data.list,
                        isLoading: false
                  });
            });
      },
      /**
       选择位置
      */
      chooseLocation: function () {
            let _this = this;
            wx.chooseLocation({
                  success: function (res) {
                        //console.log(res);
                        _this.setData({
                              longitude: res.longitude,
                              latitude: res.latitude
                        },function(){
                              _this.getShopList(res.longitude, res.latitude);
                              _this.translateLocation(res.latitude, res.longitude);
                              _this.getCurrentShop(res.longitude, res.latitude);
                        });
                        
                  },
            })
      },
      /**
       * 获取用户坐标
       */
      getLocation(callback) {
            let _this = this;
            wx.getLocation({
                  type: 'wgs84',
                  success(res) {
                        console.log(res);
                        callback && callback(res);
                  },
                  fail() {
                        Toptips({
                              duration: 3000,
                              content: '获取定位失败，请点击右下角按钮打开定位权限'
                        });
                        _this.setData({
                              isAuthor: false
                        });
                  },
            })
      },

      /**
       * 授权启用定位权限
       */
      onAuthorize() {
            let _this = this;
            wx.openSetting({
                  success(res) {
                        if (res.authSetting["scope.userLocation"]) {
                              console.log('授权成功');
                              _this.setData({
                                    isAuthor: true
                              });
                              setTimeout(() => {
                                    // 获取用户坐标
                                    _this.getLocation((res) => {
                                          console.log('获取用户坐标');
                                          _this.getShopList(res.longitude, res.latitude);
                                    });
                              }, 1000);
                        }
                  }
            })
      },

      /**
       * 选择门店
       */
      onSelectedShop(e) {
            let _this = this,
                  selectedId = e.currentTarget.dataset.id;
            // 设置选中的id
            _this.setData({
                  selectedId
            });
            // 设置上级页面的门店id
            let pages = getCurrentPages();
            if (pages.length < 2) {
                  return false;
            }
            let prevPage = pages[pages.length - 2];
            prevPage.setData({
                  selectedShopId: selectedId
            });
            // 返回上级页面
            wx.navigateBack({
                  delta: 1
            });
      },

})