const mockData = require('../../mock/mock-data.js');

Page({
  data: {
    markIndex: 0,
    currentMark: null,
    video1Src: '',
    video1Start: 0,
    video2Src: '',
    video2Start: 0,
    clipStart: 0,
    clipEnd: 300,
    bufferBefore: 3,
    activeVideo: 1,
    marks: []
  },

  onLoad() {
    const app = getApp();
    const marks = app.globalData.marks || mockData.marks;
    this.setData({ marks });
    this.loadMark(0);
  },

  loadMark(index) {
    const marks = this.data.marks;
    if (index >= marks.length) {
      wx.showToast({ title: '没有更多标记', icon: 'none' });
      return;
    }

    const mark = marks[index];
    const video1File = mark.videoFile;
    const video2File = this.getNextVideoFile(mark);

    this.setData({
      markIndex: index,
      currentMark: mark,
      video1Src: `/${video1File}`,
      video2Src: video2File ? `/${video2File}` : '',
      clipStart: Math.max(0, this.timeToSeconds(mark.timestamp) - this.data.bufferBefore),
      clipEnd: Math.min(this.timeToSeconds(mark.timestamp) + 30, this.clipStart + 60)
    });
  },

  getNextVideoFile(mark) {
    if (mark.offset > 250) {
      return 'record_002.mp4';
    }
    return '';
  },

  timeToSeconds(timestamp) {
    const t = new Date(timestamp);
    return t.getHours() * 3600 + t.getMinutes() * 60 + t.getSeconds();
  },

  onClipStartChange(e) {
    this.setData({ clipStart: Number(e.detail.value) });
  },

  onClipEndChange(e) {
    this.setData({ clipEnd: Number(e.detail.value) });
  },

  onBufferBeforeChange(e) {
    this.setData({ bufferBefore: Number(e.detail.value) });
    const mark = this.data.currentMark;
    if (mark) {
      this.setData({
        clipStart: Math.max(0, this.timeToSeconds(mark.timestamp) - this.data.bufferBefore)
      });
    }
  },

  prevMark() {
    if (this.data.markIndex > 0) {
      this.loadMark(this.data.markIndex - 1);
    }
  },

  nextMark() {
    this.loadMark(this.data.markIndex + 1);
  },

  goToConfirm() {
    const { currentMark, clipStart, clipEnd, bufferBefore } = this.data;
    const app = getApp();
    app.globalData.clipParams = {
      mark: currentMark,
      clipStart,
      clipEnd,
      bufferBefore
    };
    wx.navigateTo({ url: '/pages/confirm/confirm' });
  }
});
