# 校园跑腿小程序

> 校园内的 C2C 跑腿服务平台，支持快递代取、外卖代取、文件代送等服务。

## 项目概述

本项目是一个基于微信小程序的校园跑腿平台，连接"发单者"和"接单者"，提供从下单、接单、配送到完成结算的完整闭环。

## 技术栈

- **前端**：uni-app（Vue 语法）
- **后端/数据库**：uniCloud（Serverless 云函数 + 云数据库）
- **后台管理**：uni-admin
- **支付**：微信支付（平台担保模式）

## 目录结构

```
campus-errand-miniapp/
├── client/                 # 小程序前端（uni-app）
│   ├── pages/              # 页面
│   ├── components/         # 公共组件
│   ├── static/             # 静态资源
│   ├── utils/              # 工具函数
│   ├── App.vue             # 应用入口
│   ├── main.js             # 入口脚本
│   ├── manifest.json       # 小程序配置
│   ├── pages.json          # 页面路由
│   └── uni.scss            # 全局样式
├── admin/                  # 后台管理端（uni-admin）
├── cloudfunctions/         # uniCloud 云函数
│   ├── common/utils/       # 公共工具函数
│   └── user/               # 用户相关云函数
│       ├── login/          # 微信登录
│       ├── bindPhone/      # 绑定手机号
│       ├── updateProfile/  # 更新资料
│       ├── getUserInfo/    # 获取用户信息
│       ├── applyRider/     # 申请认证骑手
│       └── auditRider/     # 审核骑手申请
├── database/               # 数据库初始化脚本
└── docs/                   # 设计文档
```

## 服务品类

1. 快递代取
2. 外卖代取
3. 文件代送

## 运营模式

- **混合接单模式**
  - 普通订单：所有认证学生都可接单
  - 高价值/贵重订单：仅认证骑手可接

## 支付模式

- 平台担保 + 微信支付
- 发单时预付，订单完成后结算给接单者
- 平台可抽取一定比例服务费

## 开发状态

- [x] 项目设计与仓库初始化
- [x] 用户认证模块（登录、绑定手机号、绑定学号、骑手申请/审核）
- [ ] 订单模块
- [ ] 支付模块
- [ ] 后台管理模块

## 快速开始

### 1. 环境准备

- 安装 [HBuilderX](https://www.dcloud.io/hbuilderx.html)
- 注册 [DCloud 账号](https://dev.dcloud.net.cn/)
- 注册 [微信小程序](https://mp.weixin.qq.com/)

### 2. 配置

1. 修改 `client/manifest.json` 中的 `mp-weixin.appid` 为你的小程序 appid
2. 修改 `cloudfunctions/user/login/config.json` 中的 `appid` 和 `secret`
3. 在 uniCloud 控制台创建数据库集合：`users`、`rider_applications`

### 3. 运行

1. 用 HBuilderX 打开 `client` 目录
2. 右键 `client` 目录 → 运行到小程序模拟器 → 微信开发者工具
3. 右键 `cloudfunctions` 下的云函数目录 → 上传并运行

## 相关文档

- [设计文档](./docs/brainstorming/2026-06-15--campus-errand-design.md)
