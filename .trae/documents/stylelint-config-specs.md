# Stylelint配置规范与覆盖原则

## 1. Stylelint配置概述

Stylelint是一个强大的CSS代码检查工具，用于确保样式代码的一致性、可维护性和最佳实践。本配置专门针对React项目中的CSS Modules和现代化CSS开发流程设计。

## 2. 基础配置文件

### 2.1 完整配置文件
```json
{
  "extends": [
    "stylelint-config-standard",
    "stylelint-config-css-modules",
    "stylelint-config-prettier"
  ],
  "plugins": [
    "stylelint-order",
    "stylelint-scss"
  ],
  "rules": {
    /* 颜色相关规则 */
    "color-no-invalid-hex": true,
    "color-named": "never",
    "color-no-hex": null,
    
    /* 选择器命名规范 */
    "selector-class-pattern": "^[a-z][a-zA-Z0-9]*(?:[A-Z][a-zA-Z0-9]*)*$",
    "selector-id-pattern": "^[a-z][a-zA-Z0-9]*(?:[A-Z][a-zA-Z0-9]*)*$",
    "selector-max-id": 0,
    "selector-max-universal": 0,
    "selector-max-type": 2,
    "selector-no-qualifying-type": true,
    
    /* 属性使用规范 */
    "property-no-unknown": true,
    "property-no-vendor-prefix": true,
    "property-case": "lower",
    
    /* 值和函数 */
    "value-no-vendor-prefix": true,
    "function-url-quotes": "always",
    "function-name-case": "lower",
    
    /* 单位规范 */
    "unit-allowed-list": ["px", "rem", "em", "%", "vh", "vw", "deg", "ms", "s"],
    "unit-case": "lower",
    "unit-no-unknown": true,
    
    /* 重要性声明 */
    "declaration-no-important": true,
    "declaration-block-no-duplicate-properties": true,
    "declaration-block-no-shorthand-property-overrides": true,
    
    /* 简写属性 */
    "shorthand-property-no-redundant-values": true,
    
    /* 注释规范 */
    "comment-word-blacklist": ["todo", "fixme"],
    "comment-whitespace-inside": "always",
    
    /* 代码风格 */
    "indentation": 2,
    "string-quotes": "single",
    "number-leading-zero": "always",
    "length-zero-no-unit": true,
    "max-nesting-depth": 3,
    "max-empty-lines": 1,
    "no-eol-whitespace": true,
    "no-empty-source": true,
    "no-extra-semicolons": true,
    "no-missing-end-of-source-newline": true,
    
    /* CSS Modules 特定规则 */
    "css-modules/composed-class-names": true,
    "css-modules/no-undef-class": true,
    "css-modules/no-unused-class": true,
    
    /* 属性顺序 */
    "order/properties-order": [
      "position",
      "z-index",
      "top",
      "right",
      "bottom",
      "left",
      "display",
      "flex",
      "flex-direction",
      "justify-content",
      "align-items",
      "width",
      "height",
      "margin",
      "padding",
      "background",
      "color",
      "font",
      "border",
      "border-radius",
      "box-shadow",
      "transform",
      "transition",
      "animation"
    ],
    
    /* 自定义规则 */
    "plugin/declaration-block-no-ignored-properties": true,
    "scale-unlimited/declaration-strict-value": [
      ["/color$/", "fill", "stroke"],
      {
        "ignoreValues": ["transparent", "inherit", "currentColor"]
      }
    ]
  },
  "ignoreFiles": [
    "node_modules/**/*",
    "dist/**/*",
    "build/**/*",
    "**/*.min.css"
  ]
}
```

### 2.2 针对覆盖原则的例外配置
```json
{
  "rules": {
    "declaration-no-important": [
      true,
      {
        "severity": "warning",
        "message": "尽量避免使用!important，如必须使用请添加注释说明原因"
      }
    ]
  }
}
```

## 3. 核心规则说明

### 3.1 命名规范规则
```json
{
  "selector-class-pattern": "^[a-z][a-zA-Z0-9]*(?:[A-Z][a-zA-Z0-9]*)*$"
}
```
- **目的**：确保类名使用驼峰命名法
- **示例**：`.buttonPrimary`、`.cardHeader`、`.navItem`
- **禁止**：`.button-primary`、`.card_header`、`.nav-item`

### 3.2 性能相关规则
```json
{
  "selector-max-id": 0,
  "selector-max-universal": 0,
  "max-nesting-depth": 3
}
```
- **目的**：避免使用ID选择器和通配符选择器，限制嵌套深度
- **原因**：提高CSS选择器性能和可维护性

### 3.3 代码质量规则
```json
{
  "declaration-no-important": true,
  "declaration-block-no-duplicate-properties": true,
  "shorthand-property-no-redundant-values": true
}
```
- **目的**：避免样式冲突和代码冗余
- **例外**：重要覆盖需要特殊处理（见第5节）

## 4. 样式覆盖审批机制

### 4.1 覆盖类型分类

#### 类型A：主题变量覆盖
```css
/* ✅ 允许：主题层面的覆盖 */
[data-theme="dark"] {
  --primary-500: #1e40af;
}
```

#### 类型B：组件状态覆盖
```css
/* ✅ 允许：组件内部状态覆盖 */
.button {
  background-color: var(--primary-500);
}

.button:hover {
  background-color: var(--primary-600); /* 悬停状态覆盖 */
}
```

#### 类型C：第三方库覆盖
```css
/* ⚠️ 谨慎：第三方库样式覆盖 */
.ant-modal .ant-modal-header {
  background-color: var(--bg-surface) !important; /* 必须添加注释 */
  /* 覆盖原因：Ant Design模态框头部样式与主题不一致 */
}
```

#### 类型D：业务特殊需求
```css
/* ❌ 严格限制：业务样式覆盖 */
.override-element {
  background-color: #ff0000 !important;
  /* 覆盖原因：品牌特殊需求，已获设计师确认 */
  /* 审批人：张三，日期：2024-01-15 */
}
```

### 4.2 审批流程

#### 步骤1：申请提交
```markdown
样式覆盖申请表
- 覆盖类型：业务特殊需求
- 覆盖位置：src/components/Header/styles.module.css
- 覆盖原因：品牌VI要求使用特定红色
- 预期影响范围：仅影响Header组件背景色
- 设计师确认：✅ 已确认
- 产品经理确认：✅ 已确认
```

#### 步骤2：技术评审
- 检查是否有替代方案
- 评估对主题系统的影响
- 确认覆盖的必要性

#### 步骤3：代码审查
```css
/* 审批编号：STYLE-2024-001 */
/* 审批人：李四 */
/* 审批日期：2024-01-15 */
.header {
  background-color: #ff0000 !important; /* 品牌特殊需求 */
}
```

## 5. 覆盖原则详细说明

### 5.1 优先级原则
1. **主题变量** > **组件样式** > **工具类** > **自定义覆盖**
2. **业务组件**不得直接覆盖**基础组件**样式
3. **页面级组件**可以覆盖**业务组件**样式（需审批）

### 5.2 注释要求
```css
/* ✅ 推荐：详细注释 */
.override-element {
  background-color: #ff0000 !important;
  /* 覆盖原因：品牌特殊需求 */
  /* 审批编号：STYLE-2024-001 */
  /* 影响范围：仅当前组件 */
  /* 替代方案：无（已评估） */
}

/* ❌ 避免：无注释或注释不完整 */
.override-element {
  background-color: #ff0000 !important;
  /* 特殊需求 */
}
```

### 5.3 覆盖统计与监控

#### 统计指标
```json
{
  "styleCoverage": {
    "totalOverrides": 15,
    "approvedOverrides": 12,
    "unapprovedOverrides": 3,
    "overrideRate": "2.3%",
    "byType": {
      "theme": 2,
      "component": 8,
      "thirdParty": 3,
      "business": 2
    }
  }
}
```

#### 监控告警
- 覆盖数量超过阈值（>5%）时发出警告
- 发现未审批覆盖时阻止合并
- 定期生成覆盖报告供审查

## 6. 自动化检查集成

### 6.1 Git Hooks集成
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "stylelint 'src/**/*.{css,scss}'",
      "pre-push": "npm run stylelint:check-coverage"
    }
  }
}
```

### 6.2 CI/CD集成
```yaml
# .github/workflows/stylelint.yml
name: Stylelint Check
on: [push, pull_request]
jobs:
  stylelint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run Stylelint
        run: npm run stylelint
      - name: Check coverage
        run: npm run stylelint:check-coverage
      - name: Generate report
        run: npm run stylelint:report
```

### 6.3 覆盖率检查脚本
```javascript
// scripts/check-style-coverage.js
const stylelint = require('stylelint');
const fs = require('fs');

async function checkCoverage() {
  const result = await stylelint.lint({
    files: 'src/**/*.{css,scss}',
    config: require('../stylelint.config.js')
  });
  
  // 统计!important使用情况
  const importantCount = result.results.reduce((count, file) => {
    return count + (file.warnings?.filter(w => w.text.includes('!important')).length || 0);
  }, 0);
  
  if (importantCount > MAX_IMPORTANT_ALLOWED) {
    console.error(`❌ 发现${importantCount}个!important声明，超过最大允许值${MAX_IMPORTANT_ALLOWED}`);
    process.exit(1);
  }
  
  console.log(`✅ 样式检查通过，发现${importantCount}个!important声明`);
}

checkCoverage();
```

## 7. 最佳实践建议

### 7.1 避免覆盖的技巧
1. **提高选择器特异性**：使用更具体的选择器而非!important
2. **重构组件结构**：通过props或CSS变量控制样式
3. **使用主题系统**：通过CSS变量实现样式定制

### 7.2 覆盖后的维护
1. **定期审查**：每月审查所有样式覆盖
2. **文档更新**：及时更新样式文档
3. **技术债务管理**：将覆盖记录为技术债务并定期清理

### 7.3 团队协作
1. **代码审查**：所有覆盖必须经过代码审查
2. **知识共享**：定期进行样式系统培训
3. **工具支持**：使用IDE插件实时检查覆盖情况