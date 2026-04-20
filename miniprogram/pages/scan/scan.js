Page({
  onLoad() {
    wx.scanCode({
      success: (res) => {
        try {
          const data = JSON.parse(res.result);
          const app = getApp();
          app.globalData.marks = data.marks || [];
          wx.showToast({ title: '接收成功', icon: 'success' });
        } catch (e) {
          wx.showToast({ title: '无效的二维码', icon: 'none' });
        }
        wx.navigateBack();
      },
      fail: () => {
        wx.showToast({ title: '扫码取消', icon: 'none' });
        wx.navigateBack();
      }
    });
  }
});
