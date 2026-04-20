const { generateReportPackage, formatTime } = require('../../utils/report-generator.js');

Page({
  data: {
    mark: null,
    clipData: null,
    violationType: '',
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

  onViolationTypeChange(e) {
    this.setData({ violationType: e.detail.id });
  },

  onRoadNameInput(e) {
    this.setData({ roadNameEditable: e.detail.value });
  },

  generatePackage() {
    if (!this.data.violationType) {
      wx.showToast({ title: '请选择违法类型', icon: 'none' });
      return;
    }

    if (!this.data.roadNameEditable || this.data.roadNameEditable.trim().length === 0) {
      wx.showToast({ title: '请输入道路名称', icon: 'none' });
      return;
    }

    try {
      const report = generateReportPackage(
        this.data.clipData,
        { ...this.data.mark, roadName: this.data.roadNameEditable.trim() },
        this.data.violationType
      );

      const app = getApp();
      app.globalData.report = report;
      wx.navigateTo({ url: '/pages/result/result' });
    } catch (e) {
      wx.showToast({ title: '生成举报包失败', icon: 'none' });
    }
  }
});
