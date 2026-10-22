# 当前主线：WebView2 + .NET

当前工程入口为根目录 `build.ps1`，实现位于 `webview2/`；`windows/` 保留共享业务模块与 React 界面。运行时不依赖 Electron、Node.js 或 .NET Framework。

本轮完成原生窗口、数据和 Hook 桥接，设置与 mac 对齐，仅保留 AI 球及量子噪点；增加悬停展开，用量卡片组合布局和不可交互的充值卡，修复设置窗口 DPI、按钮尺寸和小屏定位。

复查入口：`./build.ps1 -Action test`；交付入口：`./build.ps1 -Action publish`。见 [主线说明](webview2/README.md)。生成物和报告不提交 Git，旧 Electron 发行包不代表本次主线。

继续修改时应使用现有真实数据读取链路。不要引入模拟额度，不要恢复充值二级页面或多特效选择；不要把 Codex Desktop 只读审批同步标成可以批准。
