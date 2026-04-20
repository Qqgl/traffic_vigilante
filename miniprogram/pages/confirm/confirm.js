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
    const { mark, clipStart, clipEnd } = app.globalData.clipParams;
    this.setData({
      mark,
      clipData: { clipStart, clipEnd },
      roadNameEditable: mark.roadName,
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

    const report = generateReportPackage(
      this.data.clipData,
      { ...this.data.mark, roadName: this.data.roadNameEditable },
      this.data.violationType
    );

    const app = getApp();
    app.globalData.report = report;
    wx.navigateTo({ url: '/pages/result/result' });
  }
});
