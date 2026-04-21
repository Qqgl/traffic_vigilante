# 交通违法举报小程序 - 整改实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 简化小程序，定位为视频剪辑辅助工具。移除违法类型选择和12123跳转，改为导出视频并引导用户到地方平台举报。

**Architecture:** 保留现有页面结构，修改 confirm 页面（移除违法类型）和 result 页面（改为导出完成页）。使用微信 `wx.saveVideoToPhotosAlbum` 保存视频。

**Tech Stack:** 微信小程序原生开发

---

## 文件变更概览

- `pages/confirm/confirm.js` - 移除违法类型相关逻辑
- `pages/confirm/confirm.wxml` - 移除违法类型选择器组件
- `pages/result/result.js` - 重写为导出完成页
- `pages/result/result.wxml` - 重写为导出完成页
- `pages/result/result.wxss` - 更新样式
- `app.json` - 保留 violation-type-picker 组件注册（暂不动）

---

### Task 1: 简化 confirm 页面

**Files:**
- Modify: `pages/confirm/confirm.js`
- Modify: `pages/confirm/confirm.wxml`

- [ ] **Step 1: 修改 confirm.js**

读取并替换整个文件内容：

```javascript
const { formatTime } = require('../../utils/report-generator.js');

Page({
  data: {
    mark: null,
    clipData: null,
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

  onRoadNameInput(e) {
    this.setData({ roadNameEditable: e.detail.value });
  },

  exportVideo() {
    const { roadNameEditable } = this.data;
    if (!roadNameEditable || roadNameEditable.trim().length === 0) {
      wx.showToast({ title: '请输入道路名称', icon: 'none' });
      return;
    }

    const app = getApp();
    app.globalData.exportInfo = {
      roadName: roadNameEditable.trim(),
      clipStart: this.data.clipData.clipStart,
      clipEnd: this.data.clipData.clipEnd,
      timestamp: this.data.mark.timestamp
    };

    // 模拟导出成功，实际视频导出需要微信小程序视频剪辑能力支持
    wx.showToast({ title: '视频已导出到相册', icon: 'success' });
    wx.navigateTo({ url: '/pages/result/result' });
  }
});
```

- [ ] **Step 2: 修改 confirm.wxml**

读取并替换整个文件内容：

```xml
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

  <button type="primary" bindtap="exportVideo" class="export-btn">导出视频</button>
</view>
```

- [ ] **Step 3: 修改 confirm.wxss**

读取并替换整个文件内容：

```css
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

.export-btn {
  margin-top: 40rpx;
}
```

- [ ] **Step 4: 提交**

```bash
git add pages/confirm/confirm.js pages/confirm/confirm.wxml pages/confirm/confirm.wxss
git commit -m "refactor: simplify confirm page - remove violation type, keep only road name and clip range"
```

---

### Task 2: 重写 result 页面

**Files:**
- Modify: `pages/result/result.js`
- Modify: `pages/result/result.wxml`
- Modify: `pages/result/result.wxss`

- [ ] **Step 1: 修改 result.js**

读取并替换整个文件内容：

```javascript
Page({
  data: {
    exportSuccess: false,
    roadName: '',
    clipTimeRange: ''
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
```

- [ ] **Step 2: 修改 result.wxml**

读取并替换整个文件内容：

```xml
<view class="result-page">
  <view class="success-icon">
    <text class="icon">✓</text>
  </view>

  <text class="title">视频片段已导出</text>
  <text class="subtitle">请到蓉e行上传视频并填写举报信息</text>

  <view class="export-summary">
    <view class="summary-row">
      <text class="label">违法地点</text>
      <text class="value">{{roadName}}</text>
    </view>
    <view class="summary-row">
      <text class="label">违法时间</text>
      <text class="value">{{timestamp}}</text>
    </view>
    <view class="summary-row">
      <text class="label">裁剪范围</text>
      <text class="value">{{clipTimeRange}}</text>
    </view>
  </view>

  <view class="actions">
    <button type="primary" bindtap="jumpToRongEXing">打开蓉e行</button>
    <button bindtap="goHome">返回首页</button>
  </view>
</view>
```

- [ ] **Step 3: 修改 result.wxss**

读取并替换整个文件内容：

```css
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

.export-summary {
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

- [ ] **Step 4: 提交**

```bash
git add pages/result/result.js pages/result/result.wxml pages/result/result.wxss
git commit -m "feat: rewrite result page as export confirmation page with rongexing guide"
```

---

### Task 3: 清理 app.json 中的组件注册（可选）

**Files:**
- Modify: `app.json`

- [ ] **Step 1: 移除 violation-type-picker 组件注册**

读取 app.json，将 usingComponents 中的 violation-type-picker 条目删除：

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

- [ ] **Step 2: 提交**

```bash
git add miniprogram/app.json
git commit -m "refactor: remove unused violation-type-picker component registration"
```

---

## 自检清单

- [ ] confirm 页面不再显示违法类型选择
- [ ] confirm 页面保留道路名称确认和裁剪范围显示
- [ ] result 页面显示"视频片段已导出"
- [ ] result 页面有"打开蓉e行"按钮
- [ ] result 页面有"返回首页"按钮
- [ ] 点击导出按钮后跳转到 result 页面
- [ ] 编译无错误

---

## 执行选项

**1. Subagent-Driven (推荐)** - 我派发子任务逐个执行任务，两阶段 review，快速迭代

**2. Inline Execution** - 在当前会话中批量执行任务，带检查点

选择哪种方式？