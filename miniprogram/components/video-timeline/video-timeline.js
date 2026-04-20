Component({
  properties: {
    videoSrc: String,
    duration: Number,
    startTime: {
      type: Number,
      value: 0
    },
    endTime: {
      type: Number,
      value: 0
    }
  },

  data: {
    currentTime: 0,
    sliderLeft: 0,
    bufferWidth: 0
  },

  methods: {
    onVideoTimeUpdate(e) {
      if (!this.data.duration || this.data.duration <= 0) return;
      this.setData({ currentTime: e.detail.currentTime });
      const percent = (e.detail.currentTime / this.data.duration) * 100;
      this.setData({ sliderLeft: percent + '%' });
    },

    onSliderChange(e) {
      if (!this.data.duration || this.data.duration <= 0) return;
      const value = e.detail.value;
      const time = (value / 100) * this.data.duration;
      this.triggerEvent('timechange', { time, type: 'seek' });
    },

    setClipRange(start, end) {
      if (!this.data.duration || this.data.duration <= 0) return;
      if (start < 0 || end > this.data.duration || start >= end) return;
      const startPercent = (start / this.data.duration) * 100;
      const endPercent = (end / this.data.duration) * 100;
      this.setData({
        clipStart: startPercent,
        clipEnd: endPercent
      });
    }
  }
});
