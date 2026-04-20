const mockData = require('../../mock/mock-data.js');

Page({
  data: {
    hasMarks: false,
    marks: []
  },

  onLoad() {
    const app = getApp();
    if (app.globalData && app.globalData.marks) {
      this.setData({ hasMarks: true, marks: app.globalData.marks });
    }
  },

  goToScan() {
    wx.scanCode({
      success: (res) => {
        if (!res.result) {
          wx.showToast({ title: '扫码结果为空', icon: 'none' });
          return;
        }
        try {
          const data = JSON.parse(res.result);
          getApp().globalData.marks = data.marks;
          this.setData({ hasMarks: true, marks: data.marks });
          wx.showToast({ title: '接收成功', icon: 'success' });
        } catch (e) {
          wx.showToast({ title: '数据解析失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '扫码失败', icon: 'none' });
      }
    });
  },

  useMockData() {
    getApp().globalData.marks = mockData.marks;
    this.setData({ hasMarks: true, marks: mockData.marks });
    wx.showToast({ title: '已加载模拟数据', icon: 'success' });
  },

  goToClip() {
    if (!this.data.hasMarks) {
      wx.showToast({ title: '请先扫码或加载模拟数据', icon: 'none' });
      return;
    }
    wx.navigateTo({ url: '/pages/clip/clip' });
  }
});