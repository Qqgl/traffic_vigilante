# Video Clip Management

## Purpose

管理视频片段的导航、裁剪参数设置和缓冲时间调整，支持双视频时间线展示和跨文件片段。

## Scenario: 加载标记点

**GIVEN** 用户进入裁剪页且 globalData.marks 存在
**WHEN** 页面加载时
**THEN** 系统自动加载第一个标记点，显示道路名称、时间戳、视频1路径，计算裁剪开始时间（标记时间 - 缓冲秒数）和裁剪结束时间（标记时间 + 30秒）

## Scenario: 导航切换标记点

**GIVEN** 用户在裁剪页，当前为第 N 个标记点（共 M 个）
**WHEN** 用户点击"上一个"且 N > 0
**THEN** 系统加载第 N-1 个标记点，更新页面显示
**AND** 当 N = 0 时，"上一个"按钮禁用

**WHEN** 用户点击"下一个"且 N < M-1
**THEN** 系统加载第 N+1 个标记点，更新页面显示
**AND** 当 N = M-1 时，"下一个"按钮禁用

## Scenario: 调整标记前缓冲时间

**GIVEN** 用户在裁剪页，当前标记时间为 T，缓冲时间为 B
**WHEN** 用户拖动缓冲时间 slider 从 B 改为 B'
**THEN** 系统重新计算 clipStart = T - B'，如果 clipEnd <= clipStart，则 clipEnd 自动调整为 clipStart + 30秒

## Scenario: 调整裁剪开始时间

**GIVEN** 用户在裁剪页
**WHEN** 用户拖动"裁剪开始"slider
**THEN** 系统实时更新 clipStart 值

## Scenario: 调整裁剪结束时间

**GIVEN** 用户在裁剪页
**WHEN** 用户拖动"裁剪结束"slider
**THEN** 系统实时更新 clipEnd 值

## Scenario: 传递裁剪参数到确认页

**GIVEN** 用户已完成裁剪参数设置
**WHEN** 用户点击"确认裁剪"
**THEN** 系统将 { mark, clipStart, clipEnd, bufferBefore } 存入 globalData.clipParams，并跳转到确认页
