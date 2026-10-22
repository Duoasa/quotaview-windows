/* Shared by the event projection, React UI and GPU renderer. */
(function (root) {
  "use strict";
  const terminal = new Set(["completed", "failed", "error", "interrupted"]);
  function displayState(task) {
    if (!task) return "unknown";
    const state = task.status || "unknown";
    if (state === "completed" && task.verified === false) return "unknown";
    if (
      terminal.has(state) ||
      ["waiting", "unknown", "disconnected"].includes(state)
    )
      return state;
    return task.compacting || task.tool === "Compacting context"
      ? "compacting"
      : state;
  }
  function progressValue(task) {
    if (task?.status === "completed" && task.verified !== false) return 1;
    const p = task?.progress;
    if (!p) return null;
    if (Number.isFinite(p.fraction))
      return Math.max(0, Math.min(0.95, p.fraction));
    if (
      !Number.isFinite(p.total) ||
      p.total <= 0 ||
      !Number.isFinite(p.completed)
    )
      return null;
    const active = Array.isArray(p.steps)
      ? p.steps.filter((s) => ["in_progress", "inProgress"].includes(s.status))
          .length
      : 0;
    return Math.max(0, Math.min(0.95, (p.completed + 0.1 * active) / p.total));
  }
  function presentationProgress(task) {
    const value = progressValue(task);
    return {
      percent: value === null ? null : value * 100,
      known: value !== null,
      completed: value === 1,
    };
  }
  function advancePlan(previous, next) {
    return {
      ...next,
      fraction: Math.max(
        progressValue({ progress: previous }) ?? 0,
        progressValue({ progress: next }) ?? 0,
      ),
    };
  }
  function freshTask(task, now, staleAfter = 300000) {
    if (
      terminal.has(task.status) ||
      task.approval?.canRespond ||
      !Number.isFinite(task.updatedAt) ||
      now - task.updatedAt <= staleAfter
    )
      return task;
    return {
      ...task,
      status: "unknown",
      stale: true,
      compacting: false,
      tool: undefined,
    };
  }
  const api = {
    displayState,
    progressValue,
    presentationProgress,
    advancePlan,
    freshTask,
  };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.QVTaskState = api;
})(globalThis);
