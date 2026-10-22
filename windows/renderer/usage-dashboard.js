import { React } from "./react.js";
import {
  useApp,
  isFiniteNumber,
  formatNumber,
  formatCurrency,
  remainingQuota,
  formatCountdown,
  quotaWindows,
  taskLabel,
  creditValue,
  filterDays,
  dayKey,
  sumKnown,
  ProviderIcon,
  PROVIDER_LABELS,
  Notice,
} from "./common.js";
const h = React.createElement;

// Missing dates stay unknown. Account totals and local cost records are never added together.
export function calendarDays(records, count, now) {
  const byDate = new Map(
    (Array.isArray(records) ? records : []).map((day) => [day.date, day]),
  );
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now);
    date.setDate(date.getDate() - count + 1 + index);
    const key = dayKey(date);
    return byDate.get(key) || { date: key, total: null, cost: null };
  });
}

function QuotaCard({ item, stale }) {
  const { t, now, snapshot } = useApp();
  const value = remainingQuota(item),
    privacy = snapshot.settings.privacy;
  const reset = isFiniteNumber(item.resetAt)
    ? t(
        formatCountdown(item.resetAt, now, t) + "重置",
        "Resets in " + formatCountdown(item.resetAt, now, t),
      )
    : "—";
  return h(
    "article",
    { className: "data-card quota-card " + (stale ? "stale-data" : "") },
    h(
      "div",
      { className: "card-title-line" },
      h("span", null, taskLabel(item, t)),
      h(
        "span",
        {
          title: privacy
            ? ""
            : isFiniteNumber(item.resetAt)
              ? new Date(item.resetAt).toLocaleString()
              : "",
        },
        privacy ? "—" : reset,
      ),
    ),
    h(
      "div",
      { className: "quota-value" },
      h(
        "strong",
        null,
        privacy ? "•••" : value === null ? "—" : Math.round(value) + "%",
      ),
      h(
        "span",
        null,
        privacy
          ? ""
          : value === null
            ? t("额度未知", "Unavailable")
            : t(
                "已使用 " + Math.round(100 - value) + "%",
                "Used " + Math.round(100 - value) + "%",
              ),
      ),
    ),
    h(
      "div",
      {
        className: "quota-bar",
        role: "progressbar",
        "aria-label": t("剩余额度", "Remaining quota"),
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-valuenow": privacy || value === null ? undefined : value,
      },
      h("span", {
        className: value <= 10 ? "danger" : value <= 30 ? "warning" : "",
        style: { width: (privacy || value === null ? 0 : value) + "%" },
      }),
    ),
  );
}

function CostCard({ days }) {
  const { t, locale, now, snapshot } = useApp();
  const visible = calendarDays(days, 30, now),
    available = filterDays(days, 30, now),
    latest = available.at(-1);
  const maximum = Math.max(
    1,
    ...visible.map((day) => (isFiniteNumber(day.cost) ? day.cost : 0)),
  );
  const money = (value) =>
    snapshot.settings.privacy ? "•••" : formatCurrency(value, locale);
  return h(
    "section",
    { className: "data-card cost-bento" },
    h(
      "div",
      { className: "cost-total" },
      h("span", null, t("成本估算", "Cost estimate")),
      h("strong", null, money(sumKnown(available, "cost"))),
      h("small", null, t("最近 30 天", "Last 30 days")),
    ),
    h(
      "div",
      {
        className: "cost-bars",
        "aria-label": t("每日估算成本", "Daily estimated cost"),
      },
      ...visible.map((day) =>
        h(
          "div",
          {
            key: day.date,
            className: "cost-bar-slot",
            title: snapshot.settings.privacy
              ? ""
              : day.date + " · " + formatCurrency(day.cost, locale),
          },
          h("i", {
            className: isFiniteNumber(day.cost) ? "" : "missing",
            style: {
              height: snapshot.settings.privacy
                ? "0%"
                : isFiniteNumber(day.cost)
                  ? Math.max(2, (day.cost / maximum) * 100) + "%"
                  : "2px",
            },
          }),
        ),
      ),
    ),
    h(
      "div",
      { className: "cost-latest", title: latest?.date },
      h("span", null, t("最近一天", "Latest day")),
      h("strong", null, money(latest?.cost)),
      h("small", null, t("估算值 · 非账单", "Estimate · not a bill")),
    ),
  );
}

function Activity({ days }) {
  const { t, locale, now, snapshot } = useApp();
  const [mode, setMode] = React.useState("daily");
  const records = React.useMemo(
    () => calendarDays(days, 294, now),
    [days, now],
  );
  const cells = React.useMemo(() => {
    if (mode === "weekly")
      return Array.from({ length: 42 }, (_, week) => {
        const group = records.slice(week * 7, week * 7 + 7),
          known = group.filter((day) => isFiniteNumber(day.total));
        return {
          date: group[0].date + " – " + group.at(-1).date,
          total: known.length ? sumKnown(known, "total") : null,
          partial: known.length < 7,
        };
      });
    if (mode === "cumulative") {
      let total = 0;
      return records.map((day) => {
        if (isFiniteNumber(day.total)) total += day.total;
        return { ...day, total: isFiniteNumber(day.total) ? total : null };
      });
    }
    return records;
  }, [records, mode]);
  const maximum = Math.max(1, ...cells.map((day) => day.total || 0));
  return h(
    "section",
    { className: "data-card activity-bento" },
    h(
      "div",
      { className: "card-title-line" },
      h("span", null, t("Token 活动", "Token activity")),
      h(
        "div",
        {
          className: "activity-mode",
          role: "group",
          "aria-label": t("活动范围", "Activity mode"),
        },
        ...["daily", "weekly", "cumulative"].map((value, index) =>
          h(
            "button",
            {
              key: value,
              "aria-pressed": mode === value,
              className: mode === value ? "selected" : "",
              onClick: () => setMode(value),
            },
            t(
              ["每天", "每周", "累计"][index],
              ["Daily", "Weekly", "Total"][index],
            ),
          ),
        ),
      ),
    ),
    snapshot.settings.privacy
      ? h("p", { className: "muted" }, t("数据已隐藏", "Data hidden"))
      : h(
          React.Fragment,
          null,
          h(
            "div",
            { className: "activity-scroll" },
            h(
              "div",
              { className: "activity-grid mode-" + mode },
              ...cells.map((day) =>
                h("span", {
                  key: day.date,
                  className:
                    "activity-cell " + (day.total === null ? "unknown" : ""),
                  style: {
                    "--level":
                      day.total === null
                        ? 0
                        : day.total === 0
                          ? 0.08
                          : 0.22 + 0.78 * Math.sqrt(day.total / maximum),
                  },
                  title:
                    day.date +
                    " · " +
                    formatNumber(day.total, locale) +
                    " tokens" +
                    (day.partial
                      ? t("（部分记录）", " (partial records)")
                      : ""),
                }),
              ),
            ),
          ),
          h(
            "div",
            { className: "activity-months" },
            ...Array.from({ length: 7 }, (_, index) => {
              const day = records[Math.min(293, index * 49)];
              return h(
                "span",
                { key: day.date },
                new Date(day.date + "T12:00:00").toLocaleDateString(locale, {
                  month: "short",
                }),
              );
            }),
          ),
          h(
            "p",
            { className: "chart-note" },
            mode === "cumulative"
              ? t(
                  "累计显示本页已记录的用量；空白日期表示缺少记录。",
                  "Cumulative recorded usage on this page; empty dates have no record.",
                )
              : t(
                  "空白日期表示缺少记录，不代表零用量。",
                  "Empty dates have no record, rather than zero usage.",
                ),
          ),
        ),
  );
}

export function UsageDashboard() {
  const { snapshot, t, locale, now } = useApp();
  const [provider, setProvider] = React.useState("codex");
  const settings = snapshot.settings,
    quota = snapshot.quotas[provider],
    usage = snapshot.usage[provider];
  const windows = quotaWindows(quota);
  const cards = windows.length
    ? windows
    : [
        { name: t("5 小时额度", "5-hour quota"), windowMinutes: 300 },
        { name: t("每周额度", "Weekly quota"), windowMinutes: 10080 },
      ];
  const days = filterDays(usage?.days, 36500, now),
    month = filterDays(days, 30, now),
    latest = days.at(-1);
  const lifetime = isFiniteNumber(usage?.summary?.lifetimeTokens);
  const providers = [
    "codex",
    "claude",
    ...["dsh", "kimi"].filter(
      (key) => snapshot.quotas[key] || snapshot.usage[key],
    ),
  ];
  const metrics = [
    [t("最近一天 Tokens", "Latest day tokens"), latest?.total, latest?.date],
    [t("30 天 Tokens", "30-day tokens"), sumKnown(month, "total")],
    [
      t("累计 Tokens", "Total tokens"),
      lifetime ? usage.summary.lifetimeTokens : sumKnown(days, "total"),
      lifetime
        ? t("账户累计", "Account lifetime")
        : t("本地记录累计，可能不完整", "Local recorded total, may be partial"),
    ],
  ];
  return h(
    "div",
    { className: "usage-panel usage-dashboard" },
    h(
      "div",
      {
        className: "usage-provider-tabs",
        role: "tablist",
        "aria-label": t("数据来源", "Data provider"),
      },
      ...providers.map((key) =>
        h(
          "button",
          {
            key,
            role: "tab",
            "aria-selected": provider === key,
            className: provider === key ? "selected" : "",
            onClick: () => setProvider(key),
          },
          h(ProviderIcon, { provider: key, size: 16 }),
          PROVIDER_LABELS[key],
        ),
      ),
    ),
    quota?.error &&
      h(
        Notice,
        { tone: "warning" },
        t(
          "最新数据获取失败，显示上次快照。",
          "Latest fetch failed; showing the previous snapshot.",
        ),
      ),
    h(
      "div",
      { className: "usage-bento-top" },
      h(
        "div",
        { className: "usage-bento-metrics" },
        h(
          "div",
          { className: "quota-grid" },
          ...cards.map((item, index) =>
            h(QuotaCard, { key: index, item, stale: !!quota?.error }),
          ),
        ),
        h(
          "div",
          { className: "usage-summary-stats" },
          ...metrics.map(([label, value, title]) =>
            h(
              "article",
              {
                key: label,
                className: "data-card usage-summary-stat",
                title: settings.privacy ? "" : title,
              },
              h("span", null, label),
              h(
                "strong",
                null,
                settings.privacy ? "•••" : formatNumber(value, locale, true),
              ),
            ),
          ),
        ),
      ),
      h(
        "article",
        { className: "data-card account-bento" },
        h("span", { className: "muted" }, t("账户", "Account")),
        h("h3", null, settings.privacy ? "•••" : quota?.account?.plan || "—"),
        h(
          "p",
          {
            className: "account-email",
            title: settings.privacy ? "" : quota?.account?.email,
          },
          settings.privacy
            ? "•••"
            : quota?.account?.email || PROVIDER_LABELS[provider],
        ),
        h(
          "div",
          { className: "account-balance" },
          h("span", null, t("积分余额", "Credit balance")),
          h(
            "strong",
            null,
            settings.privacy
              ? "•••"
              : quota?.credits?.unlimited
                ? t("无限", "Unlimited")
                : formatCurrency(creditValue(quota?.credits?.balance), locale),
          ),
        ),
        h(
          "div",
          { className: "account-ticket-row" },
          h(
            "div",
            {
              className: "recharge-ticket",
              "aria-label": t("充值卡，仅展示", "Recharge card, display only"),
              "aria-disabled": true,
            },
            h("img", {
              src:
                "../assets/" +
                (provider === "claude"
                  ? "claude-recharge-card.svg"
                  : "recharge-card.svg"),
              alt: "",
            }),
            h(ProviderIcon, { provider, size: 17 }),
          ),
          h(
            "div",
            null,
            h("span", null, t("额度重置", "Quota resets")),
            h(
              "strong",
              null,
              settings.privacy
                ? "•••"
                : isFiniteNumber(quota?.credits?.resetCount)
                  ? t(
                      quota.credits.resetCount + "次",
                      String(quota.credits.resetCount),
                    )
                  : "—",
            ),
          ),
        ),
      ),
    ),
    settings.showCost &&
      h(CostCard, { days: usage?.localDays || usage?.days || [] }),
    settings.showActivity && h(Activity, { days: usage?.days || [] }),
    !lifetime &&
      h(
        "p",
        { className: "chart-note" },
        t(
          "累计值来自可读取的本地记录，可能不完整。",
          "Totals cover readable local records and may be incomplete.",
        ),
      ),
  );
}
