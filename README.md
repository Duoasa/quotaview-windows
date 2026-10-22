# QuotaView Windows

QuotaView 的 Windows 灵动岛适配。当前主线位于 `windows/`，复用已有 Electron / React 后端、界面和 shader；不包含额度重置演示页或 macOS 桌面小组件。

- Windows 11 22H2+ 使用 Acrylic 磨砂背景和 Mica 设置背景；关闭透明效果、高对比度或不支持材质的系统使用纯色回退。
- 设置采用 Windows 导航、窗口按钮及深浅色样式。
- AI 球、烟雾、量子噪点、波浪通过同一 WebGL2 渲染器运行；隐藏窗口暂停、减少动态效果使用静态输出。
- Hook 和前台窗口检测使用小型 .NET Framework 辅助程序，不附带第二套 Node 运行时。
- 额度、任务、用量、连接和通知沿用现有数据链路。Windows Codex Desktop 的可操作审批、问题回复和中断尚不支持；需在 Codex 内操作。

## Windows x64 预览版下载

[0.8.3-win.1.effects.2 Pre-release](https://github.com/Duoasa/quotaview-windows/releases/tag/v0.8.3-win.1.effects.2) 提供便携 EXE（约 113.6 MiB，推荐快速测试）、NSIS 安装 EXE（约 113.9 MiB）、SHA-256 校验值和验证报告。目标为 Windows 10 22H2 / Windows 11 x64，需系统 .NET Framework 4.8。此版本未签名，实机验收尚未完成。

## 开发与构建

Windows x64，Node.js 24.19.0、pnpm 11.25.0、系统 .NET Framework 4.8：

```powershell
cd windows
pnpm install --frozen-lockfile
pnpm run build:helper
pnpm test
pnpm run dist
```

生成未签名的 NSIS 安装包与便携 EXE。完整命令、源码来源和清理方式见 [Windows 构建说明](windows/README.md)。CI 定义见 [Windows validation](.github/workflows/windows.yml)，不发布 Release。

## 当前验证状态

本轮在 macOS 完成代码检查、单元/本地协议测试、隔离 Chromium 的页面与 GPU 冒烟检查，以及 .NET Framework 参考程序集编译。**[首次 Windows CI](https://github.com/Duoasa/quotaview-windows/actions/runs/39729392168) 已通过：27 项测试、页面与 GPU 检查、安装包构建、打包程序启动和大小检查。安装交互、DWM 磨砂、混合 DPI 和真实 Agent 流程仍待实机验收。** 不将旧原型的运行记录作为本轮证据。详细记录见 [移植检查表](docs/WINDOWS-PORT-CHECKLIST.md)。已从 `main` 提交 `f2046a7` 的[成功 CI](https://github.com/Duoasa/quotaview-windows/actions/runs/39730000641) 发布上述 Pre-release，应用版本保持 `0.8.3-win.1.effects.2`。

| 入口 | 用途 |
| --- | --- |
| `windows/` | 当前应用、源码模块、资源、原生辅助程序、测试及打包 |
| `ElectronEffects/src/` | 共享动效模型、GLSL 和 WebGL 渲染器 |
| `Prototypes/EffectsLab/reference/` | 原有 shader 与参数的参考来源 |
| `Imports/`、根目录 `src/` / `tests/` | 历史交付与 WPF 原型，不参与当前构建 |
| [HANDOFF.md](HANDOFF.md) | 当前开发交接 |

原 README 与 Handoff 已保存在 `docs/archive/`；历史记录中的“当前”不代表开发主线。
