wooshopxingyun-ui 前端源码

<h1 style="text-align: center">星云商城系统</h1>
#### 项目简介
星云基于当前流行技术组合的前后端分离商城系统： SpringBoot2+MybatisPlus+SpringSecurity+jwt+redis+Vue的前后端分离的商城系统， 包含商品分类、商品sku、运费模板、素材库、小程序支付、拼团活动、砍价活动、商户管理、 秒杀活动、优惠券、积分、分销、会员、充值、多门店等功能，更适合企业或个人二次开发；

### 商业版
1. 包含PC商城、管理后台、uniapp+(全平台已经适配)
2. 付费会员获得系统更多功能模块
3. 全部源码无加密
4. 永久授权
5. 付费会员专属qq群解答
6. github私服永久更新
7. 提供完善开发文档、说明书,可加入售后服务群获得技术、部署与上架指导，技术指导不限于本插件

需要购买商业版请联系客服(QQ:97437471)获取专属会员群、git私服

### 官方技术QQ交流群 (入群前，请在网页右上角点 "Star" )：826692261
|  PC商城演示地址 |  https://demo.admin.wooshopxingyun.com/buyerHome |
|---|---|
| 管理后台演示地址：账号:test 密码:123456    |  https://demo.admin.wooshopxingyun.com/login |
#### 演示二维码
![输入图片说明](https://demo.h5.wooshopxingyun.com/kaiyun/yanshicode.png)

| Android  |  https://demo.h5.wooshopxingyun.com/wooshopxingyun_anz.apk |
|---|---|
| 关注公众号  | ![输入图片说明](https://demo.h5.wooshopxingyun.com/kaiyun/qrcode_for_gh_34624ccb5486_258.jpg) |
| 360小程序  | 已完成适配  |
| 快应用  | 已完成适配  |

### 小程序端截图

| ![输入图片说明](https://demo.h5.wooshopxingyun.com/kaiyun/yidon-1.png "在这里输入图片标题") | ![输入图片说明](https://demo.h5.wooshopxingyun.com/kaiyun/yidon-2.png "在这里输入图片标题") |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| ![输入图片说明](https://demo.h5.wooshopxingyun.com/kaiyun/yidon-3.png "在这里输入图片标题")                     | ![输入图片说明](https://demo.h5.wooshopxingyun.com/kaiyun/yidon-4.png "在这里输入图片标题")                     |

### PC客户端截图

| ![输入图片说明](https://demo.h5.wooshopxingyun.com/kaiyun/pc1.png "在这里输入图片标题") | ![输入图片说明](https://demo.h5.wooshopxingyun.com/kaiyun/pc2.png "在这里输入图片标题") |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| ![输入图片说明](https://demo.h5.wooshopxingyun.com/kaiyun/pc3.png "在这里输入图片标题")                     | ![输入图片说明](https://demo.h5.wooshopxingyun.com/kaiyun/pc4.png "在这里输入图片标题")                     |

### 管理后台截图

| ![输入图片说明](https://demo.h5.wooshopxingyun.com/kaiyun/admin1.png "在这里输入图片标题") | ![输入图片说明](https://demo.h5.wooshopxingyun.com/kaiyun/admin2.png "在这里输入图片标题") |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| ![输入图片说明](https://demo.h5.wooshopxingyun.com/kaiyun/admin3.png "在这里输入图片标题")                     | ![输入图片说明](https://demo.h5.wooshopxingyun.com/kaiyun/admin4.png "在这里输入图片标题")                     |


#### 项目源码

|     |   后端源码  |   前端源码  |
|---  |--- | --- |
|  码云   |   https://gitee.com/xingyunshop/xingyunshopjava   |   https://gitee.com/xingyunshop/eladmin-wooxingyunshop-ui   |
|  GitHub   |  https://github.com/wooshopxingyun/wooshopxinyun-shop-java    |  https://github.com/wooshopxingyun/eladmin-wooxingyunshop-ui    |

#### 开发文档
[https://el-admin.vip](https://el-admin.vip)

#### 前端模板

初始模板基于： [https://github.com/PanJiaChen/vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)

模板文档： [https://panjiachen.github.io/vue-element-admin-site/zh/guide/](https://panjiachen.github.io/vue-element-admin-site/zh/guide/)

#### Build Setup
``` bash
# 配置镜像加速
https://www.ydyno.com/archives/1219.html

# 安装依赖
npm install

# 启动服务 localhost:8013
npm run dev

# 构建生产环境
npm run build:prod
```

#### 常见问题

1、linux 系统在安装依赖的时候会出现 node-sass 无法安装的问题

解决方案：
```
1. 单独安装：npm install --unsafe-perm node-sass 
2. 直接使用：npm install --unsafe-perm
```

2、加速node-sass安装

https://www.ydyno.com/archives/1219.html

#### 特别鸣谢

- 感谢 [JetBrains](https://www.jetbrains.com/) 提供的非商业开源软件开发授权

- 感谢 [PanJiaChen](https://github.com/PanJiaChen/vue-element-admin) 大佬提供的前端模板

- 感谢 [Moxun](https://github.com/moxun1639) 大佬提供的前端 Curd 通用组件

- 感谢 [zhy6599](https://gitee.com/zhy6599) 大佬提供的后端运维管理相关功能

- 感谢 [j.yao.SUSE](https://github.com/everhopingandwaiting) 大佬提供的匿名接口与Redis限流等功能

- 感谢 [d15801543974](https://github.com/d15801543974) 大佬提供的基于注解的通用查询方式
