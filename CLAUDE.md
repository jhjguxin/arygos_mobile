# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此仓库中工作时提供指引。

## 项目概述

Arygos CRM 移动端应用，基于 **uni-app (Vue 3)** 构建，面向 H5、Android、iOS 和微信小程序。状态管理为 **Pinia**，UI 库为 **uview-plus**，底层编译器为 **Vite**（HBuilderX 内置）。

## 开发环境

- **IDE**：HBuilderX 为主开发工具（`manifest.json` 中 `vueVersion: "3"`）。需启用 Sass/SCSS 插件（工具 → 插件安装 → Sass）。
- **开发服务器**：H5 开发服务器通过 HBuilderX 运行。代理配置在 `manifest.json` 的 `h5.devServer` 中。
- **无 npm 构建脚本**——项目通过 HBuilderX 或 uni-app CLI 构建（`package.json` 中未定义 `npm run dev:*` / `npm run build:*`）。`node_modules` 仅存放运行时库（uview-plus、pinia、lodash、dayjs、qs 等）。
- **Vite 约束**：底层编译器为 Vite——全部使用 ESM（禁止 `require()`），环境变量用 `import.meta.env`，第三方库（lodash、qs 等）必须显式 `import`。

## 架构

### HTTP 层

```
services/http/
├── interface.js       # 核心 HTTP 客户端，基于 uni.request 封装（Promise 风格）
├── index.js           # 所有 API 模块的统一导出
├── api/               # 每个 API 资源一个文件（REST: index/show/create/update/delete）
│   ├── lead.js, customer.js, contact.js, ...
│   └── auth.js        # 登录 (POST /api/v2/auth/sign_in)，退出登录
└── qiniu/             # 七牛云存储 API
```

**关键模式：**
- 所有 API 调用返回 Promise。从 `services/http` 导入：
  ```js
  import { leadApi } from '@/services/http';
  leadApi.index({ page: 1 }).then(res => { ... });
  ```
- 认证令牌通过请求头发送：`Authorization: Bearer token="<token>", device="h5"`。令牌从 Pinia 读取（`useStore().getAuthToken`）。
- API 基础地址来自 `config`（开发环境 `config/default.js`，生产环境 `config/production.js`——后者已被 gitignore）。
- 令牌过期（HTTP 100401）会自动触发 `uni.clearStorage()`。

### 状态管理 (Pinia)

```
store/
├── index.js   # createPinia + pinia-plugin-persistedstate；导出 useStore()
└── app.js     # 唯一的 useAppStore：auth / permission / filterColumn 三块 state
```

- 持久化通过 `pinia-plugin-persistedstate` + 自定义 `uni.getStorageSync`/`uni.setStorageSync` 适配器，存储键为 `crm:vuex:storage`。
- Getters：`getAuthToken`、`getHasLogin`、`getUser`、`getPermissions`、`getFilterColumns(name)`。Actions：`login(user)`、`logout()`、`setPermissions(...)`、`setFilterColumns(...)`。
- **统一访问方式**（组件和服务层相同）：
  ```js
  import { useStore } from '@/store';
  const token = useStore().getAuthToken;
  ```
  `useStore()` 显式绑定到本项目的 pinia 实例，因此服务层/HTTP 层可在 `getActivePinia()` 就绪前调用。
- 在组件中检查权限：用 `<permit-checker>` 组件包裹内容，或编程式调用 `Policy.checkPermission({ subject, action, authKey })`。

### 配置

```
config/
├── index.js          # 按 import.meta.env.MODE 切换 default/production
├── default.js        # 开发环境配置 { debug: true, API_HOST: 'http://localhost:3030' }
└── production.js     # 生产环境配置（已 gitignore；参见 .example）
```

`config/index.js` 通过 `import.meta.glob('./production.*')` 惰性加载生产配置——production.js 缺失时（新克隆仓库）不会导致编译报错。

### 页面组织

每个业务实体在 `pages/<entity>/` 下遵循一致的 CRUD 页面模式：
- `<entity>List`——带下拉刷新的列表页
- `<entity>Show`——详情页
- `<entity>Edit`——编辑表单
- `<entity>New`——新建表单

**Tab 栏页面**（在 `pages.json` 中定义）：workbench、todo、quickPlus、report、me。

### 组件系统

**easycom 自动导入**（在 `pages.json` 中配置）：
| 前缀 | 解析路径 |
|---|---|
| `up-*` / `u-*` | `uview-plus/components/u-*/u-*.vue` |
| `uni-section` | `@/components/uni-section/uni-section.vue`（本地覆写） |
| `uni-*` | `@dcloudio/uni-ui/lib/uni-*/uni-*.vue` |
| `form-*` | `@/components/custom_form/fields/form-*.vue` |
| `custom-form` / `custom-form-field` / `collapse-custom-field` | `@/components/custom_form/` |
| `column-filter-form` / `column-filter-*` | `@/components/column-filter-form/` |
| `report-filter-form` / `report-filter-*` | `@/components/report-filter-form/`、`@/components/report-filter-field/` |

**元数据驱动的表单系统 (`custom_form/`)：** 表单/筛选/展示 UI 完全由元数据驱动——后端定义字段类型、标签、校验规则和选项；前端渲染对应控件，无需硬编码各字段逻辑。

- **`custom-form.vue`**——容器组件：接收 `klassName`（如 `"Contact"`、`"Contract"`），通过 `CustomFieldForm` 获取表单专用自定义字段，逐字段渲染 `custom-form-field`，提交时发出携带清洗后数据的 `submit` 事件。
- **`custom-form-field.vue`**——字段分发器：由于 uni-app 不支持动态组件，通过 `v-if`/`v-else-if` 链覆盖 17 种字段类型（文本、选择、日期、文件、地址等）。
- **`getFormField.js`**——将 `field_type` 字符串映射到组件名称。
- **`parseRule.js`**——按字段类型构建 uview-plus async-validator 校验规则（必填、最大长度、正则、范围）。
- **`parseInitialValue.js`** / **`parseCustomField.js`**——在 API 记录格式与表单模型格式之间转换。
- 组件使用**显式 `props` 声明**（配合 `setup()` + `toRef` 透传），不通过 `$attrs` 隐式传参。
- 表单校验统一使用 Promise 风格：`this.$refs.uForm.validate().then(valid => { ... })`。
- 表单字段组件统一使用 `v-model` 双向绑定。

**页面 CRUD 模式详情：**
- **列表页**：加载时获取 `CustomField` 以确定显示哪些列。下拉刷新重新加载第 1 页，滚动到底部追加后续页面。列筛选器变更时发出 `{name, op, value}`。
- **详情页**：使用 `entity-base-info` + `custom-field-on-show` 组件渲染实体。Tab 页签界面（销售动态 + 详情）。底部固定操作栏包含编辑/删除按钮。
- **编辑/新建页**：渲染单个 `<custom-form>` 组件，传入 `klassName` 和 record。编辑时保存前先做重复检查。成功后跳转到详情页。

### 核心服务（非 HTTP 类）

所有领域服务遵循 **单例 + CacheStore** 模式，带 TTL 缓存：

| 服务 | 文件 | 缓存 TTL | 用途 |
|---|---|---|---|
| `Auth` | `services/auth.js` | — | 登录/退出/当前用户；登录后获取权限和特性标识 |
| `Policy` | `services/policy.js` | — | 权限检查：`checkPermission({ subject, action, authKey })`、`checkUsercenterPermission({ action })` |
| `Feature` | `services/feature.js` | 300s | 特性标识（启用/禁用，自定义标签） |
| `Geo` | `services/geo.js` | 600s | 级联地理数据：国家 → 省份 → 城市 → 区县 |
| `ConstGlobal` | `services/const_global.js` | 300s | 服务端全局常量 |
| `ApprovalSetting` | `services/approval_setting.js` | 300s | 审批流程配置；`isEnable` 检查 `enable == "1"` |
| `CustomField` | `services/custom_field.js` | 300s | 按模型的自定义字段定义（按 klass_name 缓存） |
| `CustomFieldForm` | `services/custom_field_form.js` | 300s | 按模型的自定义表单布局 |
| `CustomFieldGroup` | `services/custom_field_group.js` | 300s | 按模型的自定义字段分组 |
| `RedDot` | `services/red_dot.js` | 600s | Tab 栏未读消息角标数 |

缓存通过 `common/utils/cache_store.jsx` 实现——`CacheStore` 单例，底层使用 `uni.setStorageSync`/`uni.getStorageSync`，基于 dayjs 计算过期时间，键名前缀为 `cache_store:<key>`。

### 七牛云存储

- 上传凭证：`GET /api/qiniu/auth/upload_token`（无需认证）
- 下载地址：`GET /api/qiniu/auth/download_url`（无需认证）
- 附件回调：`POST /api/v2/qiniu/attachments/callback`（无需认证）
- 创建附件：`POST /api/v2/qiniu/attachments`（需认证）
- `attachment-upload` 组件基于 uview-plus 的 `u-upload` API（上传成功后直接使用回调 event 本身作为响应数据，而非 `event.data`）。

### 图表

uCharts v1.9.6 位于 `js_sdk/u-charts/u-charts/`（注意是两层同名目录），通过同目录的 Vue 组件包装器 `u-charts.vue` 导入。报表页面（`pages/report/*`）均基于此包装器。

### UI 库

- **uview-plus** ^3.8.0——主要组件库（uView 的 Vue 3 版本）
- **@dcloudio/uni-ui** ^1.5.0——uni-app 官方补充组件
- SCSS：`uni.scss` 引入 `uview-plus/theme.scss`；`App.vue` 引入 `uview-plus/index.scss`，并包含全局 `u-tr`/`u-td` flex 等高修复（解决 uview-plus 表格单元格不等高 bug）。

## 认证流程

1. `App.vue` 的 onLaunch 通过 `useStore().getHasLogin` 检查登录状态
2. 如过期/缺失 → 跳转到 `pages/auth/login/login`
3. 登录调用 `authApi.login()` → 成功后调用 `Auth.login(user)`，写入 Pinia store 并获取权限和特性标识
4. 令牌存储在 Pinia（通过持久化插件写入 uni.storage），所有需认证的请求都附带该令牌

## 部署 (H5)

```shell
ssh -p 40022 crm_deploy@crm-private.ikcrm.com "rm -rf /data0/crm_deploy/arygos_h5_staging/*"
scp -r -P40022 unpackage/dist/build/h5/* crm_deploy@crm-private.ikcrm.com:/data0/crm_deploy/arygos_h5_staging/
```

## 已知约束

- **仅支持 Vue 3**——`this.$set`/`this.$delete`、`filters` 过滤器等不可用；直接赋值即响应式。
- **不支持动态组件**——uni-app 不支持 `<component :is="...">`（custom-form-field 因此使用 `v-if` 链分发）。
- **模块规范**——全 ESM；lodash/qs/dayjs 等必须显式 import；导入路径使用 `@/` 别名或带扩展名的相对路径（Vite 下 bare import 相对路径易出错）。
- **props 规范**——所有组件 props 必须带类型声明（`{ type: String }` 等）；props 不得与 data/computed 同名（Vue 3 会警告）；不得直接修改 props（只读），需要变更时 emit 事件或复制到本地状态。
- **模板严格模式**——`v-for` 别名不得与外层作用域变量重复声明（如嵌套 `v-for` 都叫 `item` 会编译报错）。
- **uview-plus 组件用法**（以 uview-plus 官方文档为准）：
  - 多行文本用 `u-textarea`（`u-input` 不支持 `type="textarea"`）
  - 时间选择用 `u-datetime-picker`
  - `u-link` 通过 `text` prop 传文字（不使用默认 slot）
  - `uForm.validate()` 返回 Promise
  - `u-input` 的 `border` prop 为 String 类型
- **请求数据不支持嵌套数组**——HTTP 层在 GET 请求中将参数通过 `qs.stringify({ arrayFormat: 'brackets' })` 序列化后拼接到 URL。
- **null 值**在微信小程序中可能引发问题——HTTP 层中有被注释掉的 null 值替换逻辑。
- `uni.scss` 定义了全局 SCSS 变量，整个应用都在使用。
- `Auth.logout()` 直接调用 `uni.clearStorage()` 清空全部本地存储（含 Pinia 持久化数据）。
- **组件风格混用**——多数组件为 Options API，部分组件使用 `setup()`，修改时先看清组件用的是哪种风格。
