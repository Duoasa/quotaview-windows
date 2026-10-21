# Windows 可独立构建工程

## 环境

- Windows 10/11 x64。
- 官方 Node.js **24.19.0 x64**（Hook SEA 必须使用这个版本）。
- pnpm **11.25.0**：安装 Node 后运行 `npm install -g pnpm@11.25.0`。

在克隆后的仓库根目录执行：

```powershell
cd windows
pnpm install --frozen-lockfile
pnpm test
pnpm run build
pnpm start
```

生成完整运行目录：

```powershell
pnpm run package
```

输出 `windows/release/win-unpacked/QuotaView Windows.exe`。整个目录一起分发。

生成单文件便携包：`pnpm run dist`。产物未签名，构建不会安装或启用任何 Agent Hook。首次安装依赖和打包需要网络下载公开运行时与构建工具。后续构建不读取 `Imports/`、旧 ASAR 或本机 528 MB 运行目录。

## 源码来源与维护

- `src/`：dot 交付中的可读 Electron 后端，已应用透明背景和屏幕贴顶修复。
- `renderer/`：从交付的前端 JavaScript 恢复并格式化的可编辑代码，包含随包 React/React DOM。**不是原作者的 JSX/TSX 源文件**，原始符号名、模块边界和原前端测试没有恢复；修改后可直接重建，无需旧运行包。
- `assets/`：构建所需图标、图片和字体，字体许可证随文件保存。
- `scripts/`：重新整理的渲染构建、Hook 打包脚本；Hook 从 `src/core/` 重新编译，不复制旧辅助 EXE。
- `../ElectronEffects/src/`：AI 球和量子噪点源码、参数与 shader；原始 shader 和参数来源保存在 `../Prototypes/EffectsLab/`。
- `tests/`：新增的窗口定位测试；旧交付声称的 92 项测试没有随包提供，不视作本工程已具备。

这里的“独立构建”指从仓库中的全部现有可编辑代码、资源及锁定的公开依赖重新生成程序，不声称还原了 dot 未交付的原始开发工程。

## 验证

`pnpm run smoke` 使用独立临时用户目录检查页面、桥接、屏幕贴顶和 GPU 特效，不连接真实 Agent。打包后也可对 EXE 使用 `--smoke-test --smoke-report=<绝对路径>`。视觉效果及真实 Agent 集成仍需人工验收。
