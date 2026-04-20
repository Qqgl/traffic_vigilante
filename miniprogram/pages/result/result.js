Page({
  data: {
    reportId: '',
    violationType: '',
    roadName: '',
    hasReport: false
  },

  onLoad() {
    const app = getApp();
    const report = app.globalData.report;

    if (report && report.info) {
      this.setData({
        reportId: report.info.reportId || '',
        violationType: report.info.violationType || '',
        roadName: report.info.roadName || '',
        hasReport: true
      });
    } else {
      wx.showToast({ title: '没有举报包数据', icon: 'none' });
      wx.navigateBack();
    }
  },

  jumpTo12123() {
    const app = getApp();
    const report = app.globalData.report;

    if (!report || !report.info) {
      wx.showToast({ title: '举报包数据丢失', icon: 'none' });
      return;
    }

    // Sanitize data to prevent formatting issues
    const sanitize = (str) => String(str || '').replace(/\n/g, ' ').trim();

    wx.setClipboardData({
      data: `举报编号：${sanitize(report.info.reportId)}
违法类型：${sanitize(report.info.violationType)}
发生地点：${sanitize(report.info.roadName)}
发生时间：${sanitize(report.info.occurredAt)}
裁剪片段：${sanitize(report.info.clipStart)}s - ${sanitize(report.info.clipEnd)}s`,
      success: () => {
        wx.showModal({
          title: '提示',
          content: '举报信息已复制，请打开12123 App上传视频和相关信息',
          confirmText: '我知道了'
        });
      },
      fail: () => {
        wx.showToast({ title: '复制失败，请手动复制', icon: 'none' });
      }
    });
  },

  downloadPackage() {
    // Placeholder - actual download not yet implemented
    wx.showToast({ title: '下载功能开发中', icon: 'none' });
  }
});
