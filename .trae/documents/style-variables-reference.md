# 样式变量对照表

## 1. 颜色系统

### 1.1 主色调变量
| 变量名 | 色值 | 使用场景 | 示例 |
|--------|------|----------|------|
| `--primary-50` | #f0f9ff | 极浅背景色、hover状态 | 卡片hover背景 |
| `--primary-100` | #e0f2fe | 浅色背景、次要按钮 | 次要按钮背景 |
| `--primary-500` | #3b82f6 | 主按钮、链接、重点元素 | 主要CTA按钮 |
| `--primary-600` | #2563eb | hover状态、深色主题 | 按钮hover状态 |
| `--primary-700` | #1d4ed8 | 激活状态、pressed状态 | 按钮按下状态 |

### 1.2 中性色变量
| 变量名 | 色值 | 使用场景 | 示例 |
|--------|------|----------|------|
| `--gray-50` | #f9fafb | 页面背景、卡片背景 | 页面背景色 |
| `--gray-100` | #f3f4f6 | 边框、分割线 | 表格边框 |
| `--gray-500` | #6b7280 | 次要文本、图标 | 辅助文字 |
| `--gray-700` | #374151 | 主要文本 | 正文文字 |
| `--gray-900` | #111827 | 标题、强调文本 | 页面标题 |

### 1.3 语义色变量
| 变量名 | 色值 | 使用场景 | 示例 |
|--------|------|----------|------|
| `--success` | #10b981 | 成功状态、正向反馈 | 成功提示 |
| `--warning` | #f59e0b | 警告状态、注意信息 | 警告提示 |
| `--error` | #ef4444 | 错误状态、危险操作 | 错误提示 |
| `--info` | #3b82f6 | 信息提示、中性通知 | 信息通知 |

## 2. 间距系统

### 2.1 基础间距
| 变量名 | 数值 | px值 | 使用场景 | 示例 |
|--------|------|------|----------|------|
| `--spacing-xs` | 0.25rem | 4px | 极小间距、图标间距 | 图标与文字间距 |
| `--spacing-sm` | 0.5rem | 8px | 小组件内间距 | 按钮内边距 |
| `--spacing-md` | 1rem | 16px | 标准间距、卡片间距 | 卡片内边距 |
| `--spacing-lg` | 1.5rem | 24px | 组件间间距 | 表单元素间距 |
| `--spacing-xl` | 2rem | 32px | 区块间间距 | 内容区块间距 |
| `--spacing-2xl` | 3rem | 48px | 大区块间距 | 页面区块间距 |

### 2.2 特殊间距
| 变量名 | 数值 | 使用场景 | 示例 |
|--------|------|----------|------|
| `--border-radius-sm` | 0.25rem | 小圆角、标签圆角 |
| `--border-radius-md` | 0.5rem | 标准圆角、按钮圆角 |
| `--border-radius-lg` | 1rem | 大圆角、卡片圆角 |
| `--border-radius-full` | 9999px | 完全圆角、头像圆角 |

## 3. 字体系统

### 3.1 字体族
| 变量名 | 字体栈 | 使用场景 | 示例 |
|--------|--------|----------|------|
| `--font-family-base` | -apple-system, BlinkMacSystemFont... | 正文字体 | 页面正文 |
| `--font-family-mono` | 'SF Mono', Monaco... | 等宽字体 | 代码块 |
| `--font-family-heading` | 继承base | 标题字体 | 页面标题 |

### 3.2 字体大小
| 变量名 | 数值 | px值 | 使用场景 | 示例 |
|--------|------|------|----------|------|
| `--font-size-xs` | 0.75rem | 12px | 辅助文字、标签 | 表单提示 |
| `--font-size-sm` | 0.875rem | 14px | 次要文字 | 次要信息 |
| `--font-size-base` | 1rem | 16px | 正文字体 | 正文内容 |
| `--font-size-lg` | 1.125rem | 18px | 大字体 | 重点内容 |
| `--font-size-xl` | 1.25rem | 20px | 标题字体 | 小标题 |
| `--font-size-2xl` | 1.5rem | 24px | 大标题 | 中标题 |
| `--font-size-3xl` | 1.875rem | 30px | 特大标题 | 大标题 |

### 3.3 字重
| 变量名 | 数值 | 使用场景 | 示例 |
|--------|------|----------|------|
| `--font-weight-normal` | 400 | 普通文本 | 正文 |
| `--font-weight-medium` | 500 | 中等强调 | 按钮文字 |
| `--font-weight-semibold` | 600 | 较强强调 | 标题 |
| `--font-weight-bold` | 700 | 最强强调 | 主标题 |

## 4. 动画系统

### 4.1 过渡变量
| 变量名 | 数值 | 使用场景 | 示例 |
|--------|------|----------|------|
| `--transition-fast` | 0.15s ease | 快速过渡 | 按钮hover |
| `--transition-base` | 0.2s ease | 标准过渡 | 卡片hover |
| `--transition-slow` | 0.3s ease | 慢速过渡 | 模态框 |

### 4.2 动画变量
| 变量名 | 数值 | 使用场景 | 示例 |
|--------|------|----------|------|
| `--animation-fade-in` | fadeIn 0.2s ease | 淡入动画 | 提示消息 |
| `--animation-slide-up` | slideUp 0.3s ease | 上滑动画 | 底部弹窗 |

## 5. 断点系统

### 5.1 响应式断点
| 变量名 | 数值 | 使用场景 | 示例 |
|--------|------|----------|------|
| `--breakpoint-sm` | 640px | 小屏设备 | 手机横屏 |
| `--breakpoint-md` | 768px | 中等屏幕 | 平板 |
| `--breakpoint-lg` | 1024px | 大屏设备 | 小屏电脑 |
| `--breakpoint-xl` | 1280px | 超大屏 | 大屏电脑 |

## 6. 阴影系统

### 6.1 阴影变量
| 变量名 | 数值 | 使用场景 | 示例 |
|--------|------|----------|------|
| `--shadow-sm` | 0 1px 2px 0 rgba(0,0,0,0.05) | 小阴影 | 卡片 |
| `--shadow-base` | 0 1px 3px 0 rgba(0,0,0,0.1) | 标准阴影 | 弹窗 |
| `--shadow-lg` | 0 10px 15px -3px rgba(0,0,0,0.1) | 大阴影 | 模态框 |

## 7. 使用示例

### 7.1 基础使用
```css
.button {
  /* 使用颜色变量 */
  background-color: var(--primary-500);
  color: white;
  
  /* 使用间距变量 */
  padding: var(--spacing-sm) var(--spacing-md);
  margin: var(--spacing-md);
  
  /* 使用字体变量 */
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  
  /* 使用圆角变量 */
  border-radius: var(--border-radius-md);
  
  /* 使用过渡变量 */
  transition: var(--transition-base);
}
```

### 7.2 主题切换
```css
/* 亮色主题 */
[data-theme="light"] {
  --bg-primary: var(--gray-50);
  --text-primary: var(--gray-900);
}

/* 暗色主题 */
[data-theme="dark"] {
  --bg-primary: var(--gray-900);
  --text-primary: var(--gray-50);
}
```

## 8. 注意事项

1. **变量覆盖**：避免在组件中直接覆盖CSS变量
2. **浏览器兼容**：确保CSS变量在目标浏览器中的兼容性
3. **性能优化**：避免过度使用CSS变量嵌套
4. **文档同步**：变量更新时同步更新此对照表