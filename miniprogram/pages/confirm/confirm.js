const { formatTime } = require('../../utils/report-generator.js');

Page({
  data: {
    mark: null,
    clipData: null,
    roadNameEditable: '',
    clipStartFormatted: '',
    clipEndFormatted: ''
  },

  onLoad() {
    const app = getApp();
    const clipParams = app.globalData.clipParams;

    if (!clipParams || !clipParams.mark) {
      wx.showToast({ title: '请先选择视频片段', icon: 'none' });
      wx.navigateBack();
      return;
    }

    const { mark, clipStart, clipEnd } = clipParams;
    this.setData({
      mark,
      clipData: { clipStart, clipEnd },
      roadNameEditable: mark.roadName || '',
      clipStartFormatted: formatTime(clipStart),
      clipEndFormatted: formatTime(clipEnd)
    });
  },

  onRoadNameInput(e) {
    this.setData({ roadNameEditable: e.detail.value });
  },

  exportVideo() {
    const { roadNameEditable } = this.data;
    if (!roadNameEditable || roadNameEditable.trim().length === 0) {
      wx.showToast({ title: '请输入道路名称', icon: 'none' });
      return;
    }

    const app = getApp();
    app.globalData.exportInfo = {
      roadName: roadNameEditable.trim(),
      clipStart: this.data.clipData.clipStart,
      clipEnd: this.data.clipData.clipEnd,
      timestamp: this.data.mark.timestamp
    };

    wx.showToast({ title: '视频已导出到相册', icon: 'success' });
    wx.navigateTo({ url: '/pages/result/result' });
  }
});