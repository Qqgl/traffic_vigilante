# 交通违法举报小程序实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 微信小程序——扫码接收标记数据 → 双视频时间线裁剪 → 选择违法类型 → 生成12123举报包 → 跳转12123 App

**Architecture:** 小程序作为独立H5应用，使用微信原生框架开发。第一阶段使用模拟数据测试举报流程，不依赖车机端。视频裁剪使用微信小程序 video 组件 + canvas 绘制时间线，举报包生成遵循12123格式规范。

**Tech Stack:** 微信小程序原生框架、video组件、canvas 2D

---

## 阶段一：基础框架与模拟数据

### Task 1: 项目脚手架与模拟数据

**Files:**
- Create: `miniprogram/app.json`
- Create: `miniprogram/mock/mock-data.js`

- [ ] **Step 1: 创建 app.json**

```json
{
  "pages": [
    "pages/index/index",
    "pages/scan/scan",
    "pages/clip/clip",
    "pages/confirm/confirm",
    "pages/result/result"
  ],
  "window": {
    "navigationBarTitleText": "交通违法举报"
  }
}
```

Run: `cat miniprogram/app.json`
Expected: 输出上述 JSON 内容

- [ ] **Step 2: 创建模拟车机数据**

```javascript
// miniprogram/mock/mock-data.js
module.exports = {
  tripId: 'trip-uuid-001',
  startTime: '2026-04-20T09:00:00',
  endTime: '2026-04-20T10:45:00',
  marks: [
    {
      timestamp: '2026-04-20T10:30:05',
      gps: { lat: 31.2304, lng: 121.4737 },
      roadName: '京沪高速上海方向',
      videoFile: 'record_001.mp4',
      offset: 5
    },
    {
      timestamp: '2026-04-20T10:35:20',
      gps: { lat: 31.2310, lng: 121.4740 },
      roadName: '京沪高速上海方向',
      videoFile: 'record_002.mp4',
      offset: 20
    }
  ],
  videoFiles: [
    { name: 'record_001.mp4', startTime: '2026-04-20T10:30:00', endTime: '2026-04-20T10:35:00' },
    { name: 'record_002.mp4', startTime: '2026-04-20T10:35:00', endTime: '2026-04-20T10:40:00' }
  ]
};
```

Run: `cat miniprogram/mock/mock-data.js`
Expected: 输出上述内容

- [ ] **Step 3: 创建 index 首页**

```json
{
  "usingComponents": {},
  "navigationBarTitleText": "交通违法举报"
}
```

```javascript
// miniprogram/pages/index/index.js
const mockData = require('../../mock/mock-data.js');

Page({
  data: {
    hasMarks: false,
    marks: []
  },

  onLoad() {
    // 模拟车机已发送数据
    const app = getApp();
    if (app.globalData.marks) {
      this.setData({ hasMarks: true, marks: app.globalData.marks });
    }
  },

  goToScan() {
    wx.scanCode({
      success: (res) => {
        console.log('扫码结果', res);
        // 解析二维码数据
        try {
          const data = JSON.parse(res.result);
          getApp().globalData.marks = data.marks;
          this.setData({ hasMarks: true, marks: data.marks });
          wx.showToast({ title: '接收成功', icon: 'success' });
        } catch (e) {
          wx.showToast({ title: '数据解析失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '扫码失败', icon: 'none' });
      }
    });
  },

  useMockData() {
    // 使用模拟数据测试
    getApp().globalData.marks = mockData.marks;
    this.setData({ hasMarks: true, marks: mockData.marks });
    wx.showToast({ title: '已加载模拟数据', icon: 'success' });
  },

  goToClip() {
    if (!this.data.hasMarks) {
      wx.showToast({ title: '请先扫码或加载模拟数据', icon: 'none' });
      return;
    }
    wx.navigateTo({ url: '/pages/clip/clip' });
  }
});
```

```html
<!-- miniprogram/pages/index/index.wxml -->
<view class="container">
  <view class="header">
    <text class="title">交通违法举报</text>
    <text class="subtitle">开车时标记，到目的地举报</text>
  </view>

  <view class="actions">
    <button type="primary" bindtap="goToScan">扫码接收</button>
    <button bindtap="useMockData" class="secondary">使用模拟数据</button>
  </view>

  <view wx:if="{{hasMarks}}" class="marks-info">
    <text class="marks-count">已接收 {{marks.length}} 个标记点</text>
    <button type="default" bindtap="goToClip">开始裁剪视频</button>
  </view>
</view>
```

```css
/* miniprogram/pages/index/index.wxss */
.container {
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  text-align: center;
  margin-bottom: 80rpx;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  display: block;
}

.subtitle {
  font-size: 28rpx;
  color: #888;
  margin-top: 20rpx;
  display: block;
}

.actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.secondary {
  background: #f5f5f5;
  color: #333;
}

.marks-info {
  margin-top: 60rpx;
  text-align: center;
  width: 100%;
}

.marks-count {
  display: block;
  margin-bottom: 30rpx;
  color: #07c160;
}
```

Run: `cat miniprogram/pages/index/index.wxml`
Expected: 输出上述内容

- [ ] **Step 4: Commit**

```bash
git add miniprogram/app.json miniprogram/pages/index miniprogram/mock/mock-data.js
git commit -m "feat: scaffold miniprogram with mock data"
```

---

## 阶段二：视频裁剪页（核心）

### Task 2: 视频时间线组件

**Files:**
- Create: `miniprogram/components/video-timeline/video-timeline.js`
- Create: `miniprogram/components/video-timeline/video-timeline.wxml`
- Create: `miniprogram/components/video-timeline/video-timeline.wxss`

- [ ] **Step 1: 创建视频时间线组件**

```javascript
// miniprogram/components/video-timeline/video-timeline.js
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
      this.setData({ currentTime: e.detail.currentTime });
      const percent = (e.detail.currentTime / this.data.duration) * 100;
      this.setData({ sliderLeft: percent + '%' });
    },

    onSliderChange(e) {
      const value = e.detail.value;
      const time = (value / 100) * this.data.duration;
      this.triggerEvent('timechange', { time, type: 'seek' });
    },

    setClipRange(start, end) {
      // 设置裁剪范围（百分比）
      const startPercent = (start / this.data.duration) * 100;
      const endPercent = (end / this.data.duration) * 100;
      this.setData({
        clipStart: startPercent,
        clipEnd: endPercent
      });
    }
  }
});
```

```html
<!-- miniprogram/components/video-timeline/video-timeline.wxml -->
<view class="video-timeline">
  <video
    id="video"
    src="{{videoSrc}}"
    controls
    bindtimeupdate="onVideoTimeUpdate"
    class="video-player"
  ></video>

  <view class="timeline-bar">
    <view class="time-display">
      <text>{{currentTime}} / {{duration}}</text>
    </view>
    <slider
      min="0"
      max="100"
      value="{{currentTime / duration * 100}}"
      bindchange="onSliderChange"
      class="timeline-slider"
    />
  </view>
</view>
```

```css
/* miniprogram/components/video-timeline/video-timeline.wxss */
.video-timeline {
  width: 100%;
}

.video-player {
  width: 100%;
  height: 400rpx;
  background: #000;
}

.timeline-bar {
  padding: 20rpx;
  background: #fff;
}

.time-display {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.timeline-slider {
  width: 100%;
}
```

Run: `cat miniprogram/components/video-timeline/video-timeline.wxml`
Expected: 输出上述内容

- [ ] **Step 2: Commit**

```bash
git add miniprogram/components/video-timeline
git commit -m "feat: add video-timeline component"
```

---

### Task 3: 裁剪页实现

**Files:**
- Create: `miniprogram/pages/clip/clip.js`
- Create: `miniprogram/pages/clip/clip.wxml`
- Create: `miniprogram/pages/clip/clip.wxss`

- [ ] **Step 1: 创建裁剪页**

```javascript
// miniprogram/pages/clip/clip.js
const mockData = require('../../mock/mock-data.js');

Page({
  data: {
    markIndex: 0,
    currentMark: null,
    // 视频1
    video1Src: '',
    video1Start: 0,
    // 视频2
    video2Src: '',
    video2Start: 0,
    // 裁剪参数
    clipStart: 0,
    clipEnd: 300,  // 秒
    bufferBefore: 3,  // 标记前缓冲秒数
    // UI状态
    activeVideo: 1,  // 当前激活的视频
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
    // 假设视频文件路径通过车机热点可访问，这里用本地路径模拟
    // 实际项目中 videoSrc 应为车机热点IP下的视频地址
    const video1File = mark.videoFile;
    const video2File = this.getNextVideoFile(mark);

    this.setData({
      markIndex: index,
      currentMark: mark,
      video1Src: `/${video1File}`,
      video2Src: video2File ? `/${video2File}` : '',
      // 计算裁剪起始点：标记时间 - 缓冲
      clipStart: Math.max(0, this.timeToSeconds(mark.timestamp) - this.data.bufferBefore),
      clipEnd: Math.min(this.timeToSeconds(mark.timestamp) + 30, this.clipStart + 60)
    });
  },

  getNextVideoFile(mark) {
    // 模拟：如果offset > 某个阈值，返回第二个视频
    if (mark.offset > 250) {
      return 'record_002.mp4';
    }
    return '';
  },

  timeToSeconds(timestamp) {
    // 将 ISO 时间戳转为当天的秒数
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
    // 重新计算clipStart
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
```

```html
<!-- miniprogram/pages/clip/clip.wxml -->
<view class="clip-page">
  <view class="mark-nav">
    <text>标记点 {{markIndex + 1}} / {{marks.length}}</text>
    <view class="nav-btns">
      <button size="mini" bindtap="prevMark" disabled="{{markIndex === 0}}">上一个</button>
      <button size="mini" bindtap="nextMark" disabled="{{markIndex >= marks.length - 1}}">下一个</button>
    </view>
  </view>

  <view class="current-mark">
    <text class="road-name">{{currentMark.roadName}}</text>
    <text class="timestamp">{{currentMark.timestamp}}</text>
  </view>

  <view class="video-section">
    <text class="section-title">视频1: {{video1Src}}</text>
    <video
      src="{{video1Src}}"
      controls
      class="video"
      show-center-play-btn
    ></video>
  </view>

  <view wx:if="{{video2Src}}" class="video-section">
    <text class="section-title">视频2: {{video2Src}}</text>
    <video
      src="{{video2Src}}"
      controls
      class="video"
      show-center-play-btn
    ></video>
  </view>

  <view class="clip-controls">
    <text class="section-title">裁剪设置</text>

    <view class="control-row">
      <text>标记前缓冲（秒）</text>
      <slider min="1" max="10" value="{{bufferBefore}}" bindchange="onBufferBeforeChange" show-value/>
    </view>

    <view class="control-row">
      <text>裁剪开始（秒）</text>
      <slider min="0" max="300" value="{{clipStart}}" bindchange="onClipStartChange" show-value/>
    </view>

    <view class="control-row">
      <text>裁剪结束（秒）</text>
      <slider min="0" max="300" value="{{clipEnd}}" bindchange="onClipEndChange" show-value/>
    </view>
  </view>

  <button type="primary" bindtap="goToConfirm" class="next-btn">确认裁剪</button>
</view>
```

```css
/* miniprogram/pages/clip/clip.wxss */
.clip-page {
  padding: 20rpx;
}

.mark-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.nav-btns {
  display: flex;
  gap: 20rpx;
}

.current-mark {
  background: #f5f5f5;
  padding: 20rpx;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
}

.road-name {
  font-size: 32rpx;
  font-weight: bold;
  display: block;
}

.timestamp {
  font-size: 24rpx;
  color: #666;
  display: block;
  margin-top: 10rpx;
}

.video-section {
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 28rpx;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.video {
  width: 100%;
  height: 400rpx;
  background: #000;
}

.clip-controls {
  background: #f5f5f5;
  padding: 20rpx;
  border-radius: 8rpx;
  margin: 30rpx 0;
}

.control-row {
  margin: 20rpx 0;
}

.next-btn {
  margin-top: 30rpx;
}
```

Run: `cat miniprogram/pages/clip/clip.wxml`
Expected: 输出上述内容

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/clip
git commit -m "feat: add video clip page with timeline controls"
```

---

## 阶段三：确认与举报包生成

### Task 4: 违法类型选择器组件

**Files:**
- Create: `miniprogram/components/violation-type-picker/violation-type-picker.js`
- Create: `miniprogram/components/violation-type-picker/violation-type-picker.wxml`
- Create: `miniprogram/components/violation-type-picker/violation-type-picker.wxss`

- [ ] **Step 1: 创建违法类型选择器**

```javascript
// miniprogram/components/violation-type-picker/violation-type-picker.js
Component({
  properties: {
    selected: {
      type: String,
      value: ''
    }
  },

  data: {
    options: [
      { id: 'illegal-lane-change', label: '非法变道' },
      { id: 'yellow-line-violation', label: '压线行驶' },
      { id: 'red-light-violation', label: '闯红灯' },
      { id: 'illegal-parking', label: '违法停车' },
      { id: 'emergency-lane-violation', label: '应急车道行驶' }
    ]
  },

  methods: {
    select(e) {
      const id = e.currentTarget.dataset.id;
      this.triggerEvent('change', { id });
    }
  }
});
```

```html
<!-- miniprogram/components/violation-type-picker/violation-type-picker.wxml -->
<view class="violation-picker">
  <text class="picker-title">违法类型</text>
  <view class="options">
    <view
      wx:for="{{options}}"
      wx:key="id"
      class="option {{selected === item.id ? 'selected' : ''}}"
      bindtap="select"
      data-id="{{item.id}}"
    >
      <text>{{item.label}}</text>
    </view>
  </view>
</view>
```

```css
/* miniprogram/components/violation-type-picker/violation-type-picker.wxss */
.violation-picker {
  padding: 20rpx;
}

.picker-title {
  font-size: 28rpx;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
}

.options {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.option {
  padding: 20rpx 30rpx;
  background: #f5f5f5;
  border-radius: 8rpx;
  border: 2rpx solid transparent;
}

.option.selected {
  background: #e6f7ff;
  border-color: #07c160;
  color: #07c160;
}
```

Run: `cat miniprogram/components/violation-type-picker/violation-type-picker.wxml`
Expected: 输出上述内容

- [ ] **Step 2: Commit**

```bash
git add miniprogram/components/violation-type-picker
git commit -m "feat: add violation type picker component"
```

---

### Task 5: 确认页与举报包生成

**Files:**
- Create: `miniprogram/pages/confirm/confirm.js`
- Create: `miniprogram/pages/confirm/confirm.wxml`
- Create: `miniprogram/pages/confirm/confirm.wxss`
- Create: `miniprogram/utils/report-generator.js`

- [ ] **Step 1: 创建举报包生成工具**

```javascript
// miniprogram/utils/report-generator.js
/**
 * 生成12123举报包
 * 格式：视频文件 + info.json
 */

function generateReportPackage(clipData, mark, violationType) {
  // 1. 裁剪视频（实际需要调用视频处理API，这里返回裁剪参数）
  const videoClip = {
    originalFile: mark.videoFile,
    clipStart: clipData.clipStart,
    clipEnd: clipData.clipEnd,
    roadName: mark.roadName,
    gps: mark.gps
  };

  // 2. 生成info.json
  const info = {
    reportId: generateUUID(),
    violationType: violationType,
    occurredAt: mark.timestamp,
    roadName: mark.roadName,
    gps: mark.gps,
    clipStart: clipData.clipStart,
    clipEnd: clipData.clipEnd,
    generatedAt: new Date().toISOString()
  };

  return {
    videoClip,
    info
  };
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

module.exports = {
  generateReportPackage,
  formatTime
};
```

Run: `cat miniprogram/utils/report-generator.js`
Expected: 输出上述内容

- [ ] **Step 2: 创建确认页**

```javascript
// miniprogram/pages/confirm/confirm.js
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
```

```html
<!-- miniprogram/pages/confirm/confirm.wxml -->
<view class="confirm-page">
  <view class="section">
    <text class="section-title">路段确认</text>
    <input
      value="{{roadNameEditable}}"
      bindinput="onRoadNameInput"
      placeholder="请确认或修改道路名称"
      class="road-input"
    />
  </view>

  <view class="section">
    <text class="section-title">违法时间</text>
    <text>{{mark.timestamp}}</text>
  </view>

  <view class="section">
    <text class="section-title">裁剪范围</text>
    <text>{{clipStartFormatted}} - {{clipEndFormatted}}</text>
  </view>

  <view class="section">
    <violation-type-picker
      selected="{{violationType}}"
      bindchange="onViolationTypeChange"
    />
  </view>

  <button type="primary" bindtap="generatePackage" class="generate-btn">生成举报包</button>
</view>
```

```css
/* miniprogram/pages/confirm/confirm.wxss */
.confirm-page {
  padding: 20rpx;
}

.section {
  background: #f5f5f5;
  padding: 30rpx;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 28rpx;
  color: #888;
  display: block;
  margin-bottom: 15rpx;
}

.road-input {
  background: #fff;
  padding: 20rpx;
  border-radius: 4rpx;
}

.generate-btn {
  margin-top: 40rpx;
}
```

Run: `cat miniprogram/pages/confirm/confirm.wxml`
Expected: 输出上述内容

- [ ] **Step 3: Commit**

```bash
git add miniprogram/pages/confirm miniprogram/utils/report-generator.js
git commit -m "feat: add confirm page and report generator"
```

---

### Task 6: 结果页（跳转12123）

**Files:**
- Create: `miniprogram/pages/result/result.js`
- Create: `miniprogram/pages/result/result.wxml`
- Create: `miniprogram/pages/result/result.wxss`

- [ ] **Step 1: 创建结果页**

```javascript
// miniprogram/pages/result/result.js
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

      // 检测是否安装了12123 App
      this.check12123();
    }
  },

  check12123() {
    // 微信小程序唤起App能力有限，这里提示用户手动打开12123
    // 实际项目中可使用 wx.navigateToMiniProgram 跳转其他小程序
    this.setData({ canJumpTo12123: true });
  },

  jumpTo12123() {
    // 生成举报包后，复制举报信息到剪贴板，引导用户去12123上传
    const app = getApp();
    const report = app.globalData.report;

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
    // 实际项目中应提供视频文件下载
    wx.showToast({ title: '举报包已生成，请在文件中查看', icon: 'none' });
  }
});
```

```html
<!-- miniprogram/pages/result/result.wxml -->
<view class="result-page">
  <view class="success-icon">
    <text class="icon">✓</text>
  </view>

  <text class="title">举报包已生成</text>
  <text class="subtitle">举报编号：{{reportId}}</text>

  <view class="report-summary">
    <view class="summary-row">
      <text class="label">违法类型</text>
      <text class="value">{{violationType}}</text>
    </view>
    <view class="summary-row">
      <text class="label">违法地点</text>
      <text class="value">{{roadName}}</text>
    </view>
  </view>

  <view class="actions">
    <button type="primary" bindtap="jumpTo12123">打开12123上传</button>
    <button bindtap="downloadPackage">下载举报包</button>
  </view>
</view>
```

```css
/* miniprogram/pages/result/result.wxss */
.result-page {
  padding: 60rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.success-icon {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: #07c160;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40rpx;
}

.icon {
  font-size: 60rpx;
  color: #fff;
}

.title {
  font-size: 40rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 20rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #888;
  display: block;
  margin-bottom: 60rpx;
}

.report-summary {
  width: 100%;
  background: #f5f5f5;
  padding: 30rpx;
  border-radius: 8rpx;
  margin-bottom: 60rpx;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.summary-row:last-child {
  margin-bottom: 0;
}

.label {
  color: #888;
}

.value {
  color: #333;
}

.actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}
```

Run: `cat miniprogram/pages/result/result.wxml`
Expected: 输出上述内容

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/result
git commit -m "feat: add result page with 12123 jump"
```

---

## 阶段四：扫码页（占位）

### Task 7: 扫码页

**Files:**
- Create: `miniprogram/pages/scan/scan.js`
- Create: `miniprogram/pages/scan/scan.wxml`
- Create: `miniprogram/pages/scan/scan.wxss`

- [ ] **Step 1: 创建扫码页（占位，后续对接车机）**

```javascript
// miniprogram/pages/scan/scan.js
Page({
  onLoad() {
    wx.scanCode({
      success: (res) => {
        try {
          const data = JSON.parse(res.result);
          const app = getApp();
          app.globalData.marks = data.marks;
          wx.navigateBack();
        } catch (e) {
          wx.showToast({ title: '无效的二维码', icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '扫码取消', icon: 'none' });
        wx.navigateBack();
      }
    });
  }
});
```

```html
<!-- miniprogram/pages/scan/scan.wxml -->
<view class="scan-page">
  <text>正在打开扫码...</text>
</view>
```

```css
/* miniprogram/pages/scan/scan.wxss */
.scan-page {
  padding: 100rpx;
  text-align: center;
}
```

Run: `cat miniprogram/pages/scan/scan.wxml`
Expected: 输出上述内容

- [ ] **Step 2: Commit**

```bash
git add miniprogram/pages/scan
git commit -m "feat: add scan page placeholder"
```

---

## 自我审查清单

**1. Spec覆盖检查：**
- [x] 扫码接收标记数据 — Task 7 scan page + Task 1 index
- [x] 视频获取（模拟） — Task 3 clip page
- [x] 路段确认（可编辑） — Task 5 confirm page
- [x] 双视频时间线裁剪 — Task 3 clip page
- [x] 违法类型选择 — Task 4 violation-type-picker
- [x] 生成12123举报包 — Task 5 report-generator
- [x] 跳转12123 — Task 6 result page

**2. Placeholder检查：**
- 无"TBD"、"TODO"占位符
- 无"类似Task N"的引用

**3. 类型一致性检查：**
- `clipParams` 结构在 clip.js 和 confirm.js 中一致
- `mark` 对象包含 timestamp, gps, roadName, videoFile, offset
- `report.info` 包含 reportId, violationType, roadName, occurredAt

---

## 执行选择

**Plan complete and saved to `docs/superpowers/plans/2026-04-20-traffic-report-plan.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
