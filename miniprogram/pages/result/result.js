Page({
  data: {
    reportId: '',
    violationType: '',
    roadName: '',
    canJumpTo12123: false
  },

  onLoad() {
    const app = getApp();
    const report = app.globalData.report;

    if (report) {
      this.setData({
        reportId: report.info.reportId,
        violationType: report.info.violationType,
        roadName: report.info.roadName
      });

      this.check12123();
    } else {
      wx.showToast({ title: '没有举报包数据', icon: 'none' });
      wx.navigateBack();
    }
  },

  check12123() {
    this.setData({ canJumpTo12123: true });
  },

  jumpTo12123() {
    const app = getApp();
    const report = app.globalData.report;

    if (!report) {
      wx.showToast({ title: '举报包数据丢失', icon: 'none' });
      return;
    }

    wx.setClipboardData({
      data: `举报编号：${report.info.reportId}
违法类型：${report.info.violationType}
发生地点：${report.info.roadName}
发生时间：${report.info.occurredAt}
裁剪片段：${report.info.clipStart}s - ${report.info.clipEnd}s`,
      success: () => {
        wx.showModal({
          title: '提示',
          content: '举报信息已复制，请打开12123 App上传视频和相关信息',
          confirmText: '我知道了'
        });
      }
    });
  },

  downloadPackage() {
    wx.showToast({ title: '举报包已生成，请在文件中查看', icon: 'none' });
  }
});