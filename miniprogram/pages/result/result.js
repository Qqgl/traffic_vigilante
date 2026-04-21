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
    wx.showToast({ title: '请在微信搜索"蓉e行"公众号并上传视频', icon: 'none' });
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