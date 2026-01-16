# 组件样式使用指南

## 1. 组件样式架构

### 1.1 文件组织规范
```
src/components/
├── ComponentName/
│   ├── index.tsx           # 组件主文件
│   ├── styles.module.css   # 组件样式文件
│   ├── types.ts           # TypeScript类型定义
│   ├── constants.ts       # 组件常量
│   ├── utils.ts           # 组件工具函数
│   └── __tests__/         # 测试文件
│       ├── index.test.tsx
│       └── styles.test.ts
```

### 1.2 样式文件命名
- 使用 `styles.module.css` 作为默认样式文件名
- 多主题情况下使用 `styles.light.module.css` 和 `styles.dark.module.css`
- 变体样式使用 `styles.variants.module.css`

## 2. CSS Modules 使用规范

### 2.1 基本语法
```css
/* Button/styles.module.css */
.button {
  /* 基础按钮样式 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: var(--transition-base);
}

.buttonPrimary {
  /* 主要按钮变体 */
  composes: button;
  background-color: var(--primary-500);
  color: white;
}

.buttonSecondary {
  /* 次要按钮变体 */
  composes: button;
  background-color: var(--gray-100);
  color: var(--gray-700);
}

.buttonLarge {
  /* 大尺寸变体 */
  composes: button;
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-lg);
}
```

### 2.2 React组件中使用
```tsx
import styles from './styles.module.css'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  children: React.ReactNode
  onClick?: () => void
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'medium',
  children, 
  onClick 
}) => {
  const className = `${styles.button} ${styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`]} ${styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}`]}`
  
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  )
}
```

## 3. 组件样式命名规范

### 3.1 BEM命名法（推荐）
```css
/* Block */
.card {}

/* Element */
.card__header {}
.card__body {}
.card__footer {}

/* Modifier */
.card--large {}
.card--highlighted {}
.card__header--compact {}
```

### 3.2 组件前缀规范
```css
/* ✅ 推荐：使用组件前缀 */
.btn {}
.btn-primary {}
.btn-lg {}

/* ❌ 避免：过于通用的命名 */
.button {}
.primary {}
.large {}
```

## 4. 主题切换支持

### 4.1 主题变量使用
```css
/* Card/styles.module.css */
.card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
}

.cardHeader {
  border-bottom: 1px solid var(--border-color-light);
}
```

### 4.2 主题特定样式
```css
/* Card/styles.light.module.css */
.card {
  --bg-surface: white;
  --border-color: var(--gray-200);
  --border-color-light: var(--gray-100);
}

/* Card/styles.dark.module.css */
.card {
  --bg-surface: var(--gray-800);
  --border-color: var(--gray-700);
  --border-color-light: var(--gray-600);
}
```

## 5. 响应式设计

### 5.1 断点使用
```css
.button {
  /* 移动端优先 */
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
}

@media (min-width: 768px) {
  .button {
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: var(--font-size-base);
  }
}
```

### 5.2 响应式工具类
```css
/* 隐藏类 */
.hiddenMobile {
  display: none;
}

@media (min-width: 768px) {
  .hiddenMobile {
    display: block;
  }
}

/* 网格系统 */
.col12 {
  grid-column: span 12;
}

@media (min-width: 768px) {
  .colMd6 {
    grid-column: span 6;
  }
}
```

## 6. 状态管理

### 6.1 交互状态
```css
.button {
  /* 默认状态 */
  background-color: var(--primary-500);
}

.button:hover {
  /* 悬停状态 */
  background-color: var(--primary-600);
}

.button:active {
  /* 激活状态 */
  background-color: var(--primary-700);
  transform: translateY(1px);
}

.button:focus {
  /* 焦点状态 */
  outline: 2px solid var(--primary-300);
  outline-offset: 2px;
}

.button:disabled {
  /* 禁用状态 */
  background-color: var(--gray-300);
  cursor: not-allowed;
  opacity: 0.6;
}
```

### 6.2 加载状态
```css
.buttonLoading {
  composes: button;
  position: relative;
  color: transparent;
}

.buttonLoading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  margin: -8px 0 0 -8px;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

## 7. 动画与过渡

### 7.1 过渡效果
```css
.card {
  transition: transform var(--transition-base),
              box-shadow var(--transition-base);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

### 7.2 关键帧动画
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fadeIn {
  animation: fadeIn var(--transition-base) ease-out;
}
```

## 8. 性能优化

### 8.1 CSS优化
```css
/* ✅ 推荐：使用transform代替position改变 */
.element {
  transform: translateX(100px);
}

/* ❌ 避免：频繁触发重排 */
.element {
  left: 100px;
}
```

### 8.2 选择器优化
```css
/* ✅ 推荐：简洁的选择器 */
.card {}

/* ❌ 避免：过于复杂的选择器 */
body div.container .wrapper .card {}
```

## 9. 可访问性

### 9.1 焦点管理
```css
.button:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

.button:focus:not(:focus-visible) {
  outline: none;
}
```

### 9.2 颜色对比
```css
.textPrimary {
  color: var(--gray-900);
  background-color: white;
  /* 确保对比度达到WCAG AA标准 */
}
```

## 10. 测试规范

### 10.1 样式测试
```css
/* 测试样式是否应用正确 */
.buttonPrimary {
  background-color: var(--primary-500);
}

/* 测试响应式断点 */
@media (min-width: 768px) {
  .card {
    padding: var(--spacing-lg);
  }
}
```

### 10.2 视觉回归测试
- 使用Storybook进行组件展示
- 使用Chromatic或Loki进行视觉测试
- 确保样式修改不会影响现有UI

## 11. 文档要求

### 11.1 注释规范
```css
/**
 * Button Component Styles
 * 
 * @description 按钮组件基础样式
 * @author 团队名称
 * @since 2024-01-01
 */

/* 主要按钮样式 - 用于重要操作 */
.buttonPrimary {
  background-color: var(--primary-500);
}

/* 次要按钮样式 - 用于次要操作 */
.buttonSecondary {
  background-color: var(--gray-100);
}
```

### 11.2 Storybook文档
```tsx
export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: '按钮组件用于触发操作',
      },
    },
  },
}
```