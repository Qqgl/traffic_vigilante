Page({
  data: {
    exportSuccess: false,
    roadName: '',
    clipTimeRange: '',
    timestamp: ''
  },

  onLoad() {
    const app = getApp();
    const exportInfo = app.globalData.exportInfo;

    if (exportInfo) {
      const { roadName, clipStart, clipEnd, timestamp } = exportInfo;
      this.setData({
        exportSuccess: true,
        roadName: roadName,
        clipTimeRange: `${this.formatTime(clipStart)} - ${this.formatTime(clipEnd)}`,
        timestamp: timestamp
      });
    }
  },

  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  },

  jumpToRongEXing() {
    // 成都蓉e行公众号链接，实际使用时替换为正确的链接
    wx.showToast({ title: '请在微信搜索"蓉e行"公众号', icon: 'none' });
  },

  goHome() {
    wx.navigateBack({
      delta: 4,
      fail: () => {
        wx.reLaunch({ url: '/pages/index/index' });
      }
    });
  }
});