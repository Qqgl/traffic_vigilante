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

    // Compute new values first
    const newClipStart = Math.max(0, this.timeToSeconds(mark.timestamp) - this.data.bufferBefore);
    const newClipEnd = Math.min(this.timeToSeconds(mark.timestamp) + 30, newClipStart + 60);

    this.setData({
      markIndex: index,
      currentMark: mark,
      video1Src: `/${video1File}`,
      video2Src: video2File ? `/${video2File}` : '',
      clipStart: newClipStart,
      clipEnd: newClipEnd
    });
  },

  getNextVideoFile(mark) {
    // In production, this should determine the next video file based on the video file list
    // For now, if offset indicates near end of current video, return next file
    // The actual implementation would check the videoFiles array from mock data or API
    if (mark.offset > 250 && mark.videoFile) {
      // Try to find next video file based on naming convention
      // This is a simplified version - real implementation would use actual file list
      return '';
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
    const newEnd = Number(e.detail.value);
    if (newEnd <= this.data.clipStart) {
      wx.showToast({ title: '结束时间必须大于开始时间', icon: 'none' });
      return;
    }
    this.setData({ clipEnd: newEnd });
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
