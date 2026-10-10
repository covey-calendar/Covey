import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) =>
    readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("keeps index.html focused on bootstrapping component roots", () => {
    const index = read("index.html");

    ["app-root", "dialogs-root", "settings-root"].forEach((id) => {
        assert.match(index, new RegExp(`id=["']${id}["']`));
    });
    ["app-shell", "sheet", "event-detail", "settings-dialog"].forEach((id) => {
        assert.doesNotMatch(index, new RegExp(`id=["']${id}["']`));
    });
});

test("mounts calendar, dialog, and settings components before binding the app", () => {
    const app = read("app.js");
    const calendar = read("components/calendar-shell.js");
    const dialogs = read("components/event-dialogs.js");
    const settings = read("components/settings-dialog.js");

    assert.match(calendar, /id=["']app-shell["']/);
    assert.match(dialogs, /id=["']sheet["']/);
    assert.match(dialogs, /id=["']event-detail["']/);
    assert.match(settings, /id=["']settings-dialog["']/);

    const mountIndex = app.indexOf("mountCalendarShell(");
    const selectorIndex = app.indexOf("const $ =");
    assert.ok(mountIndex >= 0 && mountIndex < selectorIndex);
    assert.match(app, /mountEventDialogs\(document\.getElementById\(["']dialogs-root["']\)\)/);
    assert.match(app, /mountSettingsDialog\(document\.getElementById\(["']settings-root["']\)\)/);
});
