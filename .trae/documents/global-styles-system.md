# 全局样式体系重构文档

## 1. 项目概述
本文档旨在优化并重构全局样式代码体系，通过建立标准化的样式架构，提高样式复用率至85%以上，确保样式代码的可维护性和一致性。

## 2. 样式提取与分类

### 2.1 样式文件结构
```
src/styles/
├── global.css          # 全局基础样式
├── variables.css       # CSS变量定义
├── common/            # 公共样式模块
│   ├── layout.css     # 布局相关样式
│   ├── typography.css # 字体排版样式
│   ├── colors.css     # 颜色系统
│   └── animations.css # 动画效果
├── themes/            # 主题配置
│   ├── light.css      # 亮色主题
│   └── dark.css       # 暗色主题
└── utils/             # 工具样式
    ├── reset.css      # 样式重置
    └── helpers.css    # 辅助类
```

### 2.2 主题变量体系

#### 颜色变量
```css
:root {
  /* 主色调 */
  --primary-50: #f0f9ff;
  --primary-100: #e0f2fe;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  
  /* 中性色 */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-500: #6b7280;
  --gray-900: #111827;
  
  /* 语义色 */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
}
```

#### 间距变量
```css
:root {
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-2xl: 3rem;     /* 48px */
}
```

#### 字体变量
```css
:root {
  --font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
  --font-family-mono: 'SF Mono', Monaco, 'Cascadia Code', monospace;
  
  --font-size-xs: 0.75rem;   /* 12px */
  --font-size-sm: 0.875rem;  /* 14px */
  --font-size-base: 1rem;    /* 16px */
  --font-size-lg: 1.125rem;  /* 18px */
  --font-size-xl: 1.25rem;   /* 20px */
  
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}
```

## 3. 样式应用优先级

### 3.1 优先级层级（从高到低）
1. **主题变量和公共样式** - 最高优先级，全局统一
2. **预定义组件样式** - 组件级复用样式
3. **TailwindCSS工具类** - 原子化工具类（需加!important）
4. **自定义CSS** - 最低优先级，必须添加注释说明

### 3.2 使用规范
```css
/* ✅ 推荐：使用主题变量 */
.button {
  background-color: var(--primary-500);
  padding: var(--spacing-sm) var(--spacing-md);
}

/* ✅ 推荐：使用组件样式 */
@import '../components/Button/styles.module.css';

/* ⚠️ 谨慎：使用Tailwind工具类 */
.custom-element {
  @apply bg-blue-500 !important;
}

/* ❌ 避免：自定义CSS（必须注释说明） */
.override-element {
  background-color: #ff0000; /* 覆盖原因：品牌特殊需求 */
}
```

## 4. 组件样式规范

### 4.1 组件样式结构
```
src/components/
├── Button/
│   ├── index.tsx
│   ├── styles.module.css    # CSS Modules
│   └── Button.stories.tsx   # Story文档
└── Card/
    ├── index.tsx
    └── styles.module.css
```

### 4.2 样式隔离要求
- 所有业务组件必须使用CSS Modules或Scoped样式
- 禁止在组件中直接编写全局样式
- 组件样式文件必须包含组件前缀

### 4.3 组件样式示例
```css
/* Button/styles.module.css */
.button {
  composes: base-button from global;
  background-color: var(--primary-500);
  color: white;
  border-radius: var(--border-radius-md);
  transition: all 0.2s ease;
}

.button:hover {
  background-color: var(--primary-600);
}

.button--large {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-lg);
}
```

## 5. 质量保证措施

### 5.1 Stylelint配置
```json
{
  "extends": ["stylelint-config-standard", "stylelint-config-css-modules"],
  "rules": {
    "color-no-invalid-hex": true,
    "color-named": "never",
    "selector-class-pattern": "^[a-z][a-zA-Z0-9]*$",
    "declaration-no-important": true,
    "property-no-unknown": true,
    "selector-max-id": 0,
    "selector-max-universal": 0
  }
}
```

### 5.2 样式复用率统计
- 目标：样式复用率 > 85%
- 统计方法：通过工具分析CSS选择器复用情况
- 监控指标：重复样式数量、主题变量使用频率

### 5.3 代码审查流程
1. **自动检查**：Stylelint规则检查
2. **视觉回归**：使用BackstopJS等工具
3. **人工审查**：样式覆盖合理性评估
4. **性能测试**：CSS文件大小和加载性能

## 6. 实施计划

### 阶段一：基础搭建（第1-2周）
- [ ] 建立样式文件目录结构
- [ ] 定义主题变量体系
- [ ] 配置Stylelint规则
- [ ] 创建基础组件样式库

### 阶段二：迁移重构（第3-4周）
- [ ] 提取公共样式到对应文件
- [ ] 为组件添加样式隔离
- [ ] 替换硬编码值为变量
- [ ] 建立样式覆盖审批机制

### 阶段三：优化完善（第5-6周）
- [ ] 添加视觉回归测试
- [ ] 统计样式复用率
- [ ] 完善样式文档
- [ ] 进行回归测试

## 7. 交付物清单

- [x] 全局样式体系文档
- [x] 样式变量对照表
- [x] 组件样式使用指南
- [x] Stylelint配置规范
- [ ] 样式优化前后对比报告（实施后生成）
- [ ] 样式复用率统计报告（实施后生成）