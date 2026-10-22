# WebView2 主线

## 构建与运行

要求 Windows x64、.NET 10 SDK、Node.js 24、pnpm 11.25.0、WebView2 Evergreen Runtime。Node.js 仅用于构建和测试。`pnpm-lock.yaml` 与 `packages.lock.json` 锁定依赖；无隐藏开发目录或本机绝对路径依赖。

在仓库根目录执行 `./build.ps1 -Action build|run|test|publish`。`publish` 默认生成包含 .NET 的 `webview2/release/standalone/` 和 ZIP；`-FrameworkDependent` 需要用户安装 .NET 10 Desktop Runtime。两者均共享系统 WebView2 Runtime，不把整个 Chromium 引擎复制进包中。

WebView2 Runtime 官方安装入口：https://developer.microsoft.com/microsoft-edge/webview2/

如果 SDK 安装在自定义目录，应将其加入 PATH，并设置 DOTNET_ROOT；正常安装 SDK 无须额外配置。

## 运行时结构

.NET WinForms 管理窗口、屏幕 DPI、顶部定位、透明裁剪、原生材质、托盘、文件、子进程、TCP / TLS 与系统代理。两个前台覆盖窗口承载灵动岛和用量胶囊，设置使用可缩放的独立窗口。

已有 JavaScript 业务模块经过 esbuild 编译，在独立的后台 WebView2 中运行。`runtime/electron.js` 是为旧应用控制器保留的接口适配层，不加载 Electron；文件、进程和网络 API 调用转交 .NET。React 与 GLSL 保留原有实现。原 Framework 辅助程序已合并到 .NET 主程序的无界面命令模式，因此不再要求 .NET Framework 4.8。

后台文档限定在打包的私有域名，只有它可访问原生 host object。可见界面关闭 host object，只开放列举的消息 API；导航、iframe、浏览器权限、下载和直接外部网络访问被禁用。外部链接与配置操作由原生端校验并执行。

## 动效与界面

运行时仅加载 AI 球、量子噪点及其完成描边 shader。思考 / 压缩显示 AI 球，工作 / 待确认显示量子噪点；同一任务保留动画时钟。进度由真实任务计划提供，没有计划时只显示状态场，不制造百分比。历史原型中的其他 shader 不进入主线运行时。

按产品要求，应用明确启用两种核心动态状态效果，因此 Windows 的系统减少动态效果不会把它们静止；窗口和界面过渡继续遵循系统偏好。渲染器仍支持显式静态模式供无障碍集成和测试使用，最小化 / 隐藏时暂停。

设置项与 mac v0.8.3-build.1 对齐，保留 Windows 原生标题栏操作和材质回退。充值卡使用 mac 项目的 MIT 素材，仅展示，既不可键盘聚焦也没有点击跳转。

## 数据与配置

- 首次启用使用独立偏好目录 `%APPDATA%/QuotaView WebView2`，不会自动覆盖旧 Electron 偏好。
- 浏览器缓存和日志在 `%LOCALAPPDATA%/QuotaView WebView2`。应用日志不记录任务正文、认证令牌或 Cookie。
- 默认只读发现本机 Codex。其他客户端 Hook 的安装 / 卸载通过连接页操作；保留其他工具已有的 Hook 配置。
- Hook 引用当前应用的绝对路径。移动或删除运行目录前，在连接页解除相应 Hook；移动后重新配置。
- 用量账户统计和本地记录不叠加。成本按可识别模型估算，不是订阅账单；缺失日期不会当成零值。

## 验证

`-Action test` 依次运行：

1. 真正的 WebView2 渲染测试：shader 像素、连续帧变化、状态过渡和卸载；悬停、离开、固定、待确认；用量布局、充值卡不可交互、活动模式及所有设置页。
2. .NET 适配层测试：Unicode 文件、原子配置与锁、TOML / YAML、持续子进程 stdin、TCP 半关闭、HTTP CONNECT 和 Hook 往返。
3. 共享 Node 业务 / 协议 / 设置回归测试，调用新的 .NET 无界面辅助模式。

测试使用隔离目录和明确标记的演示数据，正常启动不生成演示任务。报告和界面截图位于 `webview2/build/`，不会进入源码提交或运行包。`--validation-report=<绝对路径>` 可额外执行本机真实读取并保存不含任务内容的诊断报告；普通运行不要传入此测试参数。

已在 Windows / WebView2 上检查 150% DPI、带负坐标的副屏、顶部贴合和原生窗口裁剪。当前电脑关闭系统透明效果，真实桌面 Acrylic / Mica 的视觉效果仍须在开启透明效果的电脑验收。未配置的第三方客户端未在本机完成真实会话验收，现有协议由隔离测试覆盖。
