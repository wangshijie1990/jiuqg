// pages/cropper/index.js
Page({
      data: {
            src: '',
            width: 200,//宽度
            height: 200,//高度
      },
      onLoad: function (options) {
            if (!options.image_path){
                  wx.navigateBack();
                  return false;
            }
            //获取到image-cropper对象
            this.cropper = this.selectComponent("#image-cropper");
            //开始裁剪
            this.setData({
                  src: options.image_path,
            });
            wx.showLoading({
                  title: '加载中'
            })
      },
      cropperload(e) {
            //console.log("cropper初始化完成");
      },
      loadimage(e) {
            //console.log("图片加载完成", e.detail);
            wx.hideLoading();
            //重置图片角度、缩放、位置
            this.cropper.imgReset();
      },
      clickcut(e) {
            console.log(e.detail);
            try{
                  let pages = getCurrentPages();
                  pages[pages.length-2].callBackCropper(e.detail.url);
            }
            catch(e){

            }
            wx.navigateBack();
      },
})