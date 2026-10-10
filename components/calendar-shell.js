export function mountCalendarShell(root) {
    if (!root) throw new Error("Calendar root is missing.");
    root.innerHTML = `
        <div id="app-shell" class="h-full flex flex-col p-3 pt-2">
            <section class="flex-1 min-w-0 min-h-0 flex flex-col">
                <header
                    id="topbar"
                    class="flex items-center gap-2 mb-2 flex-wrap landscape:grid landscape:grid-cols-[1fr_auto_1fr]"
                >
                    <div class="flex items-center gap-2 min-w-0 idle-fade">
                        <button
                            id="prev"
                            class="w-10 h-10 grid place-items-center rounded-full border border-line bg-card"
                            aria-label="Previous"
                        >
                            <i data-i="chevron-left"></i>
                        </button>
                        <button
                            id="next"
                            class="w-10 h-10 grid place-items-center rounded-full border border-line bg-card"
                            aria-label="Next"
                        >
                            <i data-i="chevron-right"></i>
                        </button>
                        <h1
                            id="mon"
                            class="text-lg lg:text-xl font-medium mx-1"
                        ></h1>
                        <button
                            id="todaybtn"
                            class="h-10 px-4 rounded-full border border-line bg-card text-sm font-medium"
                        >
                            Today
                        </button>
                        <button
                            id="syncbtn"
                            class="hidden items-center gap-1.5 h-8 rounded-full border border-line bg-card px-2.5 text-xs font-medium text-mute shrink-0"
                            aria-live="polite"
                            title=""
                        >
                            <span
                                id="syncdot"
                                class="w-2 h-2 rounded-full bg-mute shrink-0"
                            ></span>
                            <span id="syncsub">Syncing…</span>
                        </button>
                    </div>
                    <div
                        id="clock"
                        class="hidden landscape:block text-xl lg:text-2xl font-medium text-center"
                    ></div>
                    <div
                        class="ml-auto flex items-center gap-2 justify-self-end idle-fade"
                    >
                        <div
                            role="group"
                            aria-label="Calendar view"
                            class="flex rounded-full border border-line bg-card p-0.5"
                        >
                            <button
                                id="vm"
                                aria-label="Month view"
                                title="Month view"
                                aria-pressed="false"
                                class="h-9 w-9 grid place-items-center rounded-full"
                            >
                                <i data-i="calendar-days" data-s="18"></i>
                                <span class="sr-only">Month</span>
                            </button>
                            <button
                                id="vw"
                                aria-label="Week view"
                                title="Week view"
                                aria-pressed="false"
                                class="h-9 w-9 grid place-items-center rounded-full"
                            >
                                <i data-i="columns-3" data-s="18"></i>
                                <span class="sr-only">Week</span>
                            </button>
                            <button
                                id="vl"
                                aria-label="List view"
                                title="List view"
                                aria-pressed="false"
                                class="h-9 w-9 grid place-items-center rounded-full"
                            >
                                <i data-i="list" data-s="18"></i>
                                <span class="sr-only">List</span>
                            </button>
                        </div>
                        <button
                            id="setbtn"
                            class="w-10 h-10 grid place-items-center rounded-full border border-line bg-card"
                            aria-label="Settings"
                        >
                            <i data-i="settings"></i>
                        </button>
                        <button
                            id="theme"
                            class="w-10 h-10 grid place-items-center rounded-full border border-line bg-card"
                            aria-label="Toggle light and dark mode"
                        ></button>
                        <button
                            id="fs"
                            class="w-10 h-10 grid place-items-center rounded-full border border-line bg-card"
                            aria-label="Toggle full screen"
                        >
                            <i data-i="maximize-2" data-s="18"></i>
                        </button>
                    </div>
                </header>
                <div
                    id="calendar-surface"
                    class="flex-1 min-h-0 flex flex-col rounded-2xl border border-line bg-card overflow-hidden"
                >
                    <div
                        id="dow"
                        class="grid grid-cols-7 text-center text-[11px] lg:text-xs uppercase tracking-wide text-mute py-2 border-b border-line"
                    >
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                    </div>
                    <div
                        id="grid"
                        class="grid gap-px bg-line flex-1 min-h-0"
                    ></div>
                    <div
                        id="tg"
                        class="flex-1 min-h-0 overflow-y-auto"
                        style="
                            display: none;
                            overscroll-behavior: contain;
                        "
                    ></div>
                    <div
                        id="listview"
                        class="flex-1 min-h-0 overflow-y-auto"
                        style="
                            display: none;
                            overscroll-behavior: contain;
                        "
                    ></div>
                </div>
                <p class="status text-xs text-accent mt-1"></p>
            </section>
        </div>

        <div
            id="today-overlay"
            class="hidden fixed inset-0 z-[60] overflow-hidden bg-bg"
            aria-hidden="true"
            tabindex="-1"
        ></div>

        <button
            id="addbtn"
            class="fixed z-10 w-14 h-14 rounded-full bg-accent text-on shadow-lg grid place-items-center idle-fade"
            style="
                right: calc(env(safe-area-inset-right, 0px) + 1rem);
                bottom: calc(env(safe-area-inset-bottom, 0px) + 1rem);
            "
            aria-label="Add event"
        >
            <i data-i="plus" data-s="26"></i>
        </button>
    `;
    return root.firstElementChild;
}

