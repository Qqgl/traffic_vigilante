# Report Package Generation

## Purpose

将裁剪参数、违法类型、路段信息组装为12123格式的举报包，包含举报编号、违法详情和视频片段信息。

## Scenario: 生成举报包

**GIVEN** 用户已选择违法类型并确认路段
**WHEN** 用户点击"生成举报包"
**THEN** 系统调用 generateReportPackage 生成 { videoClip, info } 结构，其中 info 包含 reportId（UUID格式）、violationType、occurredAt、roadName、gps、clipStart、clipEnd、generatedAt
**AND** 将举报包存入 globalData.report
**AND** 跳转到结果页

## Scenario: 路段名称可编辑

**GIVEN** 用户在确认页
**WHEN** 用户修改道路名称输入框内容
**THEN** 系统实时更新 roadNameEditable 值，最终提交时使用用户确认/修改后的道路名称

## Scenario: 格式化时间显示

**GIVEN** clipStart = 65，clipEnd = 125
**WHEN** 确认页渲染时
**THEN** 显示为"01:05 - 02:05"格式（MM:SS）

## Scenario: 缺少裁剪参数时禁止生成

**GIVEN** 用户直接访问确认页（无 globalData.clipParams）
**WHEN** 页面 onLoad 时
**THEN** 系统提示"请先选择视频片段"，自动跳转回上一页

## Scenario: 道路名称为空时禁止生成

**GIVEN** 用户未输入道路名称
**WHEN** 用户点击"生成举报包"
**THEN** 系统提示"请输入道路名称"，不生成举报包
