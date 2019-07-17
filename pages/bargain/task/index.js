const App = getApp();

// 工具类
import util from '../../../utils/util.js';

// 倒计时插件
import CountDown from '../../../utils/countdown.js';

// 对话框插件
import Dialog from '../../../components/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 砍价任务倒计时
    taskEndTime: [],

    task: {}, // 砍价任务详情
    active: {}, // 活动详情
    goods: {}, // 商品详情
    help_list: [], // 好友助力榜

    is_creater: false, // 是否为当前砍价任务的发起人
    is_cut: false, // 当前是否已砍
    setting: {}, // 砍价规则

    showBuyBtn: false, // 立即购买
    showShareBtn: false, // 邀请好友砍价
    showCatBtn: false, // 帮TA砍一刀
    showOtherBtn: false, // 查看其他砍价活动

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;
    // 砍价任务id
    _this.setData({
      task_id: options.task_id
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let _this = this;
    // 获取砍价任务详情
    _this.getTaskDetail();
  },

  /**
   * 获取砍价任务详情
   */
  getTaskDetail() {
    let _this = this;
    App._get('bargain.task/detail', {
      task_id: _this.data.task_id
    }, (result) => {
      // 初始化页面数据
      _this._initData(result.data);
    });
  },

  /**
   * 初始化页面数据
   */
  _initData(data) {
    let _this = this;
    // 初始化：显示操作按钮
    _this._initShowBtn(data);
    // 记录活动到期时间
    data.taskEndTime = [{
      date: data.task.end_time
    }];
    _this.setData(data);
    // 执行倒计时
    if (!data.task.is_end) {
      CountDown.onSetTimeList(_this, 'taskEndTime');
    }
  },

  /**
   * 初始化：显示操作按钮
   */
  _initShowBtn(data) {
    let _this = this,
      // 立即购买
      showBuyBtn = data.is_creater && !data.task.is_buy && data.task.status && (!data.active.is_floor_buy || data.task.is_floor),
      // 帮砍一刀
      showCatBtn = !data.is_creater && !data.is_cut && !data.task.is_floor && data.task.status,
      // 邀请好友砍价
      showShareBtn = !showCatBtn && !data.task.is_floor && data.task.status,
      // 查看其他砍价活动
      showOtherBtn = !showBuyBtn && !showShareBtn && !showCatBtn;
    _this.setData({
      showBuyBtn,
      showShareBtn,
      showCatBtn,
      showOtherBtn,
    });
  },

  /**
   * 跳转到首页
   */
  onTargetHome(e) {
    // 记录formid
    App.saveFormId(e.detail.formId);
    wx.switchTab({
      url: '../../index/index',
    })
  },

  /**
   * 显示砍价规则
   */
  onToggleRules(e) {
    // 记录formId
    App.saveFormId(e.detail.formId);
    // 显示砍价规则
    let _this = this;
    Dialog({
      title: '砍价规则',
      message: _this.data.setting.bargain_rules,
      selector: '#zan-base-dialog',
      isScroll: true, // 滚动
      buttons: [{
        text: '关闭',
        color: 'red',
        type: 'cash'
      }]
    });
  },

  /**
   * 跳转到商品详情
   */
  onTargetGoods(e) {
    let _this = this;
    // 记录formid
    App.saveFormId(e.detail.formId);
    wx.navigateTo({
      url: `../goods/index?active_id=${_this.data.task.active_id}`,
    })
  },

  /**
   * 跳转到砍价首页
   */
  onTargetBargain(e) {
    // 记录formid
    App.saveFormId(e.detail.formId);
    wx.navigateTo({
      url: '../index/index',
    })
  },

  /**
   * 帮砍一刀
   */
  onHelpCut(e) {
    let _this = this;
    // 记录formId
    App.saveFormId(e.detail.formId);
    // 按钮禁用
    _this.setData({
      disabled: true
    });
    // 提交到后端
    App._post_form('bargain.task/help_cut', {
      task_id: _this.data.task_id
    }, result => {
      App.showSuccess(result.msg, function() {
        wx.navigateBack();
      });
      // 获取砍价任务详情
      _this.getTaskDetail();
    }, false, () => {
      // 解除禁用
      _this.setData({
        disabled: false
      });
    });
  },

  /**
   * 立即购买
   */
  onCheckout(e) {

    let _this = this;

    // 记录formId
    App.saveFormId(e.detail.formId);

    // 跳转到结算台
    let option = util.urlEncode({
      order_type: 'bargain',
      task_id: _this.data.task.task_id,
      goods_sku_id: _this.data.task.spec_sku_id,
    });
    wx.navigateTo({
      url: `../../flow/checkout?${option}`
    });

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    let _this = this;
    // 构建页面参数
    let params = App.getShareUrlParams({
      task_id: _this.data.task_id
    });
    return {
      title: _this.data.active.share_title,
      path: `/pages/bargain/task/index?${params}`
    };
  },

})