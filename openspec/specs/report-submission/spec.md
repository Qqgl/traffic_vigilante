# Report Submission

## Purpose

将举报信息复制到剪贴板，引导用户打开12123 App完成举报上传。

## Scenario: 复制举报信息

**GIVEN** 用户在结果页，已生成举报包
**WHEN** 用户点击"打开12123上传"
**THEN** 系统将举报信息（编号、类型、地点、时间、片段时间）复制到剪贴板，格式如下：
```
举报编号：<reportId>
违法类型：<violationType>
发生地点：<roadName>
发生时间：<occurredAt>
裁剪片段：<clipStart>s - <clipEnd>s
```
**AND** 弹出模态框提示"举报信息已复制，请打开12123 App上传视频和相关信息"

## Scenario: 剪贴板复制失败

**GIVEN** 用户在结果页
**WHEN** 点击"打开12123上传"但剪贴板操作失败
**THEN** 系统提示"复制失败，请手动复制"

## Scenario: 无举报包数据时禁止操作

**GIVEN** 用户直接访问结果页（无 globalData.report）
**WHEN** 页面 onLoad 时
**THEN** 系统提示"没有举报包数据"，自动跳转回上一页

## Scenario: 举报信息格式化

**GIVEN** 举报包中 roadName = "京沪高速上海方向"
**WHEN** 复制到剪贴板时
**THEN** 系统将换行符替换为空格并去除首尾空格，防止多行内容破坏剪贴板数据格式

## Scenario: 下载功能占位

**GIVEN** 用户在结果页
**WHEN** 用户点击"下载举报包"按钮
**THEN** 按钮处于禁用状态，显示"下载举报包（开发中）"，点击提示"下载功能开发中"
