import { React } from "./react.js";
import {
  Icon,
  ProviderIcon,
  Toggle,
  SettingRow,
  SettingGroup,
  SegmentedControl,
  Select,
  Notice,
  Metric,
  ConfirmationDialog,
  PROVIDERS,
  PROVIDER_LABELS,
  useApp,
} from "./common.js";
import { QuotaCapsule, UsageView } from "./usage.js";
import { TaskCard } from "./tasks.js";
var settingPages = [
  ["general", "settings", "\u901A\u7528", "General", "#4e9ef8"],
  ["island", "island", "\u7075\u52A8\u5C9B", "Island", "#ba6bf2"],
  ["usage", "chart", "\u7528\u91CF\u663E\u793A", "Usage display", "#f06083"],
  ["connections", "connections", "\u8FDE\u63A5", "Connections", "#57cbe6"],
  ["proxy", "globe", "\u7F51\u7EDC\u4EE3\u7406", "Network proxy", "#53c4c4"],
  ["feedback", "bug", "Bug \u53CD\u9988", "Bug feedback", "#eea650"],
  ["about", "info", "\u5173\u4E8E", "About", "#8c87f9"],
];
function SettingToggle({
  name: t,
  title: e,
  description: a,
  icon: l,
  disabled: n,
}) {
  let { snapshot: i, setSetting: u, busy: o } = useApp();
  return React.createElement(
    SettingRow,
    { title: e, description: a, icon: l },
    React.createElement(Toggle, {
      label: e,
      checked: i.settings[t],
      disabled: n || o.updateSettings,
      onChange: (c) => u(t, c),
    }),
  );
}
function GeneralSettings() {
  let { snapshot: t, t: e, setSetting: a, invoke: l } = useApp(),
    n = t.settings,
    [i, u] = React.useState(!1),
    o = t.displays.map((r, g) => [
      String(r.id),
      r.label || r.name || e(`\u663E\u793A\u5668 ${g + 1}`, `Display ${g + 1}`),
    ]),
    c = [
      [
        "active",
        e("\u8DDF\u968F\u6D3B\u52A8\u7A97\u53E3", "Follow active window"),
      ],
      ["cursor", e("\u8DDF\u968F\u9F20\u6807\u6307\u9488", "Follow pointer")],
      ["primary", e("\u4E3B\u663E\u793A\u5668", "Primary display")],
      ...o,
    ];
  return (
    c.some(([r]) => r === String(n.display)) ||
      c.push([
        String(n.display),
        e(
          "\u6240\u9009\u663E\u793A\u5668\u672A\u8FDE\u63A5",
          "Selected display is disconnected",
        ),
      ]),
    React.createElement(
      React.Fragment,
      null,
      React.createElement(
        SettingGroup,
        { title: e("\u8BED\u8A00", "Language") },
        React.createElement(
          SettingRow,
          {
            title: e("\u5E94\u7528\u8BED\u8A00", "App language"),
            description: e(
              "\u7ACB\u5373\u5E94\u7528\u4E8E\u5168\u90E8\u7A97\u53E3\u3002",
              "Applies to every window immediately.",
            ),
            icon: "globe",
          },
          React.createElement(Select, {
            label: e("\u5E94\u7528\u8BED\u8A00", "App language"),
            value: n.language,
            onChange: (r) => a("language", r),
            options: [
              ["system", e("\u8DDF\u968F\u7CFB\u7EDF", "System")],
              ["zh", "\u7B80\u4F53\u4E2D\u6587"],
              ["en", "English"],
            ],
          }),
        ),
      ),
      React.createElement(
        SettingGroup,
        {
          title: e(
            "\u7075\u52A8\u5C9B\u663E\u793A\u4F4D\u7F6E",
            "Island placement",
          ),
          note: e(
            "\u6307\u5B9A\u7684\u663E\u793A\u5668\u65AD\u5F00\u65F6\u4E34\u65F6\u56DE\u5230\u4E3B\u5C4F\u5E55\uFF0C\u91CD\u65B0\u8FDE\u63A5\u540E\u6062\u590D\u3002",
            "A disconnected display falls back to the primary display until it reconnects.",
          ),
        },
        React.createElement(
          SettingRow,
          {
            title: e("\u663E\u793A\u5668", "Display"),
            description: e(
              "\u6240\u6709\u4F4D\u7F6E\u8BA1\u7B97\u5747\u5728\u4F60\u7684 Windows \u7535\u8111\u4E0A\u5B8C\u6210\u3002",
              "Placement is calculated locally on your Windows PC.",
            ),
            icon: "monitor",
          },
          React.createElement(Select, {
            label: e("\u663E\u793A\u5668", "Display"),
            value: String(n.display),
            onChange: (r) => a("display", r),
            options: c,
          }),
        ),
        React.createElement(SettingToggle, {
          name: "alwaysOnTop",
          title: e("\u59CB\u7EC8\u7F6E\u9876", "Always on top"),
          description: e(
            "\u8BA9\u7075\u52A8\u5C9B\u4FDD\u6301\u5728\u666E\u901A\u5E94\u7528\u7A97\u53E3\u4E0A\u65B9\u3002",
            "Keep the Island above ordinary application windows.",
          ),
          icon: "pin",
        }),
      ),
      React.createElement(
        SettingGroup,
        {
          title: e(
            "\u542F\u52A8\u4E0E\u63D0\u9192",
            "Startup and notifications",
          ),
        },
        React.createElement(SettingToggle, {
          name: "startAtLogin",
          title: e("\u767B\u5F55\u65F6\u542F\u52A8", "Launch at sign-in"),
          description: e(
            "\u767B\u5F55 Windows \u540E\u81EA\u52A8\u542F\u52A8 QuotaView\u3002",
            "Start QuotaView when you sign in to Windows.",
          ),
          icon: "power",
        }),
        React.createElement(SettingToggle, {
          name: "notifications",
          title: e("\u684C\u9762\u901A\u77E5", "Desktop notifications"),
          description: e(
            "\u901A\u77E5\u662F\u5426\u9001\u8FBE\u7531 Windows \u901A\u77E5\u8BBE\u7F6E\u51B3\u5B9A\u3002",
            "Delivery follows your Windows notification settings.",
          ),
          icon: "bell",
        }),
        React.createElement(SettingToggle, {
          name: "completionNotifications",
          title: e("\u4EFB\u52A1\u5B8C\u6210\u63D0\u9192", "Completion alerts"),
          description: e(
            "\u53EA\u5728\u6536\u5230\u771F\u5B9E\u5B8C\u6210\u4E8B\u4EF6\u65F6\u63D0\u9192\u3002",
            "Notify only after a real completion event.",
          ),
          disabled: !n.notifications,
        }),
        React.createElement(SettingToggle, {
          name: "lowQuotaNotifications",
          title: e("\u4F4E\u989D\u5EA6\u63D0\u9192", "Low quota alerts"),
          description: e(
            "\u4EC5\u6839\u636E\u6709\u6548\u989D\u5EA6\u5FEB\u7167\u63D0\u9192\u3002",
            "Use only valid quota snapshots.",
          ),
          disabled: !n.notifications,
        }),
      ),
      React.createElement(
        SettingGroup,
        { title: e("\u6570\u636E\u5237\u65B0", "Data refresh") },
        React.createElement(
          SettingRow,
          {
            title: e("\u5237\u65B0\u95F4\u9694", "Refresh interval"),
            description: e(
              "\u4EFB\u52A1\u4E8B\u4EF6\u5B9E\u65F6\u66F4\u65B0\uFF1B\u6B64\u95F4\u9694\u4EC5\u7528\u4E8E\u6570\u636E\u5237\u65B0\u3002",
              "Task events update live; this interval controls data refresh.",
            ),
            icon: "refresh",
          },
          React.createElement(Select, {
            label: e("\u5237\u65B0\u95F4\u9694", "Refresh interval"),
            value: String(n.refreshSeconds),
            onChange: (r) => a("refreshSeconds", Number(r)),
            options: [30, 60, 120, 300].map((r) => [
              String(r),
              e(`${r} \u79D2`, `${r} seconds`),
            ]),
          }),
        ),
      ),
      React.createElement(
        SettingGroup,
        { title: e("\u4EFB\u52A1\u8BB0\u5F55", "Task records") },
        React.createElement(
          SettingRow,
          {
            title: e(
              "\u6062\u590D\u5DF2\u79FB\u9664\u7684\u5361\u7247",
              "Restore dismissed cards",
            ),
            description: e(
              "\u53EA\u6062\u590D\u672C\u5730\u5C9B\u5185\u663E\u793A\uFF0C\u4E0D\u4FEE\u6539\u6216\u91CD\u542F Agent \u4F1A\u8BDD\u3002",
              "Restore the local Island view only, without modifying or restarting agent sessions.",
            ),
          },
          React.createElement(
            "button",
            { onClick: () => l("restoreTasks") },
            e("\u6062\u590D\u663E\u793A", "Restore cards"),
          ),
        ),
      ),
      React.createElement(
        "button",
        { className: "quit-row", onClick: () => u(!0) },
        React.createElement(Icon, { name: "power" }),
        e("\u9000\u51FA QuotaView", "Quit QuotaView"),
      ),
      i &&
        React.createElement(
          ConfirmationDialog,
          {
            title: e("\u9000\u51FA QuotaView\uFF1F", "Quit QuotaView?"),
            confirmLabel: e("\u9000\u51FA", "Quit"),
            danger: !0,
            onClose: () => u(!1),
            onConfirm: () => l("quit"),
          },
          React.createElement(
            "p",
            null,
            e(
              "Agent \u4EFB\u52A1\u4F1A\u7EE7\u7EED\u8FD0\u884C\uFF0C\u4F46 QuotaView \u5C06\u505C\u6B62\u76D1\u63A7\u548C\u901A\u77E5\u3002",
              "Agent tasks will keep running, but QuotaView monitoring and notifications will stop.",
            ),
          ),
        ),
    )
  );
}
function IslandPreview() {
  let { t, snapshot: e } = useApp(),
    a = e.tasks.find((l) => !l.parentId);
  return React.createElement(
    "div",
    { className: `island-preview material-${e.settings.material}` },
    React.createElement(
      "div",
      { className: "preview-tag" },
      t(
        "\u5B9E\u65F6\u6570\u636E\u5916\u89C2\u9884\u89C8",
        "Appearance preview \xB7 live data",
      ),
    ),
    React.createElement(
      "div",
      {
        className: "preview-shell",
        style: {
          "--black-ratio": `${(e.settings.blackRatio ?? 0.45) * 100}%`,
        },
      },
      React.createElement(
        "div",
        { className: "preview-toolbar" },
        React.createElement(QuotaCapsule, { compact: !0 }),
        React.createElement(
          "div",
          null,
          React.createElement(Icon, { name: "pin", size: 11 }),
          React.createElement(Icon, { name: "up", size: 11 }),
        ),
      ),
      a
        ? React.createElement(TaskCard, { task: a, onSelect: () => {} })
        : React.createElement(
            "div",
            { className: "preview-empty-task" },
            React.createElement("span", {
              className: `preview-ambient effect-${e.settings.effect}`,
            }),
            React.createElement(
              "div",
              null,
              React.createElement(
                "strong",
                null,
                t(
                  "\u7B49\u5F85\u771F\u5B9E\u4EFB\u52A1",
                  "Waiting for a real task",
                ),
              ),
              React.createElement(
                "span",
                null,
                t(
                  "\u65E0\u6A21\u62DF\u4EFB\u52A1 \xB7 \u65E0\u865A\u6784\u989D\u5EA6",
                  "No simulated tasks or invented quota",
                ),
              ),
            ),
          ),
      React.createElement(
        "div",
        { className: "preview-footer" },
        React.createElement(
          "span",
          null,
          t(
            `${e.tasks.length} \u4E2A\u4F1A\u8BDD`,
            `${e.tasks.length} sessions`,
          ),
        ),
        React.createElement(
          "div",
          null,
          React.createElement(Icon, { name: "refresh", size: 11 }),
          React.createElement(Icon, { name: "settings", size: 11 }),
        ),
      ),
    ),
    e.settings.showCapsule &&
      React.createElement(
        "div",
        { className: "preview-capsule" },
        React.createElement(QuotaCapsule, null),
      ),
  );
}
function IslandSettings() {
  let { t, snapshot: e, setSetting: a } = useApp(),
    l = e.settings;
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(IslandPreview, null),
    React.createElement(
      SettingGroup,
      {
        title: t("\u5916\u89C2\u4E0E\u5E03\u5C40", "Appearance and layout"),
        note: t(
          "磨砂玻璃遵循 Windows 的透明效果设置，不可用时自动使用纯色背景。",
          "Frosted glass follows Windows transparency settings and falls back to a solid surface when unavailable.",
        ),
      },
      React.createElement(
        "button",
        {
          className: `choice-row ${l.material === "glass" ? "selected" : ""}`,
          onClick: () => a("material", "glass"),
        },
        React.createElement(
          "span",
          { className: "row-icon" },
          React.createElement(Icon, { name: "sparkles" }),
        ),
        React.createElement(
          "span",
          null,
          React.createElement("strong", null, t("磨砂玻璃", "Frosted glass")),
          React.createElement(
            "small",
            null,
            t(
              "\u9876\u90E8\u9ED1\u8272\u6E10\u53D8\u3001\u900F\u660E\u5E95\u680F\u4E0E\u6DF1\u8272\u73BB\u7483\u5361\u7247\u3002",
              "Black upper gradient, clear footer and dark glass cards.",
            ),
          ),
        ),
        React.createElement(
          "span",
          { className: "choice-radio" },
          l.material === "glass" &&
            React.createElement(Icon, { name: "check", size: 12 }),
        ),
      ),
      React.createElement(
        "button",
        {
          className: `choice-row ${l.material === "solid" ? "selected" : ""}`,
          onClick: () => a("material", "solid"),
        },
        React.createElement(
          "span",
          { className: "row-icon" },
          React.createElement(Icon, { name: "island" }),
        ),
        React.createElement(
          "span",
          null,
          React.createElement(
            "strong",
            null,
            t("\u7ECF\u5178\u7EAF\u8272", "Classic solid"),
          ),
          React.createElement(
            "small",
            null,
            t(
              "\u5173\u95ED\u5C9B\u4F53\u3001\u5361\u7247\u4E0E\u6309\u94AE\u7684\u534A\u900F\u660E\u6750\u8D28\u3002",
              "Opaque surfaces for the Island, cards and controls.",
            ),
          ),
        ),
        React.createElement(
          "span",
          { className: "choice-radio" },
          l.material === "solid" &&
            React.createElement(Icon, { name: "check", size: 12 }),
        ),
      ),
      l.material === "glass" &&
        React.createElement(
          React.Fragment,
          null,
          React.createElement(
            SettingRow,
            {
              title: t("\u73BB\u7483\u5916\u89C2", "Glass appearance"),
              description: t(
                "\u7EDF\u4E00\u63A7\u5236\u5E95\u90E8\u73BB\u7483\u3001\u6309\u94AE\u4E0E\u7528\u91CF\u80F6\u56CA\u3002",
                "Unify the lower glass, controls and usage capsule.",
              ),
            },
            React.createElement(SegmentedControl, {
              value: l.theme,
              onChange: (n) => a("theme", n),
              label: t("\u73BB\u7483\u5916\u89C2", "Glass appearance"),
              options: [
                ["light", t("\u6D45\u8272", "Light")],
                ["dark", t("\u6DF1\u8272", "Dark")],
                ["system", t("\u81EA\u52A8", "Auto")],
              ],
            }),
          ),
          React.createElement(
            "div",
            { className: "slider-setting" },
            React.createElement(
              "div",
              null,
              React.createElement(
                "label",
                { htmlFor: "glass-ratio" },
                t("\u9ED1\u8272\u8986\u76D6\u8303\u56F4", "Black coverage"),
              ),
              React.createElement(
                "span",
                null,
                Math.round((l.blackRatio ?? 0.45) * 100),
                "%",
              ),
            ),
            React.createElement("input", {
              id: "glass-ratio",
              type: "range",
              min: "20",
              max: "80",
              step: "1",
              value: Math.round((l.blackRatio ?? 0.45) * 100),
              onChange: (n) => a("blackRatio", Number(n.target.value) / 100),
            }),
            React.createElement(
              "div",
              { className: "slider-extents" },
              React.createElement(
                "span",
                null,
                t("\u66F4\u591A\u73BB\u7483", "More glass"),
              ),
              React.createElement(
                "span",
                null,
                t("\u66F4\u591A\u9ED1\u8272", "More black"),
              ),
            ),
          ),
        ),
      React.createElement(
        "div",
        { className: "slider-setting" },
        React.createElement(
          "div",
          null,
          React.createElement(
            "label",
            { htmlFor: "island-width" },
            t("\u5C55\u5F00\u5BBD\u5EA6", "Expanded width"),
          ),
          React.createElement("span", null, l.islandWidth, " px"),
        ),
        React.createElement("input", {
          id: "island-width",
          type: "range",
          min: "420",
          max: "800",
          step: "10",
          value: l.islandWidth,
          onChange: (n) => a("islandWidth", Number(n.target.value)),
        }),
      ),
    ),
    React.createElement(
      SettingGroup,
      { title: t("\u663E\u793A\u5185\u5BB9", "Content") },
      React.createElement(SettingToggle, {
        name: "showCapsule",
        title: t(
          "\u60AC\u6D6E\u7528\u91CF\u80F6\u56CA",
          "Floating quota capsule",
        ),
        description: t(
          "\u5728\u7075\u52A8\u5C9B\u4E0B\u65B9\u663E\u793A\u5269\u4F59\u989D\u5EA6\u4E0E\u91CD\u7F6E\u5012\u8BA1\u65F6\u3002",
          "Show remaining quota and reset countdown below the Island.",
        ),
        icon: "chart",
      }),
      React.createElement(SettingToggle, {
        name: "hoverTransparency",
        title: t("\u60AC\u505C\u900F\u660E\u5EA6", "Hover transparency"),
        description: t(
          "\u9F20\u6807\u7ECF\u8FC7\u6536\u8D77\u6001\u65F6\u964D\u4F4E\u5C9B\u4F53\u4E0D\u900F\u660E\u5EA6\u3002",
          "Lower opacity when the pointer is over the compact Island.",
        ),
        icon: "eye",
      }),
      React.createElement(SettingToggle, {
        name: "privacy",
        title: t("\u9690\u79C1\u6A21\u5F0F", "Privacy mode"),
        description: t(
          "\u9690\u85CF\u4EFB\u52A1\u6B63\u6587\u3001\u6807\u9898\u3001\u8D26\u6237\u4E0E\u7528\u91CF\u6570\u503C\u3002\u5BA1\u6279\u524D\u9700\u5173\u95ED\u5E76\u5BA1\u9605\u3002",
          "Hide task details, titles, accounts and usage values. Turn off to review approvals.",
        ),
        icon: "eyeOff",
      }),
    ),
    React.createElement(
      "section",
      { className: "settings-group" },
      React.createElement(
        "h2",
        null,
        t("\u4EFB\u52A1\u7279\u6548", "Task effects"),
      ),
      React.createElement(
        "div",
        { className: "effect-choices" },
        [
          ["smoke", t("\u72B6\u6001\u70DF\u96FE", "State smoke")],
          ["quantum", t("\u91CF\u5B50\u566A\u70B9", "Quantum noise")],
          ["wave", t("\u6DB2\u6001\u6D8C\u6D6A", "Liquid wave")],
        ].map(([n, i]) =>
          React.createElement(
            "button",
            {
              className: `effect-choice ${l.effect === n ? "selected" : ""}`,
              key: n,
              "aria-pressed": l.effect === n,
              onClick: () => a("effect", n),
            },
            React.createElement(
              "div",
              {
                className: `effect-sample task-card effect-${n}`,
                "aria-hidden": true,
              },
              React.createElement(window.QVEffects.ProgressEffect, {
                react: React,
                effect: n,
                status: "working",
                reduceMotion: l.reduceMotion,
                task: {
                  id: `settings-effect-${n}`,
                  status: "working",
                  progress: { fraction: 0.6 },
                },
              }),
              l.effect === n &&
                React.createElement(
                  "span",
                  null,
                  React.createElement(Icon, { name: "check", size: 10 }),
                ),
            ),
            React.createElement("strong", null, i),
          ),
        ),
      ),
      React.createElement(
        "p",
        { className: "group-note" },
        t(
          "上方特效样本使用演示进度；实际任务仅在 Agent 提供计划时显示进度。",
          "Effect samples above use demonstration progress. Live cards show progress only when the agent provides a plan.",
        ),
      ),
    ),
    React.createElement(
      SettingGroup,
      null,
      React.createElement(SettingToggle, {
        name: "reduceMotion",
        title: t("\u51CF\u5C11\u52A8\u6001\u6548\u679C", "Reduce motion"),
        description: t(
          "\u4FDD\u7559\u72B6\u6001\u8272\u4E0E\u9759\u6001\u8FDB\u5EA6\uFF0C\u505C\u7528\u88C5\u9970\u52A8\u753B\u3002\u7CFB\u7EDF\u8BBE\u7F6E\u4E5F\u4F1A\u88AB\u5C0A\u91CD\u3002",
          "Keep state colors and static progress without decorative animation. System preferences are also respected.",
        ),
        icon: "pause",
      }),
    ),
    React.createElement(
      SettingGroup,
      { title: t("\u81EA\u52A8\u5C55\u5F00", "Automatic opening") },
      React.createElement(SettingToggle, {
        name: "autoExpand",
        title: t("\u81EA\u52A8\u5F39\u51FA", "Automatic popups"),
        description: t(
          "\u54CD\u5E94\u65B0\u4EFB\u52A1\u3001\u5B8C\u6210\u6216\u5F85\u786E\u8BA4\u4E8B\u4EF6\u3002",
          "Open for new tasks, completions or requests.",
        ),
        icon: "island",
      }),
      React.createElement(SettingToggle, {
        name: "autoExpandOnStart",
        title: t("\u65B0\u4EFB\u52A1\u5F00\u59CB", "New task starts"),
        disabled: !l.autoExpand,
      }),
      React.createElement(SettingToggle, {
        name: "autoExpandOnApproval",
        title: t("\u9700\u8981\u786E\u8BA4", "Confirmation needed"),
        disabled: !l.autoExpand,
      }),
      React.createElement(SettingToggle, {
        name: "autoExpandOnComplete",
        title: t("\u4EFB\u52A1\u5B8C\u6210", "Task completes"),
        disabled: !l.autoExpand,
      }),
      React.createElement(
        SettingRow,
        {
          title: t("\u505C\u7559\u65F6\u95F4", "Stay open for"),
          description: t(
            "\u5F85\u786E\u8BA4\u3001\u9F20\u6807\u60AC\u505C\u6216\u56FA\u5B9A\u65F6\u4FDD\u6301\u5C55\u5F00\u3002",
            "Stay open for pending requests, hover or when pinned.",
          ),
        },
        React.createElement(Select, {
          label: t("\u505C\u7559\u65F6\u95F4", "Stay open for"),
          value: String(l.collapseDelaySeconds),
          disabled: !l.autoExpand,
          onChange: (n) => a("collapseDelaySeconds", Number(n)),
          options: [5, 8, 12, 15, 20, 30, 60].map((n) => [
            String(n),
            t(`${n} \u79D2`, `${n} s`),
          ]),
        }),
      ),
      React.createElement(
        SettingRow,
        {
          title: t("\u7A7A\u95F2\u540E\u6536\u8D77", "Collapse after idle"),
          description: t(
            "\u56FA\u5B9A\u6216\u7B49\u5F85\u786E\u8BA4\u65F6\u4E0D\u4F1A\u81EA\u52A8\u6536\u8D77\u30020 \u8868\u793A\u5173\u95ED\u3002",
            "Never auto-collapses while pinned or awaiting confirmation. 0 disables.",
          ),
        },
        React.createElement(Select, {
          label: t("\u6536\u8D77\u5EF6\u8FDF", "Collapse delay"),
          value: String(l.compactDelaySeconds),
          onChange: (n) => a("compactDelaySeconds", Number(n)),
          options: [0, 5, 15, 30, 60, 120, 300].map((n) => [
            String(n),
            n === 0 ? t("\u5173\u95ED", "Off") : t(`${n} \u79D2`, `${n} s`),
          ]),
        }),
      ),
      React.createElement(
        SettingRow,
        {
          title: t("\u7A7A\u95F2\u540E\u9690\u85CF", "Hide after idle"),
          description: t(
            "\u65E0\u6D3B\u52A8\u4EFB\u52A1\u65F6\u624D\u9690\u85CF\uFF0C\u53EF\u901A\u8FC7\u7CFB\u7EDF\u6258\u76D8\u6062\u590D\u30020 \u8868\u793A\u4FDD\u6301\u53EF\u89C1\u3002",
            "Hides only without active tasks. Restore from the tray. 0 keeps it visible.",
          ),
        },
        React.createElement(Select, {
          label: t("\u9690\u85CF\u5EF6\u8FDF", "Hide delay"),
          value: String(l.hiddenDelaySeconds),
          onChange: (n) => a("hiddenDelaySeconds", Number(n)),
          options: [0, 30, 60, 120, 300, 600].map((n) => [
            String(n),
            n === 0 ? t("\u5173\u95ED", "Off") : t(`${n} \u79D2`, `${n} s`),
          ]),
        }),
      ),
    ),
  );
}
function UsageSettings() {
  let { t, snapshot: e, setSetting: a } = useApp(),
    [l, n] = React.useState(!1);
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      SettingGroup,
      { title: t("\u989D\u5EA6\u4E0E\u8D26\u6237", "Quota and account") },
      React.createElement(SettingToggle, {
        name: "showRemainingQuota",
        title: t("\u5269\u4F59\u989D\u5EA6", "Remaining quota"),
        icon: "chart",
      }),
      React.createElement(SettingToggle, {
        name: "showResetCountdown",
        title: t("\u91CD\u7F6E\u5012\u8BA1\u65F6", "Reset countdown"),
        icon: "clock",
      }),
      React.createElement(SettingToggle, {
        name: "showSparkQuota",
        title: t("Spark \u72EC\u7ACB\u989D\u5EA6", "Separate Spark quota"),
        description: t(
          "\u4EC5\u5728\u771F\u5B9E\u5FEB\u7167\u5305\u542B Spark \u989D\u5EA6\u65F6\u663E\u793A\u3002",
          "Shown only when the real snapshot contains Spark quota.",
        ),
      }),
      React.createElement(SettingToggle, {
        name: "showCreditBalance",
        title: t("\u79EF\u5206\u4F59\u989D", "Credit balance"),
      }),
    ),
    React.createElement(
      SettingGroup,
      { title: t("\u7528\u91CF\u6458\u8981", "Usage summary") },
      React.createElement(SettingToggle, {
        name: "showUsageSummary",
        title: t("\u663E\u793A\u7528\u91CF\u6458\u8981", "Show usage summary"),
        icon: "chart",
      }),
      React.createElement(SettingToggle, {
        name: "showDailyTokens",
        title: t("\u4ECA\u65E5 Tokens", "Today\u2019s tokens"),
        disabled: !e.settings.showUsageSummary,
      }),
      React.createElement(SettingToggle, {
        name: "showThirtyDayTokens",
        title: t("\u6700\u8FD1 30 \u5929 Tokens", "Last 30 days tokens"),
        disabled: !e.settings.showUsageSummary,
      }),
      React.createElement(SettingToggle, {
        name: "showLifetimeTokens",
        title: t("\u7D2F\u8BA1 Tokens", "Lifetime tokens"),
        description: t(
          "\u4F18\u5148\u663E\u793A\u8D26\u6237\u7D2F\u8BA1\uFF1B\u5426\u5219\u6CE8\u660E\u4E3A\u53EF\u80FD\u4E0D\u5B8C\u6574\u7684\u672C\u5730\u8BB0\u5F55\u3002",
          "Use account lifetime totals if available; otherwise label local history as potentially partial.",
        ),
        disabled: !e.settings.showUsageSummary,
      }),
    ),
    React.createElement(
      SettingGroup,
      { title: t("\u5386\u53F2\u6A21\u5757", "History modules") },
      React.createElement(SettingToggle, {
        name: "showTokens",
        title: t("Token \u7528\u91CF", "Token usage"),
        description: t(
          "\u6BCF\u65E5\u8BB0\u5F55\u4E0E\u8F93\u5165\u3001\u8F93\u51FA\u3001\u7F13\u5B58\u7EC6\u5206\u3002",
          "Daily records with input, output and cached tokens.",
        ),
        icon: "chart",
      }),
      React.createElement(SettingToggle, {
        name: "showCost",
        title: t("\u6210\u672C\u4F30\u7B97", "Cost estimate"),
        description: t(
          "\u6839\u636E\u5DF2\u77E5\u6A21\u578B\u4EF7\u683C\u4F30\u7B97\u672C\u5730\u6D3B\u52A8\uFF0C\u4E0D\u7B49\u4E8E\u5B9E\u9645\u8D26\u5355\u3002",
          "Estimate local activity with known model pricing, not actual billing.",
        ),
        icon: "chart",
      }),
      React.createElement(SettingToggle, {
        name: "showActivity",
        title: t("Token \u6D3B\u52A8", "Token activity"),
        description: t(
          "\u6BCF\u65E5\u7528\u91CF\u6D3B\u52A8\u4E0E\u5386\u53F2\u8BB0\u5F55\u3002",
          "Daily usage activity and history.",
        ),
        icon: "chart",
      }),
      React.createElement(
        SettingRow,
        {
          title: t(
            "\u9ED8\u8BA4\u5386\u53F2\u8303\u56F4",
            "Default history range",
          ),
        },
        React.createElement(Select, {
          label: t("\u5386\u53F2\u8303\u56F4", "History range"),
          value: e.settings.tokenActivityRange,
          onChange: (o) => a("tokenActivityRange", o),
          options: [
            ["week", t("\u4E00\u5468", "One week")],
            ["month", t("\u4E00\u4E2A\u6708", "One month")],
            ["threeMonths", t("\u4E09\u4E2A\u6708", "Three months")],
            ["sixMonths", t("\u516D\u4E2A\u6708", "Six months")],
          ],
        }),
      ),
    ),
    React.createElement(
      Notice,
      null,
      t(
        "\u672A\u83B7\u5F97\u7684\u6570\u636E\u4F1A\u663E\u793A\u4E3A\u201C\u2014\u201D\uFF0C\u4E0D\u5F53\u4F5C 0\u3002\u8D26\u6237\u603B\u91CF\u4E0E\u672C\u5730\u4F30\u7B97\u5355\u72EC\u5C55\u793A\uFF0C\u7EDD\u4E0D\u91CD\u590D\u76F8\u52A0\u3002",
        "Unavailable data is shown as \u201C\u2014\u201D, not zero. Account totals and local estimates stay separate and are never double counted.",
      ),
    ),
    React.createElement(
      "button",
      {
        className: "primary-button",
        onClick: () => {
          n(!l);
        },
      },
      l
        ? t("\u6536\u8D77\u7528\u91CF\u7EDF\u8BA1", "Hide usage statistics")
        : t("\u67E5\u770B\u7528\u91CF\u7EDF\u8BA1", "View usage statistics"),
    ),
    l &&
      React.createElement(
        "div",
        { className: "settings-usage" },
        React.createElement(UsageView, { full: !0 }),
      ),
  );
}
function CodexSettings() {
  let { t, snapshot: e, invoke: a, busy: l } = useApp(),
    [n, i] = React.useState(null),
    [u, o] = React.useState(!1),
    [c, r] = React.useState(e.settings.codexHookScope || "all"),
    [g, m] = React.useState(!1);
  async function f() {
    let N = await a("inspectCodexHooks");
    N && (i(N), m(!1));
  }
  async function p() {
    (await a("configure", {
      provider: "codex",
      enabled: !0,
      options: { activityHooks: !0, scope: c, enableFeature: g },
    })) !== null && o(!1);
  }
  let w = e.providers.codex?.hooks;
  return React.createElement(
    "div",
    { className: "hook-settings" },
    React.createElement(
      "h4",
      null,
      t("\u53EF\u9009\u4EFB\u52A1\u4E8B\u4EF6 Hook", "Optional activity Hooks"),
    ),
    React.createElement(
      Notice,
      null,
      t(
        "\u81EA\u52A8\u8BFB\u53D6\u4F1A\u8BDD\u8BB0\u5F55\u65E0\u9700 Hook\u3002\u6B64\u589E\u5F3A\u529F\u80FD\u8865\u5145\u5B9E\u65F6\u4EFB\u52A1\u548C\u4E0A\u4E0B\u6587\u538B\u7F29\u4E8B\u4EF6\uFF0C\u4E0D\u6388\u4E88 Codex Desktop \u5BA1\u6279\u6743\u9650\u3002",
        "Automatic session reading works without Hooks. This enhancement adds live task and compaction events, not Codex Desktop approval authority.",
      ),
    ),
    React.createElement(
      SettingRow,
      {
        title: t(
          "\u4EFB\u52A1\u4E8B\u4EF6\u8FDE\u63A5",
          "Activity event connection",
        ),
        description:
          w?.error ||
          (w?.connected
            ? t("\u5DF2\u63A5\u6536 Hook \u4E8B\u4EF6", "Hook events received")
            : e.settings.codexActivityHooks
              ? t(
                  "\u5DF2\u914D\u7F6E\uFF0C\u7B49\u5F85\u4FE1\u4EFB\u6216\u65B0\u4F1A\u8BDD\u4E8B\u4EF6",
                  "Configured, awaiting trust or a new session event",
                )
              : t("\u5F53\u524D\u5173\u95ED", "Currently disabled")),
      },
      React.createElement(Toggle, {
        label: t(
          "\u542F\u7528 Codex \u4EFB\u52A1 Hook",
          "Enable Codex activity Hooks",
        ),
        checked: e.settings.codexActivityHooks,
        disabled: l.configure,
        onChange: (N) => {
          N
            ? (o(!0), f())
            : a("configure", {
                provider: "codex",
                enabled: e.settings.providers.codex,
                options: { activityHooks: !1 },
              });
        },
      }),
    ),
    React.createElement(
      "button",
      { onClick: f, disabled: l.inspectCodexHooks },
      t("\u68C0\u67E5 Hook \u652F\u6301", "Inspect Hook support"),
    ),
    n &&
      React.createElement(
        "p",
        { className: "source-note" },
        n.version,
        " \xB7 ",
        n.featureEnabled
          ? t(
              "\u5BA2\u6237\u7AEF Hook \u529F\u80FD\u5DF2\u5F00\u542F",
              "Client Hooks feature enabled",
            )
          : t(
              "\u5BA2\u6237\u7AEF Hook \u529F\u80FD\u672A\u5F00\u542F",
              "Client Hooks feature disabled",
            ),
      ),
    u &&
      React.createElement(
        ConfirmationDialog,
        {
          title: t(
            "\u914D\u7F6E Codex \u4EFB\u52A1 Hook\uFF1F",
            "Configure Codex activity Hooks?",
          ),
          confirmLabel: t("\u4FDD\u5B58\u5E76\u542F\u7528", "Save and enable"),
          onClose: () => o(!1),
          disabled: !n || (!n.featureEnabled && !g) || l.configure,
          onConfirm: p,
        },
        React.createElement(
          "p",
          null,
          t(
            "\u5C06\u5907\u4EFD\u5E76\u66F4\u65B0\u6240\u9009 Codex \u6570\u636E\u76EE\u5F55\u7684 hooks.json\uFF0C\u53EA\u7BA1\u7406 QuotaView \u81EA\u5DF1\u7684\u6761\u76EE\u3002\u65B0\u4F1A\u8BDD\u53EF\u80FD\u9700\u8981\u91CD\u542F\u5E76\u5728 Codex \u4E2D\u786E\u8BA4\u4FE1\u4EFB\u3002",
            "Back up and update hooks.json in the selected Codex directory, managing only QuotaView-owned entries. Restart the session and approve trust in Codex if needed.",
          ),
        ),
        React.createElement(Select, {
          label: t("Hook \u8303\u56F4", "Hook scope"),
          value: c,
          onChange: r,
          options: [
            [
              "all",
              t("\u5168\u90E8\u4EFB\u52A1\u4E8B\u4EF6", "All task events"),
            ],
            [
              "compaction",
              t(
                "\u4EC5\u4E0A\u4E0B\u6587\u538B\u7F29",
                "Context compaction only",
              ),
            ],
          ],
        }),
        n
          ? !n.featureEnabled &&
              React.createElement(
                "label",
                { className: "confirmation-checkbox" },
                React.createElement("input", {
                  type: "checkbox",
                  checked: g,
                  onChange: (N) => m(N.target.checked),
                }),
                React.createElement(
                  "span",
                  null,
                  t(
                    "\u540C\u65F6\u901A\u8FC7 Codex CLI \u5F00\u542F Hook \u529F\u80FD\u6807\u5FD7\u3002\u8FD9\u4F1A\u66F4\u65B0 Codex \u914D\u7F6E\uFF1B\u4E0D\u52FE\u9009\u5219\u4E0D\u66F4\u6539\u539F\u6709\u7981\u7528\u8BBE\u7F6E\u3002",
                    "Also enable the Hook feature through Codex CLI. This updates Codex configuration; leave unchecked to preserve the disabled setting.",
                  ),
                ),
              )
          : React.createElement(
              "p",
              null,
              t(
                "\u6B63\u5728\u68C0\u67E5\u529F\u80FD\u652F\u6301\uFF1B\u6210\u529F\u540E\u624D\u80FD\u542F\u7528\u3002",
                "Inspecting support. Enabling requires a successful check.",
              ),
            ),
      ),
  );
}
function IntegrationSettings({ provider: t }) {
  let { t: e, snapshot: a, invoke: l, setSetting: n, busy: i } = useApp(),
    u = a.settings,
    [o, c] = React.useState(
      t === "codex"
        ? u.codexHome
        : t === "claude"
          ? u.claudeHome
          : t === "dsh"
            ? (u.dshRoots || []).join(`
`)
            : "",
    ),
    [r, g] = React.useState(u.codexPath || ""),
    [m, f] = React.useState(!1),
    [p, w] = React.useState(""),
    N = a.providers[t] || {};
  async function D() {
    let h = await l("chooseDirectory"),
      x = typeof h == "string" ? h : h?.path;
    x && c(x);
  }
  async function v() {
    if ((N.enabled ?? u.providers[t]) && t !== "codex") {
      f(!0);
      return;
    }
    await d();
  }
  async function d() {
    w("");
    let h =
      t === "codex"
        ? { codexHome: o.trim(), codexPath: r.trim() }
        : t === "claude"
          ? { claudeHome: o.trim() }
          : {
              dshRoots: o
                .split(
                  `
`,
                )
                .map((T) => T.trim())
                .filter(Boolean),
            };
    if ((await l("updateSettings", h)) !== null) {
      if (
        (N.enabled ?? u.providers[t]) &&
        t !== "codex" &&
        (await l("configure", {
          provider: t,
          enabled: !0,
          options:
            t === "claude"
              ? { home: o.trim() || void 0 }
              : { roots: h.dshRoots },
        })) === null
      ) {
        w(
          e(
            "\u504F\u597D\u5DF2\u4FDD\u5B58\uFF0C\u4F46\u8FDE\u63A5\u8FC1\u79FB\u672A\u5B8C\u6210\u3002\u8BF7\u67E5\u770B\u9519\u8BEF\u5E76\u91CD\u65B0\u8FDE\u63A5\u3002",
            "Preferences were saved, but connection migration did not complete. Review the error and reconnect.",
          ),
        );
        return;
      }
      (f(!1),
        w(
          e(
            "\u8DEF\u5F84\u4E0E\u8FDE\u63A5\u914D\u7F6E\u5DF2\u66F4\u65B0\u3002",
            "Paths and connection configuration updated.",
          ),
        ));
    }
  }
  return React.createElement(
    "div",
    { className: "connection-details" },
    N.message && React.createElement("p", null, N.message),
    N.error && React.createElement(Notice, { tone: "warning" }, N.error),
    t === "codex" &&
      React.createElement(
        Notice,
        null,
        e(
          "可查看额度和任务状态。Windows 上 Codex Desktop 的审批、问题回复和中断操作需要回到 Codex 完成。",
          "Quota and task observation are available. Codex Desktop approvals, questions and interruption must be handled in Codex on Windows.",
        ),
      ),
    t === "claude" &&
      React.createElement(
        Notice,
        null,
        e(
          "\u542F\u7528\u4F1A\u5B89\u88C5 QuotaView \u4E13\u5C5E Hook\uFF0C\u4FDD\u7559\u5E76\u5907\u4EFD\u73B0\u6709\u914D\u7F6E\u3002\u4EC5\u6765\u81EA\u6B64\u8FDE\u63A5\u7684 PermissionRequest \u53EF\u5728\u5C9B\u5185\u54CD\u5E94\u3002",
          "Enabling installs QuotaView-owned Hooks while preserving and backing up existing configuration. Only PermissionRequests from this connection can be answered here.",
        ),
      ),
    t === "dsh" &&
      React.createElement(
        Notice,
        null,
        e(
          "\u8BFB\u53D6\u672C\u673A DSH \u63D2\u4EF6\u4E8B\u4EF6\u3002\u542F\u7528\u65F6\u4F1A\u53D1\u73B0\u9ED8\u8BA4 DSH\u3001\u5E94\u7528\u6570\u636E\u4E2D\u7684\u914D\u7F6E\u4EE5\u53CA\u4E0B\u65B9\u989D\u5916\u76EE\u5F55\uFF0C\u5E76\u5907\u4EFD\u3001\u4FEE\u6539\u5176\u4E2D\u7684 DSH \u914D\u7F6E\u3002",
          "Reads local DSH plugin events. Enabling discovers default DSH and app-data profiles plus the extra roots below, then backs up and updates those DSH configurations.",
        ),
      ),
    t === "kimi" &&
      React.createElement(
        Notice,
        null,
        e(
          "\u4EC5\u663E\u793A\u5F53\u524D\u96C6\u6210\u80FD\u591F\u9A8C\u8BC1\u7684\u4E8B\u4EF6\uFF1B\u672A\u77E5\u72B6\u6001\u548C\u989D\u5EA6\u4FDD\u6301\u672A\u77E5\u3002",
          "Shows only events verified by this integration; unavailable state and quota remain unknown.",
        ),
      ),
    t !== "kimi" &&
      React.createElement(
        React.Fragment,
        null,
        React.createElement(Metric, {
          label:
            t === "dsh"
              ? e(
                  "\u989D\u5916\u9879\u76EE\u6839\u76EE\u5F55\uFF08\u6BCF\u884C\u4E00\u4E2A\uFF09",
                  "Extra project roots (one per line)",
                )
              : e(
                  "\u6570\u636E\u76EE\u5F55\uFF08\u7559\u7A7A\u4F7F\u7528\u9ED8\u8BA4\u4F4D\u7F6E\uFF09",
                  "Data directory (empty for default)",
                ),
          value: o,
          onChange: c,
          multiline: t === "dsh",
          placeholder:
            t === "codex"
              ? "%USERPROFILE%\\.codex"
              : t === "claude"
                ? "%USERPROFILE%\\.claude"
                : "C:\\Projects\\my-project",
        }),
        t === "codex" &&
          React.createElement(Metric, {
            label: e(
              "Codex \u53EF\u6267\u884C\u6587\u4EF6\uFF08\u7559\u7A7A\u81EA\u52A8\u67E5\u627E\uFF09",
              "Codex executable (empty to auto-detect)",
            ),
            value: r,
            onChange: g,
            placeholder: "codex.exe",
          }),
        React.createElement(
          "div",
          { className: "connection-buttons" },
          React.createElement(
            "button",
            { onClick: D },
            React.createElement(Icon, { name: "folder", size: 13 }),
            e("\u9009\u62E9\u76EE\u5F55\u2026", "Choose directory\u2026"),
          ),
          React.createElement(
            "button",
            {
              onClick: () => {
                (c(""), t === "codex" && g(""));
              },
            },
            e("\u6062\u590D\u9ED8\u8BA4", "Use default"),
          ),
          React.createElement(
            "button",
            {
              className: "primary-button",
              disabled: i.updateSettings || i.configure,
              onClick: v,
            },
            (N.enabled ?? u.providers[t]) && t !== "codex"
              ? e(
                  "\u4FDD\u5B58\u5E76\u91CD\u65B0\u8FDE\u63A5\u2026",
                  "Save and reconnect\u2026",
                )
              : e("\u4FDD\u5B58\u8DEF\u5F84", "Save paths"),
          ),
        ),
      ),
    t === "codex" && React.createElement(CodexSettings, null),
    N.lastEventAt &&
      React.createElement(
        "p",
        { className: "source-note" },
        e("\u6700\u8FD1\u4E8B\u4EF6\uFF1A", "Last event: "),
        new Date(N.lastEventAt).toLocaleString(),
      ),
    React.createElement(
      "div",
      { className: "connection-buttons" },
      React.createElement(
        "button",
        {
          onClick: () =>
            t === "dsh" && (N.enabled ?? u.providers[t]) ? f(!0) : l("refresh"),
          disabled: i.refresh || i.configure,
        },
        React.createElement(Icon, { name: "refresh", size: 13 }),
        t === "dsh" && (N.enabled ?? u.providers[t])
          ? e(
              "\u91CD\u65B0\u53D1\u73B0\u5E76\u5B89\u88C5\u2026",
              "Rediscover and install\u2026",
            )
          : e("\u91CD\u65B0\u68C0\u67E5", "Recheck"),
      ),
    ),
    p && React.createElement(Notice, null, p),
    m &&
      React.createElement(
        ConfirmationDialog,
        {
          title: e(
            "\u4FDD\u5B58\u5E76\u91CD\u65B0\u8FDE\u63A5\uFF1F",
            "Save and reconnect?",
          ),
          confirmLabel: e(
            "\u66F4\u65B0\u63A5\u5165\u914D\u7F6E",
            "Update integration",
          ),
          onClose: () => f(!1),
          onConfirm: d,
        },
        React.createElement(
          "p",
          null,
          e(
            "\u8FD9\u4F1A\u5907\u4EFD\u914D\u7F6E\u3001\u79FB\u9664\u65E7\u76EE\u5F55\u4E2D\u4EC5\u5C5E\u4E8E QuotaView \u7684\u6761\u76EE\uFF0C\u5E76\u5728\u4EE5\u4E0B\u65B0\u76EE\u5F55\u4E2D\u5B89\u88C5\u63A5\u5165\u3002\u5176\u4ED6 Hook \u548C\u8BBE\u7F6E\u5C06\u4FDD\u7559\u3002",
            "This backs up configuration, removes only QuotaView-owned entries from old locations and installs the integration in the locations below. Other Hooks and settings are preserved.",
          ),
        ),
        React.createElement(
          "pre",
          null,
          o.trim() ||
            e("\u9ED8\u8BA4\u6570\u636E\u76EE\u5F55", "Default data directory"),
        ),
        t === "dsh" &&
          React.createElement(
            "p",
            null,
            e(
              "\u8FD8\u4F1A\u68C0\u67E5\u9ED8\u8BA4 DSH \u76EE\u5F55\u3001DSH_HOME \u4E0E\u5E94\u7528\u6570\u636E\u4E0B\u53D1\u73B0\u7684 DSH \u914D\u7F6E\u3002",
              "Also checks default DSH, DSH_HOME and discovered app-data DSH profiles.",
            ),
          ),
        React.createElement(
          "p",
          null,
          e(
            "\u65B0\u4F1A\u8BDD\u53EF\u80FD\u9700\u8981\u91CD\u542F\u540E\u624D\u4F1A\u4EA7\u751F\u4E8B\u4EF6\u3002",
            "New sessions may need a restart before events arrive.",
          ),
        ),
      ),
  );
}
function ConnectionSettings() {
  let { t, snapshot: e, invoke: a, busy: l } = useApp(),
    [n, i] = React.useState("codex"),
    [u, o] = React.useState(null);
  async function c(r, g) {
    (await a("configure", {
      provider: r,
      enabled: g,
      options: {
        codexHome: e.settings.codexHome,
        claudeHome: e.settings.claudeHome,
        dshRoots: e.settings.dshRoots,
        executable: e.settings.codexPath,
      },
    }),
      o(null));
  }
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "div",
      { className: "group-box connection-list" },
      PROVIDERS.map((r) => {
        let g = e.providers[r] || {},
          m = g.enabled ?? e.settings.providers[r];
        return React.createElement(
          "section",
          { className: "provider-section", key: r },
          React.createElement(
            "div",
            { className: "provider-row" },
            React.createElement(
              "button",
              {
                className: "provider-heading",
                onClick: () => i(n === r ? null : r),
                "aria-expanded": n === r,
              },
              React.createElement(ProviderIcon, { provider: r, size: 24 }),
              React.createElement("strong", null, PROVIDER_LABELS[r]),
              React.createElement(Icon, {
                name: n === r ? "down" : "right",
                size: 12,
              }),
            ),
            React.createElement(
              "span",
              {
                className: `connection-state ${g.connected ? "connected" : ""} ${g.error ? "error" : ""}`,
              },
              React.createElement("i", null),
              m
                ? g.error
                  ? t("\u9700\u8981\u5904\u7406", "Needs attention")
                  : g.connected
                    ? t("\u5DF2\u8FDE\u63A5", "Connected")
                    : t("\u7B49\u5F85\u6570\u636E", "Awaiting data")
                : t("\u5DF2\u505C\u7528", "Disabled"),
            ),
            React.createElement(Toggle, {
              label: t(
                `\u542F\u7528 ${PROVIDER_LABELS[r]}`,
                `Enable ${PROVIDER_LABELS[r]}`,
              ),
              checked: m,
              disabled: l.configure,
              onChange: (f) => (f ? o(r) : c(r, !1)),
            }),
          ),
          n === r && React.createElement(IntegrationSettings, { provider: r }),
        );
      }),
    ),
    React.createElement(
      "p",
      { className: "group-note" },
      t(
        "\u8FDE\u63A5\u5706\u70B9\u53EA\u8868\u793A\u6700\u8FD1\u7684\u6570\u636E\u8BFB\u53D6\u662F\u5426\u6709\u6548\uFF0C\u4E0D\u4EE3\u8868\u767B\u5F55\u72B6\u6001\u6216\u4FDD\u8BC1\u8D26\u6237\u53EF\u7528\u3002\u505C\u7528\u4F1A\u505C\u6B62\u5BF9\u5E94\u540E\u53F0\u5DE5\u4F5C\u3002",
        "Connection dots indicate the latest successful data read, not login status or guaranteed account access. Disabling stops the related background work.",
      ),
    ),
    React.createElement(
      Notice,
      { icon: "shield" },
      t(
        "\u9ED8\u8BA4\u4EC5\u5904\u7406\u672C\u673A\u6570\u636E\uFF0C\u4E0D\u4E0A\u4F20\u4EFB\u52A1\u5185\u5BB9\u3002\u542F\u7528\u63A5\u5165\u4E0D\u4F1A\u66FF\u4F60\u767B\u5F55\u8D26\u6237\u3002",
        "Local data stays local by default. Enabling an integration does not sign you in to an account.",
      ),
    ),
    u &&
      React.createElement(
        ConfirmationDialog,
        {
          title: t(
            `\u542F\u7528 ${PROVIDER_LABELS[u]} \u63A5\u5165\uFF1F`,
            `Enable ${PROVIDER_LABELS[u]}?`,
          ),
          confirmLabel: t("\u542F\u7528\u8FDE\u63A5", "Enable integration"),
          onClose: () => o(null),
          onConfirm: () => c(u, !0),
        },
        React.createElement(
          "p",
          null,
          u === "codex"
            ? t(
                "QuotaView \u5C06\u8BFB\u53D6\u4F60\u9009\u62E9\u7684 Codex \u6570\u636E\u76EE\u5F55\u5E76\u8FDE\u63A5\u672C\u5730 App Server\u3002",
                "QuotaView will read the selected Codex data directory and connect to the local App Server.",
              )
            : t(
                "\u8FD9\u4F1A\u5728\u6240\u9009\u5BA2\u6237\u7AEF\u6216\u9879\u76EE\u4E2D\u5B89\u88C5 QuotaView \u4E13\u5C5E\u4E8B\u4EF6 Hook\uFF0C\u5E76\u5907\u4EFD\u5DF2\u6709\u914D\u7F6E\u3002\u65B0\u4F1A\u8BDD\u53EF\u80FD\u9700\u8981\u91CD\u542F\u624D\u80FD\u8FDE\u63A5\u3002",
                "This installs QuotaView-owned event Hooks in the selected client or project and backs up existing configuration. Restart the session if needed to connect.",
              ),
        ),
        React.createElement(
          "p",
          null,
          t(
            "\u53EA\u6709\u672C\u8FDE\u63A5\u6301\u6709\u7684\u771F\u5B9E\u6743\u9650\u8BF7\u6C42\u53EF\u4EE5\u5728 QuotaView \u5185\u54CD\u5E94\u3002",
            "Only real permission requests owned by this connection can be answered in QuotaView.",
          ),
        ),
      ),
  );
}
function ProxySettings() {
  let { snapshot: t, t: e, invoke: a, busy: l } = useApp(),
    [n, i] = React.useState(t.settings.proxy?.mode || "system"),
    [u, o] = React.useState(t.settings.proxy?.url || ""),
    [c, r] = React.useState("");
  async function g() {
    if ((r(""), n === "manual"))
      try {
        let f = new URL(u);
        if (
          !["http:", "https:", "socks5:"].includes(f.protocol) ||
          f.username ||
          f.password
        )
          throw new Error();
      } catch {
        r(
          e(
            "\u8BF7\u8F93\u5165 HTTP\u3001HTTPS \u6216 SOCKS5 \u4EE3\u7406\u5730\u5740\uFF0C\u4E0D\u8981\u5728\u5730\u5740\u4E2D\u5305\u542B\u7528\u6237\u540D\u6216\u5BC6\u7801\u3002",
            "Enter an HTTP, HTTPS or SOCKS5 proxy URL without a username or password.",
          ),
        );
        return;
      }
    await a("updateSettings", {
      proxy: { mode: n, url: n === "manual" ? u.trim() : "" },
    });
  }
  let m =
    n !== (t.settings.proxy?.mode || "system") ||
    (n === "manual" && u !== (t.settings.proxy?.url || ""));
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "div",
      { className: "proxy-preview" },
      React.createElement(
        "div",
        { className: "proxy-route" },
        React.createElement(
          "div",
          null,
          React.createElement(
            "span",
            null,
            React.createElement("img", {
              src: "../assets/app-icon.png",
              width: "34",
              height: "34",
              alt: "",
            }),
          ),
          React.createElement("strong", null, "QuotaView"),
        ),
        React.createElement("i", null),
        React.createElement(
          "div",
          null,
          React.createElement(
            "span",
            null,
            React.createElement(Icon, { name: "globe", size: 26 }),
          ),
          React.createElement(
            "strong",
            null,
            n === "direct"
              ? e("\u76F4\u8FDE", "Direct")
              : n === "system"
                ? e("\u7CFB\u7EDF\u4EE3\u7406", "System proxy")
                : e("\u624B\u52A8\u4EE3\u7406", "Manual proxy"),
          ),
        ),
        React.createElement("i", null),
        React.createElement(
          "div",
          null,
          React.createElement(
            "span",
            null,
            React.createElement(Icon, { name: "download", size: 26 }),
          ),
          React.createElement(
            "strong",
            null,
            e("\u66F4\u65B0\u670D\u52A1", "Update service"),
          ),
        ),
      ),
      React.createElement(
        "p",
        null,
        e(
          "用于更新检查和 QuotaView 的 Codex 额度连接；其他 Agent 进程保留自身网络设置。",
          "Applies to update checks and the QuotaView Codex quota connection. Other agent processes keep their own network settings.",
        ),
      ),
    ),
    React.createElement(
      SettingGroup,
      { title: e("\u4EE3\u7406\u914D\u7F6E", "Proxy configuration") },
      React.createElement(
        SettingRow,
        {
          title: e("\u8FDE\u63A5\u65B9\u5F0F", "Connection mode"),
          icon: "globe",
        },
        React.createElement(Select, {
          label: e("\u8FDE\u63A5\u65B9\u5F0F", "Connection mode"),
          value: n,
          onChange: i,
          options: [
            ["system", e("\u8DDF\u968F Windows", "Use Windows settings")],
            [
              "direct",
              e("\u4E0D\u4F7F\u7528\u4EE3\u7406", "Direct connection"),
            ],
            ["manual", e("\u624B\u52A8\u4EE3\u7406", "Manual proxy")],
          ],
        }),
      ),
      n === "manual" &&
        React.createElement(
          "div",
          { className: "proxy-field" },
          React.createElement(Metric, {
            label: e("\u4EE3\u7406\u5730\u5740", "Proxy URL"),
            value: u,
            onChange: o,
            placeholder: "http://127.0.0.1:7890",
          }),
        ),
    ),
    c && React.createElement(Notice, { tone: "warning" }, c),
    React.createElement(
      Notice,
      null,
      e(
        "Codex CLI \u548C\u5176\u4ED6 Agent \u4F7F\u7528\u5404\u81EA\u7684\u73AF\u5883\u53D8\u91CF\u6216\u5BA2\u6237\u7AEF\u4EE3\u7406\u8BBE\u7F6E\u3002\u6B64\u9009\u9879\u4E0D\u4F1A\u5077\u5077\u4FEE\u6539\u5B83\u4EEC\uFF0C\u4E5F\u4E0D\u8868\u793A\u4EE3\u7406\u5DF2\u7ECF\u901A\u8FC7\u8FDE\u901A\u6027\u6D4B\u8BD5\u3002",
        "Codex CLI and other agents use their own environment or client proxy settings. This option does not modify them and does not imply a successful connectivity test.",
      ),
    ),
    React.createElement(
      "button",
      {
        className: "primary-button",
        disabled: !m || l.updateSettings,
        onClick: g,
      },
      e("\u4FDD\u5B58\u4EE3\u7406\u8BBE\u7F6E", "Save proxy settings"),
    ),
  );
}
function FeedbackSettings() {
  let { t, invoke: e, busy: a } = useApp(),
    [l, n] = React.useState(!1),
    [i, u] = React.useState("");
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      SettingGroup,
      {
        title: t("\u95EE\u9898\u4E0E\u5EFA\u8BAE", "Issues and suggestions"),
      },
      React.createElement(
        "button",
        {
          className: "link-row",
          onClick: () =>
            e(
              "openExternal",
              "https://github.com/Duoasa/quotaview-windows/issues",
            ),
        },
        React.createElement(
          "span",
          { className: "row-icon" },
          React.createElement(Icon, { name: "bug" }),
        ),
        React.createElement(
          "span",
          null,
          React.createElement("strong", null, "GitHub Issues"),
          React.createElement(
            "small",
            null,
            t(
              "\u62A5\u544A\u95EE\u9898\u3001\u5EFA\u8BAE\u529F\u80FD\uFF0C\u6216\u67E5\u770B\u5DF2\u6709\u53CD\u9988\u3002",
              "Report bugs, request features or review existing issues.",
            ),
          ),
        ),
        React.createElement(Icon, { name: "external", size: 14 }),
      ),
      React.createElement(
        "button",
        { className: "link-row", onClick: () => n(!0) },
        React.createElement(
          "span",
          { className: "row-icon" },
          React.createElement(Icon, { name: "connections" }),
        ),
        React.createElement(
          "span",
          null,
          React.createElement(
            "strong",
            null,
            t("QQ \u4EA4\u6D41\u7FA4", "QQ community"),
          ),
          React.createElement(
            "small",
            null,
            t("\u7FA4\u53F7\uFF1A1108649282", "Group: 1108649282"),
          ),
        ),
        React.createElement(Icon, { name: "right", size: 14 }),
      ),
    ),
    React.createElement(
      SettingGroup,
      { title: t("\u672C\u5730\u8BCA\u65AD", "Local diagnostics") },
      React.createElement(
        SettingRow,
        {
          title: t(
            "\u5BFC\u51FA\u8BCA\u65AD\u4FE1\u606F",
            "Export diagnostics",
          ),
          description: t(
            "\u53EA\u4FDD\u5B58\u5230\u4F60\u7684\u7535\u8111\u3002\u5206\u4EAB\u524D\u8BF7\u81EA\u884C\u68C0\u67E5\u662F\u5426\u5305\u542B\u654F\u611F\u8DEF\u5F84\u6216\u4EFB\u52A1\u4FE1\u606F\u3002",
            "Saved locally only. Review paths and task information before sharing.",
          ),
          icon: "file",
        },
        React.createElement(
          "button",
          {
            disabled: a.exportDiagnostics,
            onClick: async () => {
              let o = await e("exportDiagnostics");
              o &&
                u(
                  typeof o == "string"
                    ? o
                    : o.path || t("\u5DF2\u5BFC\u51FA", "Exported"),
                );
            },
          },
          t("\u5BFC\u51FA\u2026", "Export\u2026"),
        ),
      ),
    ),
    i &&
      React.createElement(
        Notice,
        null,
        t("\u8BCA\u65AD\u6587\u4EF6\uFF1A", "Diagnostic file: "),
        i,
      ),
    React.createElement(
      Notice,
      { icon: "shield" },
      t(
        "\u4E0D\u4F1A\u81EA\u52A8\u4E0A\u4F20\u8BCA\u65AD\u6587\u4EF6\u3001\u8D26\u6237\u6570\u636E\u6216\u4EFB\u52A1\u8BB0\u5F55\u3002\u82E5\u8981\u53CD\u9988\uFF0C\u8BF7\u81EA\u884C\u9009\u62E9\u8981\u5206\u4EAB\u7684\u5185\u5BB9\u3002",
        "Diagnostics, account data and task records are not uploaded automatically. Choose what to share when reporting an issue.",
      ),
    ),
    l &&
      React.createElement(
        "div",
        { className: "modal-backdrop", onClick: () => n(!1) },
        React.createElement(
          "section",
          {
            className: "dialog qr-dialog",
            role: "dialog",
            "aria-modal": "true",
            "aria-label": t("QQ \u7FA4\u4E8C\u7EF4\u7801", "QQ group QR code"),
            onClick: (o) => o.stopPropagation(),
          },
          React.createElement(
            "h2",
            null,
            t("QQ \u4EA4\u6D41\u7FA4", "QQ community"),
          ),
          React.createElement("img", {
            src: "../assets/feedback-qr.png",
            alt: t(
              "QuotaView QQ \u7FA4\u4E8C\u7EF4\u7801",
              "QuotaView QQ group QR code",
            ),
          }),
          React.createElement("p", null, "1108649282"),
          React.createElement(
            "button",
            { className: "primary-button", onClick: () => n(!1) },
            t("\u5173\u95ED", "Close"),
          ),
        ),
      ),
  );
}
function AboutSettings() {
  let { snapshot: t, t: e, invoke: a, busy: l } = useApp(),
    n = t.update || {},
    i =
      t.version && typeof t.version == "object"
        ? t.version.version || t.version.name
        : t.version;
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "div",
      { className: "about-hero" },
      React.createElement("img", {
        src: "../assets/app-icon.png",
        width: "80",
        height: "80",
        alt: "QuotaView",
      }),
      React.createElement(
        "div",
        null,
        React.createElement("h2", null, "QuotaView"),
        React.createElement(
          "p",
          null,
          e(
            "\u8BA9 AI \u5DE5\u4F5C\u6E05\u6670\u53EF\u89C1",
            "Clarity for your AI workflow",
          ),
        ),
        React.createElement(
          "span",
          null,
          i ||
            e(
              "\u7248\u672C\u4FE1\u606F\u4E0D\u53EF\u7528",
              "Version unavailable",
            ),
          " \xB7 Windows",
        ),
      ),
    ),
    React.createElement(
      SettingGroup,
      { title: e("\u8F6F\u4EF6\u66F4\u65B0", "Software updates") },
      React.createElement(
        SettingRow,
        {
          title: e("\u68C0\u67E5\u66F4\u65B0", "Check for updates"),
          description: n.checking
            ? e("\u6B63\u5728\u68C0\u67E5\u2026", "Checking\u2026")
            : n.error
              ? n.error
              : n.available
                ? e(
                    `\u53EF\u7528\u7248\u672C\uFF1A${n.version || "\u2014"}`,
                    `Available: ${n.version || "\u2014"}`,
                  )
                : n.checkedAt
                  ? e(
                      "\u68C0\u67E5\u5B8C\u6210\u3002\u6CA1\u6709\u53EF\u7528\u7684 Windows \u66F4\u65B0\u3002",
                      "Check complete. No Windows update is available.",
                    )
                  : e(
                      "\u4E0D\u4F1A\u628A macOS \u7248\u672C\u5F53\u4F5C Windows \u66F4\u65B0\u5B89\u88C5\u3002",
                      "macOS releases are never installed as Windows updates.",
                    ),
          icon: "refresh",
        },
        React.createElement(
          "button",
          {
            disabled: l.checkUpdates || n.checking,
            onClick: () => a("checkUpdates"),
          },
          e("\u68C0\u67E5\u66F4\u65B0\u2026", "Check for updates\u2026"),
        ),
      ),
      React.createElement(SettingToggle, {
        name: "autoCheckUpdates",
        title: e(
          "\u81EA\u52A8\u68C0\u67E5\u66F4\u65B0",
          "Automatically check for updates",
        ),
        description: e(
          "\u53EA\u68C0\u67E5\u548C\u63D0\u793A\uFF0C\u4E0D\u9759\u9ED8\u4E0B\u8F7D\u5B89\u88C5\u3002",
          "Check and notify only; no silent downloads or installation.",
        ),
        icon: "download",
      }),
      n.available &&
        n.url &&
        React.createElement(
          SettingRow,
          {
            title: e(
              "\u67E5\u770B Windows \u66F4\u65B0",
              "View Windows update",
            ),
          },
          React.createElement(
            "button",
            { onClick: () => a("openExternal", n.url) },
            e("\u6253\u5F00\u53D1\u5E03\u9875\u9762", "Open release page"),
            React.createElement(Icon, { name: "external", size: 12 }),
          ),
        ),
    ),
    React.createElement(
      SettingGroup,
      { title: e("\u9879\u76EE", "Project") },
      React.createElement(
        "button",
        {
          className: "link-row",
          onClick: () =>
            a("openExternal", "https://github.com/Duoasa/quotaview-windows"),
        },
        React.createElement(
          "span",
          null,
          React.createElement(
            "strong",
            null,
            e(
              "\u6E90\u4EE3\u7801\u4E0E\u8BF4\u660E",
              "Source code and documentation",
            ),
          ),
          React.createElement(
            "small",
            null,
            "github.com/Duoasa/quotaview-windows",
          ),
        ),
        React.createElement(Icon, { name: "external", size: 14 }),
      ),
      React.createElement(
        "button",
        {
          className: "link-row",
          onClick: () =>
            a(
              "openExternal",
              "https://github.com/Duoasa/QuotaView/blob/main/LICENSE",
            ),
        },
        React.createElement(
          "span",
          null,
          React.createElement(
            "strong",
            null,
            e("\u5F00\u6E90\u8BB8\u53EF", "Open-source license"),
          ),
          React.createElement("small", null, "MIT \xB7 Duoasa"),
        ),
        React.createElement(Icon, { name: "external", size: 14 }),
      ),
      React.createElement(
        "button",
        {
          className: "link-row",
          onClick: () =>
            a("openExternal", "https://github.com/Duoasa/QuotaView"),
        },
        React.createElement(
          "span",
          null,
          React.createElement(
            "strong",
            null,
            e(
              "\u4E0A\u6E38 QuotaView \u9879\u76EE",
              "Upstream QuotaView project",
            ),
          ),
          React.createElement(
            "small",
            null,
            e(
              "\u539F\u59CB macOS \u5B9E\u73B0\u4E0E\u8BBE\u8BA1",
              "Original macOS implementation and design",
            ),
          ),
        ),
        React.createElement(Icon, { name: "external", size: 14 }),
      ),
    ),
    React.createElement(
      "div",
      { className: "platform-note" },
      React.createElement(Icon, { name: "monitor" }),
      React.createElement(
        "p",
        null,
        e(
          "Windows \u9002\u914D\u4E0D\u5305\u542B\u684C\u9762\u5C0F\u7EC4\u4EF6\u3002\u4EFB\u52A1\u5C9B\u3001\u989D\u5EA6\u3001\u7528\u91CF\u3001\u8FDE\u63A5\u4E0E\u8BBE\u7F6E\u5747\u5728\u672C\u673A\u8FD0\u884C\u3002\u89C6\u89C9\u4E0E\u4EA4\u4E92\u6548\u679C\u4EE5 Windows \u624B\u52A8\u9A8C\u6536\u4E3A\u51C6\u3002",
          "The Windows port excludes desktop widgets. The Island, quota, usage, integrations and settings run locally. Visual and interaction quality requires manual Windows acceptance.",
        ),
      ),
    ),
    React.createElement(
      "p",
      { className: "about-credits" },
      e(
        "Asta Sans \u5B57\u4F53\u6309 SIL Open Font License \u5206\u53D1\u3002\u670D\u52A1\u5546\u540D\u79F0\u4E0E\u6807\u5FD7\u5C5E\u4E8E\u5176\u5404\u81EA\u6240\u6709\u8005\u3002",
        "Asta Sans is distributed under the SIL Open Font License. Provider names and marks belong to their respective owners.",
      ),
    ),
  );
}
function SettingsView() {
  let { t, invoke: e, snapshot: a } = useApp(),
    [l, n] = React.useState("general"),
    i = React.useRef(null),
    u = React.useRef(null),
    o = settingPages.find((m) => m[0] === l),
    c = {
      general: t(
        "\u8BED\u8A00\u3001\u663E\u793A\u4F4D\u7F6E\u4E0E\u5E94\u7528\u63A7\u5236\u3002",
        "Language, placement and app controls.",
      ),
      island: t(
        "\u6750\u8D28\u3001\u9690\u79C1\u3001\u4EFB\u52A1\u7279\u6548\u4E0E\u81EA\u52A8\u5C55\u5F00\u3002",
        "Material, privacy, task effects and automatic opening.",
      ),
      usage: t(
        "\u9009\u62E9\u7528\u91CF\u9875\u663E\u793A\u7684\u53EF\u9009\u6A21\u5757\u3002",
        "Choose optional modules for your usage page.",
      ),
      connections: t(
        "\u7BA1\u7406\u56DB\u79CD Agent \u7684\u672C\u5730\u4EFB\u52A1\u63A5\u5165\u3002",
        "Manage local activity from four agent providers.",
      ),
      proxy: t(
        "\u4E3A QuotaView \u7684\u66F4\u65B0\u68C0\u67E5\u9009\u62E9\u7F51\u7EDC\u8FDE\u63A5\u3002",
        "Configure networking for QuotaView update checks.",
      ),
      feedback: t(
        "\u9047\u5230\u95EE\u9898\u65F6\uFF0C\u901A\u8FC7\u4EE5\u4E0B\u65B9\u5F0F\u8054\u7CFB\u6211\u4EEC\u3002",
        "Get help when something goes wrong.",
      ),
      about: t(
        "\u7248\u672C\u4FE1\u606F\u3001\u5F00\u6E90\u8BB8\u53EF\u4E0E\u8F6F\u4EF6\u66F4\u65B0\u3002",
        "Version information, licenses and software updates.",
      ),
    };
  function r(m) {
    (n(m), i.current?.scrollTo({ top: 0 }));
  }
  function g(m) {
    let f = settingPages.findIndex((w) => w[0] === l),
      p = m.key === "ArrowDown" ? 1 : m.key === "ArrowUp" ? -1 : 0;
    if (p) {
      m.preventDefault();
      let w =
        settingPages[(f + p + settingPages.length) % settingPages.length][0];
      (r(w), u.current?.querySelector(`[data-page="${w}"]`)?.focus());
    }
  }
  return React.createElement(
    "main",
    { className: "settings-window" },
    React.createElement(
      "div",
      { className: "window-titlebar" },
      React.createElement(
        "span",
        null,
        React.createElement("img", {
          src: "../assets/app-icon.png",
          width: "16",
          height: "16",
          alt: "",
        }),
        "QuotaView",
      ),
      React.createElement(
        "div",
        { className: "window-controls" },
        React.createElement(
          "button",
          {
            onClick: () => e("minimize"),
            "aria-label": t("\u6700\u5C0F\u5316", "Minimize"),
          },
          React.createElement(Icon, { name: "minus", size: 13 }),
        ),
        React.createElement(
          "button",
          {
            onClick: () => e("maximize"),
            "aria-label": t("最大化或还原", "Maximize or restore"),
          },
          "□",
        ),
        React.createElement(
          "button",
          {
            className: "window-close",
            onClick: () => e("showWindow", "close-settings"),
            "aria-label": t("\u5173\u95ED\u8BBE\u7F6E", "Close settings"),
          },
          React.createElement(Icon, { name: "close", size: 13 }),
        ),
      ),
    ),
    React.createElement(
      "aside",
      { className: "settings-sidebar" },
      React.createElement("h1", null, t("\u8BBE\u7F6E", "Settings")),
      React.createElement(
        "nav",
        {
          ref: u,
          "aria-label": t("\u8BBE\u7F6E\u5206\u7C7B", "Settings categories"),
          onKeyDown: g,
        },
        settingPages.map(([m, f, p, w, N], D) =>
          React.createElement(
            React.Fragment,
            { key: m },
            [3, 5].includes(D) &&
              React.createElement("div", { className: "nav-separator" }),
            React.createElement(
              "button",
              {
                "data-page": m,
                className: l === m ? "selected" : "",
                onClick: () => r(m),
                "aria-current": l === m ? "page" : void 0,
              },
              React.createElement(
                "span",
                { className: "sidebar-icon", style: { background: N } },
                React.createElement(Icon, { name: f, size: 16 }),
              ),
              React.createElement("span", null, t(p, w)),
            ),
          ),
        ),
      ),
      React.createElement(
        "div",
        { className: "sidebar-foot" },
        React.createElement("span", { className: "local-dot" }),
        t(
          "\u672C\u5730\u4F18\u5148 \xB7 \u65E0\u9065\u6D4B",
          "Local first \xB7 No telemetry",
        ),
      ),
    ),
    React.createElement(
      "div",
      { className: "settings-detail", ref: i },
      React.createElement(
        "div",
        { className: "settings-content" },
        React.createElement(
          "header",
          { className: "settings-page-heading" },
          React.createElement(
            "h1",
            null,
            React.createElement(
              "span",
              { className: "sidebar-icon", style: { background: o[4] } },
              React.createElement(Icon, { name: o[1], size: 17 }),
            ),
            t(o[2], o[3]),
          ),
          React.createElement("p", null, c[l]),
        ),
        l === "general"
          ? React.createElement(GeneralSettings, null)
          : l === "island"
            ? React.createElement(IslandSettings, null)
            : l === "usage"
              ? React.createElement(UsageSettings, null)
              : l === "connections"
                ? React.createElement(ConnectionSettings, null)
                : l === "proxy"
                  ? React.createElement(ProxySettings, null)
                  : l === "feedback"
                    ? React.createElement(FeedbackSettings, null)
                    : React.createElement(AboutSettings, null),
        React.createElement(
          "footer",
          { className: "settings-save-note" },
          React.createElement(Icon, { name: "check", size: 12 }),
          t(
            "\u5F00\u5173\u81EA\u52A8\u4FDD\u5B58\uFF1B\u6587\u672C\u914D\u7F6E\u8BF7\u70B9\u51FB\u4FDD\u5B58",
            "Toggles save automatically; save text configurations explicitly",
          ),
        ),
      ),
    ),
  );
}

export {
  SettingToggle,
  GeneralSettings,
  IslandPreview,
  IslandSettings,
  UsageSettings,
  CodexSettings,
  IntegrationSettings,
  ConnectionSettings,
  ProxySettings,
  FeedbackSettings,
  AboutSettings,
  SettingsView,
  settingPages,
};
