# QuotaView Windows 开发交接

当前主线：`windows/` Electron / React 工程，共享 `ElectronEffects/src/` 动效。根目录 WPF 以及旧运行包适配器属于历史参考，不参与当前安装包。

本轮基于 `2d55dbb`，开发分支 `codex/windows-port-completion`。版本保持 `0.8.3-win.1.effects.2`；用户已授权提交、推送并合并到 main；提交与 CI 状态以 Git 和 GitHub 实时结果为准。未签名或发布。

已落实：移除重置演示与桌面 Widget 入口；磨砂/Mica 与不透明回退；Windows 设置深浅色和窗口按钮；三种 GPU 进度效果、球体及实时预览；模块拆分；任务/进度/更新判断修复；额度代理；小型 Framework 辅助程序；NSIS/便携打包及卸载集成清理；Windows CI 与体积预算。

本轮在 macOS 完成本地检查，推送后 [Windows CI](https://github.com/Duoasa/quotaview-windows/actions/runs/39729392168) 已通过全部 27 项测试、打包与隔离启动检查。辅助程序为 20 KiB，NSIS 安装包约 113.9 MiB，便携包约 113.6 MiB，展开应用约 382.4 MiB。用户暂时没有 Windows 实机，安装交互、DWM 材质、多 DPI 和真实 Agent 验收尚未完成；下一步执行真实环境检查表。不要把历史 NVIDIA 开发台测试当作新应用已通过的证据。

- [构建与维护](windows/README.md)
- [验证与待办清单](docs/WINDOWS-PORT-CHECKLIST.md)
- [历史交接原文](docs/archive/HANDOFF-before-port-completion.md)
