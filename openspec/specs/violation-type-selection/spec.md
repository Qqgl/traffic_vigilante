# Violation Type Selection

## Purpose

提供违法类型单选交互，用户从5种预设违法类型中选择一种，确认举报的违法行为。

## Scenario: 选择违法类型

**GIVEN** 用户在确认页，未选择任何违法类型
**WHEN** 用户点击"非法变道"选项
**THEN** 该选项高亮显示（背景#e6f7ff + 边框#07c160 + 文字#07c160），其他选项取消选中状态，系统触发 change 事件传递 { id: 'illegal-lane-change' }

## Scenario: 切换违法类型

**GIVEN** 用户已选择"闯红灯"
**WHEN** 用户点击"非法变道"
**THEN** "闯红灯"取消高亮，"非法变道"变为高亮状态，selected 属性更新为 'illegal-lane-change'

## Scenario: 未选择违法类型时禁止生成举报包

**GIVEN** 用户未选择任何违法类型
**WHEN** 用户点击"生成举报包"
**THEN** 系统提示"请选择违法类型"，不跳转页面

## Violation Types

| ID | Label |
|----|-------|
| illegal-lane-change | 非法变道 |
| yellow-line-violation | 压线行驶 |
| red-light-violation | 闯红灯 |
| illegal-parking | 违法停车 |
| emergency-lane-violation | 应急车道行驶 |
