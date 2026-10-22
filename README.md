# QuotaView Windows

Windows 灵动岛应用，当前主线为 **.NET 10 + WebView2**，不再分发 Electron 或 Node.js 运行时。保留任务状态、额度与用量统计、本地 Agent 接入，以及 AI 球和量子噪点两种 GPU 动效；不包含桌面小组件。

- 灵动岛贴合屏幕顶部，悬停 150 ms 展开、移出 450 ms 收起；固定或待确认时保持展开。
- 设置对齐 mac 版的通用、灵动岛、用量显示、连接、代理、反馈与关于。移除空闲隐藏、额外弹出开关和特效选择。
- 用量页采用额度 / Token / 账户组合卡片、成本图与活动热图。充值卡仅展示，没有点击操作或二级页面。
- AI 球和量子噪点在应用内持续播放，隐藏窗口停止绘制；窗口过渡仍遵循系统减少动态效果偏好。
- Windows 11 支持的环境使用原生 Acrylic / Mica；系统关闭透明效果或不支持材质时回退到深色表面。

## 克隆后构建

Windows x64，安装 .NET **10 SDK**、Node.js **24**、pnpm **11.25.0** 和 Microsoft Edge **WebView2 Evergreen Runtime**。构建依赖由锁文件固定，首次构建需要联网下载 NuGet / npm 依赖。

```powershell
git clone https://github.com/Duoasa/quotaview-windows.git
cd quotaview-windows
npm install --global pnpm@11.25.0
.\build.ps1 -Action run
```

```powershell
# 原生 WebView2 界面、连续动画、本地协议与业务回归测试
.\build.ps1 -Action test
# 包含 .NET 运行时的完整 x64 便携目录及 ZIP
.\build.ps1 -Action publish
# 可选：使用电脑已有的 .NET 10 Desktop Runtime
.\build.ps1 -Action publish -FrameworkDependent
```

运行入口：`webview2/release/standalone/QuotaView.Native.exe`。整个目录必须保留；ZIP 内不包含 WebView2 浏览器引擎，使用系统共享的 Evergreen Runtime。普通用户不需要 Node.js、pnpm 或 .NET SDK。

## 工程目录

| 目录 | 用途 |
| --- | --- |
| `webview2/native/` | .NET 窗口、DPI / 屏幕定位、托盘、WebView2、安全边界、文件 / 进程 / 网络服务 |
| `webview2/runtime/` | JavaScript 业务逻辑与 .NET 的适配桥 |
| `windows/src/` | 复用的 Agent 接入、额度、设置、用量与应用控制器源码 |
| `windows/renderer/` | React 界面源码与样式 |
| `ElectronEffects/src/` | 共享 AI 球和量子噪点 shader、动效状态模型；目录名保留历史来源 |
| `windows/tests/`、`webview2/tests/` | 业务 / 协议 / 原生桥 / 界面测试 |
| `Imports/`、`Prototypes/`、根目录 `src/` | 历史交付与原型，不参与当前主线构建 |

详细架构、数据目录和验证说明见 [WebView2 构建说明](webview2/README.md) 与 [开发交接](HANDOFF.md)。GitHub Actions 构建主线并保存测试报告和 ZIP，不自动发布 Release。

Windows Codex Desktop 的审批执行、问题回复与中断仍须在原客户端完成。Claude 等已配置的交互 Hook 保留原有协议，不把只读同步伪装成可操作审批。未知额度、缺失历史与不可估算成本显示为“—”，不虚构数据。

此前的 [Electron 预览发行版](https://github.com/Duoasa/quotaview-windows/releases/tag/v0.8.3-win.1.effects.2) 属于旧架构，与本主线构建不同。
