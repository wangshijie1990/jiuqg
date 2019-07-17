const App = getApp();

// 工具类
import util from '../../../utils/util.js';

// 倒计时插件
import CountDown from '../../../utils/countdown.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 当前tab索引
    currentTab: 0,

    // 列表容器高度
    scrollHeight: null,

    // 列表容器滚动的位置
    scrollTop: 0,

    noMore: false, // 没有更多数据
    isLoading: true, // 是否正在加载中
    page: 1, // 当前页码

    // 时间记录
    countDownList: [],

    // 砍价会场商品列表
    activeList: [],

    // 我的砍价列表
    myList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;
    // 设置scroll-view高度
    _this._setListHeight();
    // 设置当前tab索引
    _this._setCurrentTab(options);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let _this = this;
    if (_this.data.scrollTop == 0) {
      // 获取列表数据
      _this._getList();
    }
  },

  /**
   * 设置当前tab索引
   */
  _setCurrentTab(options) {
    let _this = this;
    if (options.hasOwnProperty('tab')) {
      _this.setData({
        currentTab: options.tab
      });
    }
  },

  /**
   * 设置商品列表高度
   */
  _setListHeight() {
    let _this = this;
    let systemInfo = wx.getSystemInfoSync(),
      rpx = systemInfo.windowWidth / 750, // 计算rpx
      tapHeight = Math.floor(rpx * (92 + 20)), // tap高度
      scrollHeight = systemInfo.windowHeight - tapHeight; // swiper高度
    _this.setData({
      scrollHeight
    });
  },

  /**
   * 获取砍价活动列表
   */
  getActiveList(isPage) {
    let _this = this;
    App._get('bargain.active/lists', {
      page: _this.data.page || 1,
    }, (result) => {
      let resList = result.data.activeList,
        dataList = _this.data.activeList;
      if (isPage == true) {
        _this.setData({
          'activeList.data': dataList.data.concat(resList.data),
          isLoading: false,
        });
      } else {
        _this.setData({
          activeList: resList,
          isLoading: false,
        });
      }
    });
  },

  /**
   * 获取我的砍价列表
   */
  getMyList(isPage) {
    let _this = this;
    App._get('bargain.task/lists', {
      page: _this.data.page || 1,
    }, (result) => {
      let resList = result.data.myList,
        dataList = _this.data.myList;
      if (isPage == true) {
        _this.setData({
          'myList.data': dataList.data.concat(resList.data),
          isLoading: false,
        });
      } else {
        _this.setData({
          myList: resList,
          isLoading: false,
        });
      }
      // 初始化倒计时组件
      _this._initCountDownData(result.data);
    });
  },

  /**
   * 初始化倒计时组件
   */
  _initCountDownData(data) {
    let _this = this;
    // 记录活动到期时间
    let countDownList = _this.data.countDownList;
    data.myList.data.forEach((item) => {
      countDownList.push({
        date: item.end_time,
      });
    });
    _this.setData({
      countDownList,
    });
    // 执行倒计时
    if (countDownList.length > 0) {
      CountDown.onSetTimeList(_this, 'countDownList');
    }
  },

  /**
   * 记录滚动的位置
   */
  onScrollEvent(e) {
    let _this = this;
    _this.setData({
      scrollTop: e.detail.scrollTop
    })
  },

  /**
   * 切换tabbar
   */
  onToggleTab(e) {
    let _this = this;
    // 保存formid
    App.saveFormId(e.detail.formId);
    // 设置当前tabbar索引，并重置数据
    _this.setData({
      currentTab: e.currentTarget.dataset.index,
      activeList: [],
      myList: [],
      page: 1,
      isLoading: true,
      noMore: false,
    });
    // 获取列表数据
    _this._getList();
  },

  /**
   * 跳转到砍价商品详情
   */
  onTargetActive(e) {
    // 保存formid
    App.saveFormId(e.detail.formId);
    wx.navigateTo({
      url: `../goods/index?active_id=${e.detail.target.dataset.id}`,
    })
  },

  /**
   * 跳转到砍价商品详情
   */
  onTargetTask(e) {
    // 保存formid
    App.saveFormId(e.detail.formId);
    wx.navigateTo({
      url: `../task/index?task_id=${e.detail.target.dataset.id}`,
    })
  },

  /**
   * 下拉到底部加载下一页
   */
  onScrollToLower() {
    let _this = this,
      listData = _this.data.currentTab == 0 ? _this.data.activeList : _this.data.myList;
    // 已经是最后一页
    if (_this.data.page >= listData.last_page) {
      _this.setData({
        noMore: true
      });
      return false;
    }
    // 加载下一页列表
    _this.setData({
      page: ++_this.data.page
    });
    _this._getList(true);
  },

  /**
   * 获取列表数据
   */
  _getList(isPage) {
    let _this = this;
    _this.data.currentTab == 0 ? _this.getActiveList(isPage) : _this.getMyList(isPage);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    let _this = this;
    // 构建页面参数
    let params = App.getShareUrlParams();
    return {
      title: '砍价专区',
      path: `/pages/bargain/index/index?${params}`
    };
  },

})