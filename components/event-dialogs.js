export function mountEventDialogs(root) {
    if (!root) throw new Error("Dialog root is missing.");
    root.innerHTML = `
        <div
            id="sheet"
            class="hidden fixed inset-0 z-20 bg-black/50 items-center justify-center p-4"
            style="
                padding-top: calc(env(safe-area-inset-top, 0px) + 1rem);
                padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 1rem);
            "
        >
            <div
                id="settings-panel"
                class="bg-card border border-line rounded-2xl p-4 w-full max-w-md max-h-full flex flex-col"
            >
                <div class="flex items-center justify-between mb-2">
                    <h2 id="sd" class="text-lg font-medium"></h2>
                    <button
                        id="close"
                        class="w-9 h-9 grid place-items-center text-mute"
                        aria-label="Close"
                    >
                        <i data-i="x"></i>
                    </button>
                </div>
                <div id="list" class="min-h-0 overflow-y-auto"></div>
                <div class="grid grid-cols-2 gap-2 mt-3">
                    <div
                        id="kindsel"
                        class="col-span-2 flex rounded-full border border-line bg-bg p-0.5"
                    ></div>
                    <label
                        id="calendar-target-wrap"
                        class="hidden col-span-2 text-xs text-mute"
                    >
                        Add event to
                        <select
                            id="calendar-target"
                            aria-label="Add event to calendar"
                            class="mt-1 w-full bg-bg border border-line rounded-lg p-2 text-ink"
                        ></select>
                    </label>
                    <input
                        id="title"
                        class="col-span-2 bg-bg border border-line rounded-lg p-2 min-w-0"
                        placeholder="Add an event"
                        maxlength="80"
                    />
                    <label
                        id="timewrap"
                        class="text-xs text-mute"
                        >Start time<input
                            id="time"
                            type="time"
                            aria-label="Start time"
                            class="mt-1 w-full bg-bg border border-line rounded-lg p-2 text-ink"
                    /></label>
                    <label
                        id="endtimewrap"
                        class="text-xs text-mute"
                        >End time<input
                            id="endtime"
                            type="time"
                            aria-label="End time"
                            class="mt-1 w-full bg-bg border border-line rounded-lg p-2 text-ink"
                    /></label>
                    <div
                        id="who-wrap"
                        class="hidden col-span-2 text-xs text-mute"
                    >
                        <span>People</span>
                        <div
                            id="who-options"
                            class="mt-1 flex flex-wrap gap-2"
                            role="group"
                            aria-label="People for this event"
                        ></div>
                    </div>
                    <button
                        id="go"
                        aria-busy="false"
                        class="col-span-2 flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 font-medium text-on disabled:cursor-wait disabled:opacity-60"
                    >
                        <span id="go-label">Add</span>
                        <span
                            id="go-progress"
                            class="hidden flex items-center justify-center gap-2"
                        >
                            <svg
                                class="h-4 w-4 animate-spin"
                                viewBox="0 0 24 24"
                                fill="none"
                                aria-hidden="true"
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="9"
                                    stroke="currentColor"
                                    stroke-opacity="0.25"
                                    stroke-width="3"
                                />
                                <path
                                    d="M21 12a9 9 0 0 0-9-9"
                                    stroke="currentColor"
                                    stroke-width="3"
                                    stroke-linecap="round"
                                />
                            </svg>
                            <span id="go-progress-label">Saving…</span>
                        </span>
                    </button>
                </div>
                <p class="status text-xs text-accent mt-2 min-h-4"></p>
            </div>
        </div>

        <div
            id="event-detail"
            class="hidden fixed inset-0 z-30 bg-black/50 items-center justify-center p-4"
            style="
                padding-top: calc(env(safe-area-inset-top, 0px) + 1rem);
                padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 1rem);
            "
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="event-detail-title"
                class="bg-card border border-line rounded-2xl p-4 w-full max-w-md max-h-full flex flex-col"
            >
                <div class="flex items-center justify-between gap-3 mb-3 shrink-0">
                    <h2 id="event-detail-title" class="text-lg font-medium truncate"></h2>
                    <button
                        id="event-detail-close"
                        class="w-9 h-9 grid place-items-center text-mute shrink-0"
                        aria-label="Close event details"
                    ><i data-i="x"></i></button>
                </div>
                <div id="event-detail-content" class="min-h-0 overflow-y-auto"></div>
            </section>
        </div>
    `;
    return root.firstElementChild;
}

