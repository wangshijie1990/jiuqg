const App = getApp();
const Dialog = require('../../../components/dialog/dialog');
const QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
Page({

      /**
       * 页面的初始数据
       */
      data: {
            is_read: false,
            disabled: false,
            logo_path: '',
            region: [],
            intro: "欢迎光临",
            open_time: "每天早上7:00到晚上9:00",
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function(options) {
            this.getApplyState();
            this.getDistrict();
      },
      translateLocation: function(latitude, longitude) {
            let qqmapsdk = new QQMapWX({
                  key: 'IV7BZ-LX2KF-S7EJB-NBGOA-QDAXJ-PSF7A'
            });
            let _this = this;
            qqmapsdk.reverseGeocoder({
                  location: {
                        latitude: latitude,
                        longitude: longitude
                  },
                  success: function(res) {
                        //console.log(res);
                        if (res.result.address_component) {
                              _this.setData({
                                    region: [res.result.address_component.province, res.result.address_component.city, res.result.address_component.district],
                              });
                        }
                        if (res.result.formatted_addresses.recommend) {
                              _this.setData({
                                    address: res.result.formatted_addresses.recommend
                              });
                        }

                  },
                  fail: function(res) {
                        console.log(res);
                  }
            });
      },
      getDistrict: function() {

            let _this = this;
            wx.getLocation({
                  type: 'wgs84',
                  success: function(res) {
                        //console.log(res);
                        var latitude = res.latitude;
                        var longitude = res.longitude;
                        _this.setData({
                              location: latitude + ',' + longitude 
                        });
                        _this.translateLocation(latitude, longitude);
                  }
            })
      },
      /**
       * 生命周期函数--监听页面显示
       */
      onShow: function() {
            // 获取门店申请状态

      },
      bindRegionChange: function(e) {
            console.log(e);
            this.setData({
                  region: e.detail.value
            })
      },
      chooseImage: function(e) {
            let _this = this;
            wx.chooseImage({
                  count: 1,
                  sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                  sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                  success: function(res) {
                        wx.navigateTo({
                              url: '/pages/cropper/index?image_path=' + res.tempFilePaths[0],
                        })
                  }
            });
      },
      /**
       * 获取门店申请状态
       */
      getApplyState: function() {
            let _this = this;
            App._get('shop.apply/index', {
                  referee_id: _this.getRefereeid()
            }, function(result) {
                  let data = result.data;
                  // 当前是否已经为门店
                  if (data.is_shop) {
                        wx.redirectTo({
                              url: '../manage/index'
                        });
                  }
                  // 设置当前页面标题
                  wx.setNavigationBarTitle({
                        title: data.words.apply.title.value
                  });
                  data.isData = true;
                  //data.shop_name = data.user.nickName;
                  data.real_name = data.user.nickName;
                  _this.setData(data);

                  wx.downloadFile({
                        url: data.user.avatarUrl,
                        success: function(res) {
                              console.log(res);
                              _this.setData({
                                    logo_path: res.tempFilePath
                              });
                        },
                        fail: function() {

                        }
                  });
            });
      },
      //获取地理位置
      getLocation: function() {
            let _this = this;
            wx.chooseLocation({
                  success: function(res) {
                        console.log(res);
                        _this.setData({
                              location:  res.latitude + ','+res.longitude
                        });
                        _this.translateLocation(res.latitude, res.longitude);
                  }
            });
      },
      /**
       * 显示申请协议
       */
      toggleApplyLicense: function() {
            Dialog({
                  title: '申请协议',
                  message: this.data.license,
                  selector: '#zan-base-dialog',
                  isScroll: true, // 滚动
                  buttons: [{
                        text: '我已阅读',
                        color: 'red',
                        type: 'cash'
                  }]
            }).then(() => {
                  // console.log('=== dialog resolve ===', 'type: confirm');
            });
      },

      /**
       * 已阅读
       */
      toggleSetRead: function() {
            this.setData({
                  is_read: !this.data.is_read
            });
      },

      /**
       * 提交申请 
       */
      formSubmit: function(e) {
            let _this = this,
                  values = e.detail.value;
            //console.log(values);
            // 记录formId
            App.saveFormId(e.detail.formId);

            // 验证姓名
            if (!values.real_name || values.real_name.length < 1) {
                  App.showError('请填写联系人');
                  return false;
            }
            if (!values.location || values.location.length < 1) {
                  App.showError('请选择地理位置');
                  return false;
            }
            if (!values.address || values.address.length < 1) {
                  App.showError('请填写小区名称');
                  return false;
            }
            // 验证手机号
            if (!/^\+?\d[\d -]{8,12}\d/.test(values.mobile)) {
                  App.showError('手机号格式不正确');
                  return false;
            }
            if (!values.intro || values.intro.length < 1) {
                  App.showError('请填写简介');
                  return false;
            }
            if (!values.open_time || values.open_time.length < 1) {
                  App.showError('请填写营业时间');
                  return false;
            }
            // 验证是否阅读协议
            if (!_this.data.is_read) {
                  App.showError('请先阅读团长申请协议');
                  return false;
            }
            if (!_this.data.region) {
                  App.showError('请选择省市区');
                  return false;
            }
            values.region = _this.data.region.join(',');
            if (!_this.data.logo_path) {
                  App.showError('请上传LOGO');
                  return false;
            }
            values.referee_id = (_this.getRefereeid() ? _this.getRefereeid() : 0);
            wx.uploadFile({
                  url: App.api_root + 'upload/image',
                  filePath: _this.data.logo_path,
                  name: 'iFile',
                  formData: {
                        wxapp_id: App.getWxappId(),
                        token: wx.getStorageSync('token')
                  },
                  success: function(res) {
                        let result = typeof res.data === "object" ? res.data : JSON.parse(res.data);
                        //console.log(result);
                        if (result.data.file_id) {
                              values.image_id = result.data.file_id;
                              // 按钮禁用
                              _this.setData({
                                    disabled: true
                              });

                              // 数据提交
                              App._post_form('shop.apply/submit', values, function() {
                                    // 获取门店申请状态
                                    _this.getApplyState();
                              }, null, function() {
                                    // 解除按钮禁用
                                    _this.setData({
                                          disabled: false
                                    });
                              });
                        } else {
                              App.showError('上传LOGO失败');
                              return false;
                        }
                  }

            });

      },

      /**
       * 去商城逛逛
       */
      navigationToIndex: function(e) {
            // 记录formId
            App.saveFormId(e.detail.formId);
            // 跳转到首页
            wx.switchTab({
                  url: '/pages/index/index',
            })
      },

      /**
       * 获取推荐人id
       */
      getRefereeid: function() {
            return wx.getStorageSync('referee_id');
      },
      callBackCropper: function(url) {
            this.setData({
                  logo_path: url
            });
      }
})