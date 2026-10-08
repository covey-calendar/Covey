            /*
             * Covey browser application.
             *
             * app.js owns the interactive calendar: local state, iCloud API
             * calls, rendering, preferences, settings, and input handling.
             * It expects theme.js to have initialized the global GT object
             * before this script runs, and expects the DOM from index.html.
             */

            // Inline SVG paths keep the app independent of an icon runtime.
            // Lucide icons (inlined)
            const P = {
                "chevron-left": '<path d="m15 18-6-6 6-6"/>',
                "chevron-right": '<path d="m9 18 6-6-6-6"/>',
                sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
                cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
                "cloud-sun": '<path d="M12 2v2"/><path d="m4.93 4.93 1.42 1.42"/><path d="M20 12h2"/><path d="m19.07 4.93-1.42 1.42"/><path d="M16 6a4 4 0 0 0-7.7 1.5"/><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
                "cloud-moon": '<path d="M19.5 13.5A7 7 0 0 1 10.5 4.5 7 7 0 1 0 19.5 13.5Z"/><path d="M17.5 21H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
                "cloud-fog": '<path d="M17.5 15H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="M3 19h18"/><path d="M5 22h14"/>',
                "cloud-drizzle": '<path d="M17.5 15H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="M8 19v1"/><path d="M12 19v1"/><path d="M16 19v1"/>',
                "cloud-rain": '<path d="M17.5 15H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="m8 19-1 2"/><path d="m16 19-1 2"/><path d="m12 20-1 2"/>',
                "cloud-sun-rain": '<path d="M12 2v2"/><path d="m4.93 4.93 1.42 1.42"/><path d="M20 12h2"/><path d="m19.07 4.93-1.42 1.42"/><path d="M16 6a4 4 0 0 0-7.7 1.5"/><path d="M17.5 15H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="m8 19-1 2"/><path d="m16 19-1 2"/><path d="m12 20-1 2"/>',
                "cloud-snow": '<path d="M17.5 15H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="M8 19v.01"/><path d="M12 21v.01"/><path d="M16 19v.01"/>',
                "cloud-lightning": '<path d="M17.5 15H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="m13 15-3 5h4l-2 4"/>',
                moon: '<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>',
                settings:
                    '<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/>',
                "maximize-2":
                    '<path d="M15 3h6v6"/><path d="m21 3-7 7"/><path d="m3 21 7-7"/><path d="M9 21H3v-6"/>',
                "minimize-2":
                    '<path d="m14 10 7-7"/><path d="M20 10h-6V4"/><path d="m3 21 7-7"/><path d="M4 14h6v6"/>',
                x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
                plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
                bell: '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
                calendar:
                    '<path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/>',
                "calendar-days":
                    '<path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/>',
                "columns-3":
                    '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M15 3v18"/>',
                list: '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',
                utensils:
                    '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
                briefcase:
                    '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/>',
                house:
                    '<path d="m3 10 9-7 9 7"/><path d="M5 9v12h14V9"/><path d="M9 21v-7h6v7"/>',
                heart:
                    '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>',
                "book-open":
                    '<path d="M12 7v14"/><path d="M3 18V5a2 2 0 0 1 2-2h3a4 4 0 0 1 4 4 4 4 0 0 1 4-4h3a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2h-4a3 3 0 0 0-3 2 3 3 0 0 0-3-2H5a2 2 0 0 1-2-2Z"/>',
                music:
                    '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
                dumbbell:
                    '<path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/>',
                "shopping-bag":
                    '<path d="M6 7h12l1 14H5L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/>',
                users: '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
                baby: '<path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1 4.7c0 5-3.5 9-8 9s-8-4-8-9a9 9 0 0 1 1.3-4.7"/><path d="M12 2c1.5 0 3 .5 4.5 1.5"/>',
                pencil:
                    '<path d="m16 5 3 3"/><path d="m4 20 4-.8L19 8a2.12 2.12 0 0 0-3-3L5 16l-1 4Z"/>',
                "trash-2":
                    '<path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
            };
            const ic = (n, s = 20) =>
                '<svg xmlns="http://www.w3.org/2000/svg" width="' +
                s +
                '" height="' +
                s +
                '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                P[n] +
                "</svg>";
            // Calendar colors and family filters are intentionally kept in one
            // place so event rendering and settings use the same definitions.
            // Only entries with on:true appear as filters and in the "who" picker.
            // The others are kept (they still color older events) so a person can be re-added by setting on:true.
            const M = [
                { n: "Parent 1", c: "#f8c8c0", d: "#b8503f", on: false },
                { n: "Parent 2", c: "#bfd7f5", d: "#3b6fb0", on: false },
                { n: "Kid 1", c: "#c6e8cf", d: "#3f8a5b", on: false },
                { n: "Kid 2", c: "#fbe3a6", d: "#a7791b", on: false },
                { n: "Family", c: "#dccff0", d: "#6c4fa3", on: true },
            ];
            const AVATAR_EMOJI = {
                person: "🙂",
                child: "🧒",
                baby: "👶",
                bird: "🐦",
            };
            const PERSON_BIRD_IMAGES = [
                { name: "Nuthatch", src: "/images/Nuthatch.png" },
                { name: "Blue jay", src: "/images/robin.png" },
                { name: "Cardinal", src: "/images/cardinal.png" },
                { name: "Goldfinch", src: "/images/goldfinch.png" },
                { name: "Robin", src: "/images/blue-jay.png" },
            ];

            const INK = "#2b2622";
            const CALENDAR_COLORS = {
                coral: { label: "Coral", bg: "#f8c8c0", fg: "#b8503f" },
                blue: { label: "Blue", bg: "#bfd7f5", fg: "#3b6fb0" },
                green: { label: "Green", bg: "#c6e8cf", fg: "#3f8a5b" },
                amber: { label: "Amber", bg: "#fbe3a6", fg: "#a7791b" },
                violet: { label: "Violet", bg: "#dccff0", fg: "#6c4fa3" },
                teal: { label: "Teal", bg: "#bceae3", fg: "#167c72" },
                rose: { label: "Rose", bg: "#f5c9dc", fg: "#a7426b" },
                slate: { label: "Slate", bg: "#dce3eb", fg: "#516174" },
            };
            const CALENDAR_ICON_LABELS = {
                calendar: "Calendar",
                briefcase: "Work",
                house: "Home",
                heart: "Health",
                "book-open": "Reading",
                music: "Music",
                dumbbell: "Fitness",
                "shopping-bag": "Shopping",
                users: "People",
                baby: "Kids",
            };
            const K = {
                reminder: {
                    n: "Reminders",
                    c: "#e3e8ef",
                    d: "#64748b",
                    i: "bell",
                },
                dinner: {
                    n: "Dinner",
                    c: "#fcdcb8",
                    d: "#b5651d",
                    i: "utensils",
                },
            };
            const calendarForEvent = (e) =>
                calendarConfigs.find((calendar) => calendar.id === e.calendarId);
            const sty = (e) => {
                const calendar = calendarForEvent(e);
                const color = calendar && CALENDAR_COLORS[calendar.color];
                if (color) return { n: calendar.name, c: color.bg, d: color.fg };
                return K[e.kind] || M[mi(e.m)];
            };
            const tag = (n, e) => {
                const calendar = calendarForEvent(e);
                const icon = calendar?.icon || K[e.kind]?.i;
                if (icon)
                    n.insertAdjacentHTML(
                        "afterbegin",
                        '<span class="inline-block align-[-2px] mr-1">' +
                            ic(icon, 14) +
                            "</span>",
                    );
                return n;
            };
            const mi = (n) => {
                const i = M.findIndex((x) => x.n === n);
                return i < 0 ? M.length - 1 : i;
            };
            const $ = (id) => document.getElementById(id);
            const SPLASH_MIN_MS = 700; // keep the splash visible at least this long, even if data loads instantly
            const splashStart = Date.now();
            function hideSplash() {
                const s = $("splash");
                if (!s) return;
                const wait = Math.max(
                    0,
                    SPLASH_MIN_MS - (Date.now() - splashStart),
                );
                setTimeout(() => s.remove(), wait);
            }
            setTimeout(hideSplash, 8000); // safety net in case the initial load never settles
            const pad = (n) => String(n).padStart(2, "0");
            const iso = (d) =>
                d.getFullYear() +
                "-" +
                pad(d.getMonth() + 1) +
                "-" +
                pad(d.getDate());
            const parse = (k) => {
                const [a, b, c] = k.split("-").map(Number);
                return new Date(a, b - 1, c);
            };
            const formatTime = (date, options) =>
                date.toLocaleTimeString([], {
                    ...options,
                    ...(timeFormat === "12"
                        ? { hour12: true }
                        : timeFormat === "24"
                          ? { hour12: false }
                          : {}),
                });
            const tfmt = (t) => {
                const [h, m] = t.split(":").map(Number);
                return formatTime(new Date(2000, 0, 1, h, m), {
                    hour: "numeric",
                    minute: "2-digit",
                });
            };
            const tshort = (t) =>
                tfmt(t).replace(/\s?([AP])M/i, (_, x) => x.toLowerCase());
            const demo = !window.GAGGLE_SERVER;
            const addDays = (k, n) => {
                const d = parse(k);
                d.setDate(d.getDate() + n);
                return iso(d);
            };
            const sunday = (k) => addDays(k, -parse(k).getDay());
            // Restore the user's calendar and appearance preferences before the
            // first render. Calendar events use a separate local preview store.
            let days = 5,
                txt = "md",
                pal = "sand",
                auto = false,
                dFrom = "19:00",
                dTo = "07:00",
                manual = null,
                ovr = null,
                initView = null,
                timeFormat = "device",
                compactWeek = false,
                keepScreenAwake = false,
                todayViewEnabled = true,
                todayDismissed = [],
                todayWeatherEnabled = true,
                todayWeatherLocation = "",
                todayTemperatureUnit = "F";
            let people = [];
            const hide = { event: false, reminder: false, dinner: false };
            try {
                const st = JSON.parse(
                    localStorage.getItem("gaggle-settings") || "{}",
                );
                if (st.days >= 1 && st.days <= 7) days = st.days;
                if (st.hide) Object.assign(hide, st.hide);
                if (st.palette && GT.T.hasOwnProperty(st.palette))
                    pal = st.palette;
                if (st.text && GT.TX.hasOwnProperty(st.text)) txt = st.text;
                auto = !!st.auto;
                if (/^\d\d:\d\d$/.test(st.darkFrom)) dFrom = st.darkFrom;
                if (/^\d\d:\d\d$/.test(st.darkTo)) dTo = st.darkTo;
                if (
                    st.view === "month" ||
                    st.view === "week" ||
                    st.view === "list"
                )
                    initView = st.view;
                if (["device", "12", "24"].includes(st.timeFormat))
                    timeFormat = st.timeFormat;
                compactWeek = !!st.compactWeek;
                keepScreenAwake = !!st.keepScreenAwake;
                todayViewEnabled = st.todayViewEnabled !== false;
                todayWeatherEnabled = st.todayWeatherEnabled !== false;
                if (typeof st.todayWeatherLocation === "string")
                    todayWeatherLocation = st.todayWeatherLocation.slice(0, 100);
                if (["F", "C"].includes(st.todayTemperatureUnit))
                    todayTemperatureUnit = st.todayTemperatureUnit;
                if (Array.isArray(st.todayDismissed))
                    todayDismissed = st.todayDismissed.filter((key) => typeof key === "string");
            } catch (e) {}
            try {
                const mo = localStorage.getItem("gaggle-theme");
                if (mo === "light" || mo === "dark") manual = mo;
            } catch (e) {}
            const home = () =>
                days === 7 ? sunday(iso(new Date())) : iso(new Date());
            let selectedPersonIds = new Set(),
                personSelectionTouched = false;
            let calendarConfigs = [],
                addCalendarColor = "teal",
                addCalendarIcon = "calendar",
                calendarFormOpen = false,
                calendarSaving = false,
                personFormOpen = false,
                personSaving = false,
                editingPersonId = null,
                addPersonAvatar = "person",
                addPersonImage = null,
                addPersonCalendarIds = new Set();
            let syncState = "pending",
                lastSyncAt = null;
            let ev = [],
                local = [],
                kinds = ["event", "reminder", "dinner"],
                addKind = "event",
                view = initView || "week",
                sel = iso(new Date()),
                wstart = home(),
                cur = new Date(),
                sheet = false,
                detailEvent = null,
                detailReturnFocus = null,
                todayOverlayOpen = null,
                todayOverlaySignature = "",
                todayReturnFocus = null,
                todayWeather = null,
                todayWeatherRequestDate = "",
                todayWeatherStatus = "idle",
                todayWeatherMessage = "",
                todayWeatherLastRequestAt = 0,
                loadedMonths = [],
                todayEventCacheDate = "",
                todayEventCache = [],
                todayEventsLoadingFor = "",
                todayEventsError = "",
                setOpen = false,
                setTab = "calendars";
            let screenWakeLock = null,
                wakeLockMessage = "";
            cur.setDate(1);
            try {
                local = JSON.parse(localStorage.getItem("gaggle") || "[]");
            } catch (e) {}
            // Demo mode persists events locally; server mode persists them in
            // iCloud and only uses these browser stores for UI preferences.
            const saveLocal = () => {
                try {
                    localStorage.setItem("gaggle", JSON.stringify(local));
                } catch (e) {}
            };
            const saveSet = () => {
                try {
                    localStorage.setItem(
                        "gaggle-settings",
                        JSON.stringify({
                            days,
                            hide,
                            text: txt,
                            palette: pal,
                            auto,
                            darkFrom: dFrom,
                            darkTo: dTo,
                            view,
                            timeFormat,
                            compactWeek,
                            keepScreenAwake,
                            todayViewEnabled,
                            todayDismissed,
                            todayWeatherEnabled,
                            todayWeatherLocation,
                            todayTemperatureUnit,
                        }),
                    );
                } catch (e) {}
            };
            function renderWakeLockSettings() {
                const input = $("keep-screen-awake");
                const message = $("wake-lock-status");
                if (!input || !message) return;
                const supported = "wakeLock" in navigator;
                input.checked = keepScreenAwake;
                input.disabled = !supported;
                message.textContent = !supported
                    ? "Screen wake lock is not supported by this browser."
                    : wakeLockMessage;
            }
            async function requestScreenWakeLock() {
                if (
                    !keepScreenAwake ||
                    document.visibilityState !== "visible" ||
                    !("wakeLock" in navigator) ||
                    screenWakeLock
                )
                    return;
                try {
                    const lock = await navigator.wakeLock.request("screen");
                    if (!keepScreenAwake || document.visibilityState !== "visible") {
                        await lock.release();
                        return;
                    }
                    screenWakeLock = lock;
                    wakeLockMessage = "Screen will stay awake while Covey is visible.";
                    lock.addEventListener("release", () => {
                        if (screenWakeLock === lock) screenWakeLock = null;
                        wakeLockMessage = keepScreenAwake
                            ? "Screen wake lock was released by the device."
                            : "";
                        renderWakeLockSettings();
                    });
                } catch (error) {
                    wakeLockMessage =
                        "Could not keep the screen awake. Check browser or battery settings.";
                }
                renderWakeLockSettings();
            }
            async function updateScreenWakeLock() {
                if (keepScreenAwake) {
                    await requestScreenWakeLock();
                    return;
                }
                wakeLockMessage = "";
                const lock = screenWakeLock;
                screenWakeLock = null;
                if (lock && !lock.released) await lock.release();
                renderWakeLockSettings();
            }
            // Keep connection and preview-mode feedback in every status region.
            const status = (m) => {
                const t =
                    m ||
                    (demo
                        ? "Preview mode: events are saved in this browser only."
                        : "");
                document
                    .querySelectorAll(".status")
                    .forEach((e) => (e.textContent = t));
            };
            function timeAgo(d) {
                if (!d) return "";
                const s = Math.max(0, Math.round((Date.now() - d.getTime()) / 1000));
                if (s < 45) return "just now";
                const m = Math.round(s / 60);
                if (m < 60) return m + (m === 1 ? " minute ago" : " minutes ago");
                const h = Math.round(m / 60);
                if (h < 24) return h + (h === 1 ? " hour ago" : " hours ago");
                const days = Math.round(h / 24);
                return days + (days === 1 ? " day ago" : " days ago");
            }
            function updateSyncBadge() {
                const btn = $("syncbtn"),
                    dot = $("syncdot"),
                    label = $("syncsub");
                if (!btn) return;
                btn.classList.toggle("hidden", demo);
                btn.classList.toggle("flex", !demo);
                if (demo) return;
                if (syncState === "pending") {
                    dot.className = "w-2 h-2 rounded-full bg-mute shrink-0 animate-pulse";
                    label.textContent = "Syncing\u2026";
                    btn.title = "Connecting to iCloud\u2026";
                } else if (syncState === "ok") {
                    dot.className = "w-2 h-2 rounded-full bg-emerald-500 shrink-0";
                    label.textContent = "Synced";
                    btn.title = "Last synced " + timeAgo(lastSyncAt);
                } else {
                    dot.className = "w-2 h-2 rounded-full bg-rose-500 shrink-0 animate-pulse";
                    label.textContent = lastSyncAt ? "Offline" : "Can\u2019t connect";
                    btn.title = lastSyncAt
                        ? "Can\u2019t reach iCloud \u2014 last synced " + timeAgo(lastSyncAt)
                        : "Can\u2019t reach iCloud yet \u2014 tap to retry";
                }
            }
            function el(t, c, x) {
                const e = document.createElement(t);
                if (c) e.className = c;
                if (x != null) e.textContent = x;
                return e;
            }
            function peopleForEvent(event) {
                const ids = Array.isArray(event.personIds) && event.personIds.length
                    ? event.personIds
                    : event.personId
                      ? [event.personId]
                      : [];
                const byId = ids
                    .map((id) => people.find((person) => person.id === id))
                    .filter(Boolean);
                if (byId.length) return byId;
                const categories = Array.isArray(event.members)
                    ? event.members
                    : event.m
                      ? [event.m]
                      : [];
                const byCategory = people.filter((person) =>
                    categories.some(
                        (name) =>
                            person.name.toLocaleLowerCase() ===
                            String(name).toLocaleLowerCase(),
                    ),
                );
                return byCategory.length
                    ? byCategory
                    : personTitleMatches(
                          [event.t, event.notes].filter(Boolean).join("\n"),
                      );
            }
            const eventMemberName = (event) => {
                const assigned = peopleForEvent(event);
                return assigned.length
                    ? assigned.map((person) => person.name).join(", ")
                    : event.m || "Family";
            };
            const eventDisplayTitle = (event) => {
                const assigned = peopleForEvent(event),
                    mentioned = personTitleMatches(event.t || ""),
                    unmentionedNames = assigned
                        .filter(
                            (person) =>
                                !mentioned.some((match) => match.id === person.id),
                        )
                        .map((person) => person.name),
                    member = assigned.length
                        ? unmentionedNames.join(", ")
                        : eventMemberName(event);
                return event.kind === "event" && member && member !== "Family"
                    ? event.t + " · " + member
                    : event.t;
            };
            function avatarNode(person, size = 24) {
                const avatar = el(
                    "span",
                    "inline-grid place-items-center overflow-hidden rounded-full shrink-0 bg-accent text-on font-semibold",
                );
                avatar.style.width = size + "px";
                avatar.style.height = size + "px";
                avatar.style.fontSize = Math.max(9, Math.round(size * 0.58)) + "px";
                avatar.setAttribute("aria-hidden", "true");

                if (person.image) {
                    const image = el("img", "w-full h-full object-cover");
                    image.src = person.image;
                    image.alt = "";
                    avatar.append(image);
                } else {
                    avatar.textContent = AVATAR_EMOJI[person.avatar] ||
                        String(person.name || person.n || "?").slice(0, 1).toUpperCase();
                }
                return avatar;
            }

            function renderWhoOptions() {
                const options = $("who-options");
                options.innerHTML = "";
                people.forEach((person) => {
                    const selected = selectedPersonIds.has(person.id),
                        button = el(
                            "button",
                            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-sm font-medium " +
                                (selected
                                    ? "border-accent bg-accent/10 ring-1 ring-accent"
                                    : "border-line bg-bg"),
                        );
                    button.type = "button";
                    button.setAttribute("aria-pressed", selected);
                    button.setAttribute(
                        "aria-label",
                        (selected ? "Remove " : "Add ") + person.name,
                    );
                    button.append(
                        avatarNode(person, 20),
                        el("span", null, person.name),
                    );
                    button.onclick = () => {
                        if (selected) selectedPersonIds.delete(person.id);
                        else selectedPersonIds.add(person.id);
                        personSelectionTouched = true;
                        renderWhoOptions();
                    };
                    options.append(button);
                });
            }
            function syncTitlePeople(title) {
                if (personSelectionTouched) return;
                selectedPersonIds = new Set(
                    personTitleMatches(title).map((person) => person.id),
                );
                renderWhoOptions();
            }
            function personTitleMatches(title) {
                const normalized = title.toLocaleLowerCase().replace(/’/g, "'"),
                    isWordCharacter = (character) =>
                        !!character && /[\p{L}\p{N}]/u.test(character),
                    occurrences = [];
                people.forEach((person) => {
                    const name = person.name.toLocaleLowerCase().replace(/’/g, "'");
                    let start = -1;
                    while ((start = normalized.indexOf(name, start + 1)) >= 0) {
                        const before = normalized[start - 1] || "";
                        let end = start + name.length;
                        if (normalized.slice(end, end + 2) === "'s") end += 2;
                        const after = normalized[end] || "";
                        if (!isWordCharacter(before) && !isWordCharacter(after))
                            occurrences.push({ person, start, end, nameLength: name.length });
                    }
                });
                const matchedIds = new Set(
                    occurrences
                        .filter(
                            (occurrence) =>
                                !occurrences.some(
                                    (other) =>
                                        other.person.id !== occurrence.person.id &&
                                        other.nameLength > occurrence.nameLength &&
                                        other.start <= occurrence.start &&
                                        other.end >= occurrence.end,
                                ),
                        )
                        .map((occurrence) => occurrence.person.id),
                );
                return people.filter((person) => matchedIds.has(person.id));
            }
            // All server-backed event operations go through this small JSON API
            // wrapper so errors are surfaced consistently in the UI.
            async function api(method, url, body) {
                const r = await fetch(url, {
                    method,
                    headers: body ? { "Content-Type": "application/json" } : {},
                    body: body ? JSON.stringify(body) : undefined,
                });
                let j = null;
                try {
                    j = await r.json();
                } catch (e) {}
                if (!r.ok) {
                    if (
                        r.status === 404 &&
                        method === "POST" &&
                        (url === "/api/config/calendars" ||
                            url === "/api/config/people")
                    ) {
                        throw new Error(
                            "The running server is out of date. Stop and restart Covey to load the latest settings API.",
                        );
                    }
                    const message = (j && j.error) || `Request failed (HTTP ${r.status})`;
                    if (
                        r.status === 400 &&
                        method === "POST" &&
                        url === "/api/config/calendars" &&
                        ["users", "baby"].includes(body?.icon) &&
                        /available.*icons/i.test(message)
                    ) {
                        throw new Error(
                            "The running server has an older calendar icon list. Stop and restart Covey, then refresh the page to use People or Kids icons.",
                        );
                    }
                    throw new Error(message);
                }
                return j;
            }
            const mkey = (d) => d.getFullYear() + "-" + pad(d.getMonth() + 1);
            function months() {
                if (view === "month") return [mkey(cur)];
                return [
                    ...new Set([
                        mkey(parse(wstart)),
                        mkey(parse(addDays(wstart, days - 1))),
                    ]),
                ];
            }
            // Load only the months needed by the current view. In preview mode,
            // the same filtering is performed against the local event store.
            async function load() {
                try {
                    const requestedMonths = months();
                    const p = await Promise.all(
                        requestedMonths.map((k) =>
                            demo
                                ? local.filter((e) => e.d.startsWith(k))
                                : api("GET", "/api/events?month=" + k),
                        ),
                    );
                    ev = p.flat();
                    loadedMonths = requestedMonths;
                    status("");
                    syncState = "ok";
                    lastSyncAt = new Date();
                } catch (e) {
                    status("Can't reach iCloud: " + e.message);
                    syncState = "error";
                }
                updateSyncBadge();
                render();
            }
            function go(dir) {
                needScroll = true;
                armIdleReset();
                if (view === "month") {
                    cur.setMonth(cur.getMonth() + dir);
                    const t = new Date();
                    sel = mkey(cur) === mkey(t) ? iso(t) : iso(cur);
                } else {
                    wstart = addDays(wstart, dir * days);
                    sel = wstart;
                    const d = parse(wstart);
                    cur = new Date(d.getFullYear(), d.getMonth(), 1);
                }
                load();
            }
            function setView(v) {
                needScroll = true;
                armIdleReset();
                if (v !== "month" && view === "month")
                    wstart = days === 7 ? sunday(sel) : sel;
                if (v === "month") {
                    const d = parse(wstart);
                    cur = new Date(d.getFullYear(), d.getMonth(), 1);
                    if (mkey(parse(sel)) !== mkey(cur)) sel = iso(cur);
                }
                view = v;
                saveSet();
                load();
            }
            function setDays(n) {
                needScroll = true;
                armIdleReset();
                days = n;
                if (n === 7) wstart = sunday(wstart);
                saveSet();
                load();
            }
            // Theme changes are delegated to theme.js; this layer decides which
            // mode is currently effective, including temporary manual overrides.
            const sysMode = () =>
                matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light";
            function eff() {
                const sc = auto ? GT.sched(dFrom, dTo) : null;
                if (ovr && sc !== ovr.base) ovr = null;
                return ovr ? ovr.mode : auto ? sc : manual || sysMode();
            }
            const icon = () => {
                $("theme").innerHTML = ic(eff() === "dark" ? "sun" : "moon");
            };
            function paint() {
                GT.apply(pal, eff());
                icon();
            }
            $("theme").onclick = () => {
                const nx = eff() === "dark" ? "light" : "dark";
                if (auto) ovr = { mode: nx, base: GT.sched(dFrom, dTo) };
                else {
                    manual = nx;
                    try {
                        localStorage.setItem("gaggle-theme", nx);
                    } catch (e) {}
                }
                paint();
                if (setOpen) render();
            };
            matchMedia("(prefers-color-scheme: dark)").addEventListener(
                "change",
                () => {
                    paint();
                    if (setOpen) render();
                },
            );
            function tick() {
                paint();
                const n = new Date();
                $("clock").textContent = formatTime(n, {
                    hour: "numeric",
                    minute: "2-digit",
                });
                updateSyncBadge();
                checkTodayView(n);
                refreshTodayWeatherIfDue(n);
            }
            function renderTodaySettings() {
                $("today-enabled").checked = todayViewEnabled;
                $("today-preview").disabled = !todayViewEnabled;
                $("today-preview").classList.toggle("opacity-50", !todayViewEnabled);
                $("today-weather-enabled").checked = todayWeatherEnabled;
                $("today-temperature-unit").value = todayTemperatureUnit;
                if (document.activeElement !== $("today-weather-location"))
                    $("today-weather-location").value = todayWeatherLocation;
                $("today-weather-location-save").disabled =
                    !$("today-weather-location").value.trim();
                $("today-weather-location-save").classList.toggle(
                    "opacity-50",
                    $("today-weather-location-save").disabled,
                );
            }
            function scheduledTodaySlot(now) {
                const minutes = now.getHours() * 60 + now.getMinutes();
                if (minutes >= 6 * 60 && minutes < 9 * 60) return "morning";
                if (minutes >= 16 * 60 && minutes < 18 * 60) return "evening";
                return null;
            }
            function ensureTodayEvents(date) {
                if (demo) {
                    todayEventCacheDate = date;
                    todayEventCache = local.filter((event) => event.d === date);
                    todayEventsError = "";
                    return;
                }
                const month = mkey(parse(date));
                if (loadedMonths.includes(month)) {
                    todayEventCacheDate = date;
                    todayEventCache = ev.filter((event) => event.d === date);
                    todayEventsLoadingFor = "";
                    todayEventsError = "";
                    return;
                }
                if (todayEventCacheDate === date || todayEventsLoadingFor === date) return;
                todayEventsLoadingFor = date;
                todayEventsError = "";
                api("GET", "/api/events?month=" + month)
                    .then((events) => {
                        if (todayEventsLoadingFor !== date) return;
                        todayEventCacheDate = date;
                        todayEventCache = events.filter((event) => event.d === date);
                        todayEventsLoadingFor = "";
                        todayEventsError = "";
                        renderTodayOverlay(true);
                    })
                    .catch((error) => {
                        if (todayEventsLoadingFor !== date) return;
                        todayEventCacheDate = date;
                        todayEventCache = [];
                        todayEventsLoadingFor = "";
                        todayEventsError = error.message || "Could not load today’s events.";
                        renderTodayOverlay(true);
                    });
            }
            function retryTodayEvents() {
                todayEventCacheDate = "";
                todayEventsError = "";
                ensureTodayEvents(iso(new Date()));
                renderTodayOverlay(true);
            }
            function visibleTodayEvents(date) {
                return (todayEventCacheDate === date ? todayEventCache : [])
                    .filter((event) => event.d === date)
                    .filter((event) => {
                        const custom = event.calendarId &&
                            !["event", "reminder", "dinner"].includes(event.calendarId);
                        if (custom) return !hide["calendar:" + event.calendarId];
                        return K[event.kind] ? !hide[event.kind] : !hide.event;
                    })
                    .sort((a, b) => (a.tm || "").localeCompare(b.tm || ""));
            }

            function openTodayOverlay(slot, preview = false) {
                if (!todayOverlayOpen) todayReturnFocus = document.activeElement;
                const date = iso(new Date());
                todayOverlayOpen = {
                    slot,
                    preview,
                    key: date + ":" + (preview ? "preview" : slot),
                };
                todayOverlaySignature = "";
                renderTodayOverlay(true);
                $("today-overlay-close").focus();
            }
            function closeTodayOverlay(dismiss = false) {
                if (!todayOverlayOpen) return;
                if (dismiss && !todayOverlayOpen.preview) {
                    todayDismissed = [
                        ...todayDismissed.filter((key) => key !== todayOverlayOpen.key),
                        todayOverlayOpen.key,
                    ].slice(-14);
                    saveSet();
                }
                todayOverlayOpen = null;
                todayOverlaySignature = "";
                renderTodayOverlay(true);
                const returnFocus = todayReturnFocus;
                todayReturnFocus = null;
                if (returnFocus?.isConnected) returnFocus.focus();
            }
            function checkTodayView(now = new Date()) {
                if (todayOverlayOpen?.preview) return;
                const slot = todayViewEnabled && !setOpen && !sheet && !detailEvent
                    ? scheduledTodaySlot(now)
                    : null;
                const key = slot ? iso(now) + ":" + slot : null;
                if (!slot || todayDismissed.includes(key)) {
                    if (todayOverlayOpen) closeTodayOverlay(false);
                    return;
                }
                if (todayOverlayOpen?.key !== key) openTodayOverlay(slot);
            }
            function formatTodayTemperature(value) {
                if (!Number.isFinite(value)) return "—";
                const temperature = todayTemperatureUnit === "C" ? (value - 32) * 5 / 9 : value;
                return Math.round(temperature) + "°" + todayTemperatureUnit;
            }
            function weatherIcon(code, isDay) {
                if (code === 0) return isDay ? "sun" : "moon";
                if ([1, 2].includes(code)) return isDay ? "cloud-sun" : "cloud-moon";
                if (code === 3) return "cloud";
                if ([45, 48].includes(code)) return "cloud-fog";
                if ([51, 53, 55, 56, 57].includes(code)) return "cloud-drizzle";
                if ([80, 81, 82].includes(code)) return isDay ? "cloud-sun-rain" : "cloud-rain";
                if ([61, 63, 65, 66, 67].includes(code)) return "cloud-rain";
                if ([71, 73, 75, 77, 85, 86].includes(code)) return "cloud-snow";
                if ([95, 96, 99].includes(code)) return "cloud-lightning";
                return "cloud";
            }
            function refreshTodayWeatherIfDue(now = new Date()) {
                if (
                    !todayOverlayOpen ||
                    !todayWeatherEnabled ||
                    !todayWeatherLocation ||
                    todayWeatherStatus === "loading" ||
                    !todayWeatherLastRequestAt ||
                    now.getTime() - todayWeatherLastRequestAt < 15 * 60 * 1000
                )
                    return;
                todayWeatherStatus = "idle";
                loadTodayWeather();
            }
            function weatherDescription(code) {
                if (code === 0) return "Clear skies";
                if ([1, 2].includes(code)) return "Partly cloudy";
                if (code === 3) return "Cloudy";
                if ([45, 48].includes(code)) return "Foggy";
                if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
                if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain";
                if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
                if ([95, 96, 99].includes(code)) return "Thunderstorms";
                return "Current conditions";
            }

            async function loadTodayWeather() {
                if (
                    !todayWeatherEnabled ||
                    !todayWeatherLocation ||
                    todayWeatherStatus === "loading"
                )
                    return;
                const location = todayWeatherLocation;
                const requestDate = iso(new Date());
                todayWeatherRequestDate = requestDate;
                todayWeatherLastRequestAt = Date.now();
                todayWeatherStatus = "loading";
                todayWeatherMessage = "";
                renderTodayOverlay(true);
                try {
                    const geocodeQuery = new URLSearchParams({
                        name: location,
                        count: "1",
                        language: "en",
                        format: "json",
                    });
                    const geocodeResponse = await fetch(
                        "https://geocoding-api.open-meteo.com/v1/search?" + geocodeQuery,
                    );
                    if (!geocodeResponse.ok)
                        throw new Error("Location search is unavailable.");
                    const places = await geocodeResponse.json();
                    const place = places.results?.[0];
                    if (!place)
                        throw new Error("Could not find that city or postal code.");
                    const query = new URLSearchParams({
                        latitude: String(place.latitude),
                        longitude: String(place.longitude),
                        current: "temperature_2m,weather_code,is_day",
                        daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
                        temperature_unit: "fahrenheit",
                        timezone: place.timezone || "auto",
                        forecast_days: "1",
                    });
                    const response = await fetch(
                        "https://api.open-meteo.com/v1/forecast?" + query,
                    );
                    if (!response.ok) throw new Error("Weather service is unavailable.");
                    const forecast = await response.json();
                    if (
                        location !== todayWeatherLocation ||
                        requestDate !== iso(new Date()) ||
                        todayWeatherRequestDate !== requestDate
                    )
                        return;
                    todayWeather = {
                        date: requestDate,
                        location: [place.name, place.admin1, place.country]
                            .filter((part, index, parts) => part && parts.indexOf(part) === index)
                            .join(", "),
                        temperature: forecast.current?.temperature_2m,
                        code: forecast.current?.weather_code ?? forecast.daily?.weather_code?.[0],
                        isDay: forecast.current?.is_day === 1,
                        high: forecast.daily?.temperature_2m_max?.[0],
                        low: forecast.daily?.temperature_2m_min?.[0],
                        rain: forecast.daily?.precipitation_probability_max?.[0],
                    };
                    todayWeatherStatus = "ready";
                } catch (error) {
                    if (
                        requestDate !== iso(new Date()) ||
                        todayWeatherRequestDate !== requestDate ||
                        location !== todayWeatherLocation
                    )
                        return;
                    todayWeatherStatus = "error";
                    todayWeatherMessage = error.message || "Could not load the forecast.";
                }
                renderTodayOverlay(true);
            }
            function renderTodayOverlay(force = false) {
                const overlay = $("today-overlay");
                const active = todayOverlayOpen;
                overlay.classList.toggle("hidden", !active);
                overlay.setAttribute("aria-hidden", String(!active));
                $("app-shell").inert = !!active;
                $("addbtn").inert = !!active;
                $("sheet").inert = !!active;
                $("settings").inert = !!active;
                $("event-detail").inert = !!active;
                if (!active) {
                    todayOverlaySignature = "";
                    return;
                }
                const date = iso(new Date());
                if (
                    (todayWeather && todayWeather.date !== date) ||
                    (todayWeatherRequestDate && todayWeatherRequestDate !== date)
                ) {
                    todayWeather = null;
                    todayWeatherRequestDate = "";
                    todayWeatherStatus = "idle";
                    todayWeatherMessage = "";
                    todayWeatherLastRequestAt = 0;
                }
                ensureTodayEvents(date);
                const todayEvents = visibleTodayEvents(date);
                const eveningEvents = todayEvents.filter((event) =>
                    !event.tm || event.kind === "dinner" ||
                    Number(event.tm.slice(0, 2)) >= 16 ||
                    (event.te && Number(event.te.slice(0, 2)) >= 16),
                );
                const events = active.slot === "evening" ? eveningEvents : todayEvents;
                const signature = JSON.stringify([
                    active.key,
                    date,
                    todayEvents.map((event) => [
                        event.url,
                        event.id,
                        event.t,
                        event.tm,
                        event.te,
                        event.kind,
                        eventMemberName(event),
                        peopleForEvent(event).map((person) => [
                            person.id,
                            person.name,
                            person.avatar,
                            person.image,
                        ]),
                    ]),
                    todayEventsLoadingFor === date,
                    todayEventsError,
                    todayWeatherEnabled,
                    todayWeatherLocation,
                    todayTemperatureUnit,
                    todayWeatherStatus,
                    todayWeather,
                    todayWeatherMessage,
                ]);
                if (!force && signature === todayOverlaySignature) return;
                const focusedId = overlay.contains(document.activeElement)
                    ? document.activeElement.id
                    : "";
                overlay.innerHTML = "";
                overlay.setAttribute("role", "dialog");
                overlay.setAttribute("aria-modal", "true");
                overlay.setAttribute("aria-label", active.slot === "morning" ? "Today overview" : "This evening overview");
                overlay.onkeydown = (event) => {
                    if (event.key === "Escape") {
                        event.preventDefault();
                        event.stopPropagation();
                        closeTodayOverlay(true);
                        return;
                    }
                    if (event.key !== "Tab") return;
                    const controls = [...overlay.querySelectorAll("button:not(:disabled), a[href]")];
                    if (!controls.length) return;
                    if (event.shiftKey && document.activeElement === controls[0]) {
                        event.preventDefault();
                        controls[controls.length - 1].focus();
                    } else if (!event.shiftKey && document.activeElement === controls[controls.length - 1]) {
                        event.preventDefault();
                        controls[0].focus();
                    }
                };
                const page = el("main", "flex min-h-screen items-center px-4 py-6 sm:px-8 sm:py-12");
                page.style.paddingTop = "calc(env(safe-area-inset-top, 0px) + 2.5rem)";
                page.style.paddingBottom = "calc(env(safe-area-inset-bottom, 0px) + 2.5rem)";
                const content = el("div", "mx-auto w-full max-w-6xl");
                const header = el("header", "mb-14 flex items-start justify-between gap-4");
                const heading = el("div", "min-w-0");
                const now = new Date();
                const greeting = active.slot === "morning"
                    ? "Good morning."
                    : now.getHours() >= 17 ? "Good evening." : "Good afternoon.";
                heading.append(
                    el(
                        "p",
                        "mb-2 text-base font-medium text-accent",
                        now.toLocaleDateString(undefined, {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        }),
                    ),
                    el("h1", "text-3xl font-semibold tracking-tight sm:text-6xl", greeting),
                    el(
                        "p",
                        "mt-2 text-base text-mute sm:text-lg",
                        active.slot === "morning"
                            ? "Here’s what’s happening today."
                            : "Here’s what’s happening this evening.",
                    ),
                );
                header.append(heading);
                const close = el(
                    "button",
                    "h-11 w-11 shrink-0 grid place-items-center rounded-full bg-card text-mute",
                );
                close.id = "today-overlay-close";
                close.type = "button";
                close.setAttribute("aria-label", "Dismiss Today view");
                close.innerHTML = ic("x", 20);
                close.onclick = () => closeTodayOverlay(true);
                header.append(close);
                const columns = el("div", "grid gap-6 lg:grid-cols-[0.85fr_1.15fr]");
                const weather = el("section", "rounded-2xl bg-card p-5 sm:p-6");
                const weatherPlace = todayWeather?.location || todayWeatherLocation;
                weather.append(
                    el("h2", "text-2xl font-semibold", "Today’s weather"),
                    el(
                        "p",
                        "mt-1 text-mute",
                        !todayWeatherEnabled
                            ? "Weather is off in settings"
                            : weatherPlace || "Set a location in Today settings",
                    ),
                );
                if (todayWeatherEnabled && todayWeatherStatus === "ready" && todayWeather) {
                    const row = el("div", "mt-5 flex items-center gap-4");
                    const icon = el("div", "shrink-0 text-accent");
                    icon.innerHTML = ic(weatherIcon(todayWeather.code, todayWeather.isDay), 52);
                    const current = el("div", null);
                    current.append(
                        el(
                            "p",
                            "text-5xl font-semibold",
                            formatTodayTemperature(todayWeather.temperature),
                        ),
                        el("p", "text-lg text-mute", weatherDescription(todayWeather.code)),
                    );
                    row.append(icon, current);
                    weather.append(row);
                    const detail = [
                        Number.isFinite(todayWeather.high) ? "High " + formatTodayTemperature(todayWeather.high) : "",
                        Number.isFinite(todayWeather.low) ? "Low " + formatTodayTemperature(todayWeather.low) : "",
                        Number.isFinite(todayWeather.rain) ? todayWeather.rain + "% chance of rain" : "",
                    ].filter(Boolean).join(" · ");
                    if (detail) weather.append(el("p", "mt-4 text-md text-mute", detail));
                } else {
                    const message = !todayWeatherEnabled
                        ? "Turn on weather in Today settings to see a forecast."
                        : !todayWeatherLocation
                          ? "Choose a city or postal code in Today settings to see the local forecast."
                          : todayWeatherStatus === "loading"
                            ? "Loading forecast for " + todayWeatherLocation + "…"
                            : todayWeatherMessage || "The local forecast will load automatically.";
                    weather.append(el("p", "mt-5 text-sm text-mute", message));
                    if (!todayWeatherEnabled || !todayWeatherLocation) {
                        const configureWeather = el(
                            "button",
                            "mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-on",
                            todayWeatherEnabled ? "Set weather location" : "Weather settings",
                        );
                        configureWeather.type = "button";
                        configureWeather.onclick = () => {
                            closeTodayOverlay(false);
                            setOpen = true;
                            setTab = "today";
                            render();
                            $(todayWeatherEnabled ? "today-weather-location" : "today-weather-enabled").focus();
                        };
                        weather.append(configureWeather);
                    }
                    if (
                        todayWeatherEnabled &&
                        todayWeatherLocation &&
                        todayWeatherStatus === "error"
                    ) {
                        const retryWeather = el("button", "mt-3 text-sm font-semibold text-accent", "Try again");
                        retryWeather.type = "button";
                        retryWeather.onclick = loadTodayWeather;
                        weather.append(retryWeather);
                    }
                }
                if (todayWeather) {
                    const attribution = el("a", "mt-4 inline-block text-[11px] text-mute underline", "Weather by Open-Meteo");
                    attribution.href = "https://open-meteo.com/";
                    attribution.target = "_blank";
                    attribution.rel = "noopener noreferrer";
                    weather.append(attribution);
                }
                const plans = el("section", "rounded-2xl bg-card p-5 sm:p-6");
                plans.append(
                    el("h2", "text-2xl font-semibold", active.slot === "morning" ? "On the calendar" : "This evening"),
                    el(
                        "p",
                        "mt-1 text-base text-mute",
                        events.length
                            ? `${events.length} ${events.length === 1 ? "plan" : "plans"}`
                            : todayEventsLoadingFor === date
                              ? "Loading today’s calendar"
                              : todayEventsError
                                ? "Calendar unavailable"
                                : "A little breathing room",
                    ),
                );
                if (!events.length) {
                    plans.append(
                        el(
                            "p",
                            "mt-6 rounded-xl bg-bg p-4 text-sm text-mute",
                            todayEventsLoadingFor === date
                                ? "Checking the calendar…"
                                : todayEventsError
                                  ? todayEventsError
                                  : active.slot === "morning"
                                    ? "Nothing planned today. Enjoy the space."
                                    : "No evening plans on the calendar.",
                        ),
                    );
                    if (todayEventsError) {
                        const retry = el("button", "mt-3 text-sm font-semibold text-accent", "Try again");
                        retry.type = "button";
                        retry.onclick = retryTodayEvents;
                        plans.append(retry);
                    }
                } else {
                    const list = el("div", "mt-4 flex flex-col gap-3");
                    events.forEach((event) => {
                        const color = sty(event);
                        const typeLabel = { dinner: "Dinner", reminder: "Reminder" }[event.kind];
                        const card = el("article", "rounded-xl p-4" + (typeLabel ? "" : " bg-bg"));
                        card.style.borderLeft = "4px solid " + color.d;
                        if (typeLabel)
                            card.style.backgroundColor = "color-mix(in srgb, " + color.c + " 22%, var(--bg))";
                        const meta = el("div", "flex items-center justify-between gap-2");
                        if (event.tm || !typeLabel)
                            meta.append(el("p", "text-base font-semibold text-mute", event.tm ? trange(event) : "All day"));
                        if (typeLabel) {
                            const badge = el("span", "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold");
                            badge.style.color = color.d;
                            badge.style.backgroundColor = "color-mix(in srgb, " + color.c + " 55%, var(--bg))";
                            badge.innerHTML = ic(K[event.kind].i, 14);
                            badge.append(el("span", null, typeLabel));
                            meta.append(badge);
                        }
                        card.append(meta, el("h3", "mt-1 text-xl font-semibold", event.t || "(no title)"));
                        const assigned = peopleForEvent(event);
                        const peopleRow = el("div", "mt-3 flex flex-wrap items-center gap-2");
                        if (assigned.length) {
                            assigned.forEach((person) => {
                                const chip = el("span", "inline-flex items-center gap-1.5 rounded-full border border-line bg-card py-1 pl-1 pr-2.5 text-xs font-medium");
                                chip.append(avatarNode(person, 24), el("span", null, person.name));
                                peopleRow.append(chip);
                            });
                        } else if (!typeLabel) {
                            peopleRow.append(el("span", "rounded-full border border-line bg-card px-2.5 py-1 text-xs text-mute", eventMemberName(event)));
                        }
                        if (assigned.length || !typeLabel) card.append(peopleRow);
                        list.append(card);
                    });
                    plans.append(list);
                }
                columns.append(weather, plans);
                content.append(header, columns);
                page.append(content);
                overlay.append(page);
                todayOverlaySignature = signature;
                if (focusedId) overlay.querySelector("#" + focusedId)?.focus();
                if (
                    todayWeatherEnabled &&
                    todayWeatherLocation &&
                    todayWeatherStatus === "idle"
                )
                    loadTodayWeather();
                else
                    refreshTodayWeatherIfDue();
            }
            renderWhoOptions();
            function openSheet(k) {
                sel = k;
                sheet = true;
                render();
            }
            function closeSheet() {
                sheet = false;
                render();
            }
            function openEventDetails(event) {
                detailReturnFocus = document.activeElement;
                detailEvent = event;
                render();
                $("event-detail-close").focus();
            }
            function closeEventDetails() {
                detailEvent = null;
                render();
                const returnFocus = detailReturnFocus?.isConnected
                    ? detailReturnFocus
                    : sheet
                      ? $("close")
                      : $("addbtn");
                returnFocus?.focus();
                detailReturnFocus = null;
            }
            function activateEventNode(node, event) {
                if (node.tagName !== "BUTTON") {
                    node.setAttribute("role", "button");
                    node.tabIndex = 0;
                    node.onkeydown = (keyEvent) => {
                        if (keyEvent.key !== "Enter" && keyEvent.key !== " ") return;
                        keyEvent.preventDefault();
                        keyEvent.stopPropagation();
                        openEventDetails(event);
                    };
                }
                node.onclick = (clickEvent) => {
                    clickEvent.stopPropagation();
                    openEventDetails(event);
                };
            }
            // Month, week, and list views share one event model; each has a
            // separate layout path suited to its calendar presentation.
            function monthCell(k, num, list, max, td) {
                const c = el(
                    "div",
                    "bg-card text-left p-1.5 flex flex-col gap-1 overflow-hidden min-h-0 cursor-pointer",
                );
                const dayButton = el(
                    "button",
                    "text-sm lg:text-base font-semibold w-7 h-7 grid place-items-center rounded-full shrink-0 " +
                        (k === td ? "bg-accent text-on" : ""),
                    num,
                );
                dayButton.type = "button";
                dayButton.setAttribute("aria-label", "Open events for " + k);
                dayButton.onclick = (clickEvent) => {
                    clickEvent.stopPropagation();
                    openSheet(k);
                };
                c.append(dayButton);
                list.slice(0, max).forEach((e) => {
                    const m = sty(e),
                        p = el(
                            "span",
                            "block truncate rounded-md px-1.5 py-1 text-xs lg:text-sm font-medium",
                            (e.tm ? tshort(e.tm) + " " : "") +
                                eventDisplayTitle(e),
                        );
                    p.style.background = m.c;
                    p.style.color = INK;
                    const eventTag = tag(p, e);
                    activateEventNode(eventTag, e);
                    c.append(eventTag);
                });
                if (list.length > max)
                    c.append(
                        el(
                            "span",
                            "text-xs text-mute",
                            "+" + (list.length - max) + " more",
                        ),
                    );
                c.onclick = () => openSheet(k);
                return c;
            }
            let H = 72;
            const GUT = "52px";
            const mins = (t) => {
                const [h, m] = t.split(":").map(Number);
                return h * 60 + m;
            };
            const trange = (e) =>
                tfmt(e.tm) + (e.te && e.te !== e.tm ? " – " + tfmt(e.te) : "");
            let needScroll = true;
            // Scrolling or navigating starts a quiet timer that returns the view
            // to the current day and time after the user has stopped interacting.
            const NOW_IDLE_MS = 3 * 60 * 1000; // how long to wait after the user stops interacting before snapping back to "now"
            let nowIdleTimer = null,
                suppressScrollEvents = false;
            function goToNow() {
                if (sheet || detailEvent || setOpen) {
                    armIdleReset();
                    return;
                } // don't yank the view while a sheet/modal is open; just keep checking
                needScroll = true;
                const t = new Date();
                sel = iso(t);
                wstart = home();
                cur = new Date(t.getFullYear(), t.getMonth(), 1);
                load();
            }
            function armIdleReset() {
                clearTimeout(nowIdleTimer);
                nowIdleTimer = setTimeout(goToNow, NOW_IDLE_MS);
            }
            // Secondary navigation fades while the calendar is idle, but any
            // pointer, touch, keyboard, or wheel activity brings it back.
            const CHROME_IDLE_MS = 6000; // hide nav chrome after this long without interaction
            let chromeIdleTimer = null;
            function wakeChrome() {
                document.body.classList.remove("chrome-idle");
                clearTimeout(chromeIdleTimer);
                chromeIdleTimer = setTimeout(() => {
                    if (!sheet && !detailEvent && !setOpen)
                        document.body.classList.add("chrome-idle");
                }, CHROME_IDLE_MS);
            }
            function layoutDay(list) {
                const items = list
                    .filter((e) => e.tm)
                    .map((e) => {
                        const s = mins(e.tm),
                            f0 = e.te ? mins(e.te) : s + 60;
                        return {
                            e,
                            s,
                            f: Math.min(1440, f0 > s ? f0 : s + 60),
                        };
                    })
                    .sort((a, b) => a.s - b.s || b.f - a.f);
                let cl = [],
                    ends = [],
                    cend = 0;
                const flush = () => {
                    const primary = cl.reduce(
                        (longest, item) =>
                            item.f - item.s > longest.f - longest.s
                                ? item
                                : longest,
                        cl[0],
                    );
                    const primaryDuration = primary
                        ? primary.f - primary.s
                        : 0;
                    const peers = new Map();
                    cl.forEach((i) => {
                        const key = `${i.s}:${i.e.kind || "event"}`;
                        if (!peers.has(key)) peers.set(key, []);
                        peers.get(key).push(i);
                    });
                    cl.forEach((i) => {
                        const group = peers.get(
                            `${i.s}:${i.e.kind || "event"}`,
                        );
                        i.n = ends.length;
                        i.primary = i === primary;
                        i.primaryDuration = primaryDuration;
                        i.sideBySide = group.length > 1;
                        i.peerCount = group.length;
                        i.peerIndex = group.indexOf(i);
                        i.z = i.sideBySide
                            ? 200 + i.peerIndex
                            : i.primary
                              ? 0
                              : 1 +
                                Math.round(
                                    ((i.f - i.s) / primaryDuration) * 100,
                                );
                    });
                    cl = [];
                    ends = [];
                    cend = 0;
                };
                items.forEach((i) => {
                    if (cl.length && i.s >= cend) flush();
                    let l = ends.findIndex((x) => x <= i.s);
                    if (l < 0) {
                        l = ends.length;
                        ends.push(0);
                    }
                    ends[l] = i.f;
                    i.l = l;
                    cl.push(i);
                    cend = Math.max(cend, i.f);
                });
                flush();
                return items;
            }
            function renderList(keys, td, on) {
                const list = $("listview");
                list.innerHTML = "";
                keys.forEach((k) => {
                    const date = parse(k),
                        today = k === td,
                        items = ev
                            .filter((e) => on(e, k))
                            .sort((a, b) => {
                                if (!a.tm && b.tm) return -1;
                                if (a.tm && !b.tm) return 1;
                                if (a.tm !== b.tm)
                                    return (a.tm || "").localeCompare(
                                        b.tm || "",
                                    );
                                return a.t.localeCompare(b.t);
                            }),
                        section = el(
                            "section",
                            "px-3 py-3 border-b border-line last:border-b-0",
                        ),
                        heading = el(
                            "button",
                            "w-full flex items-center gap-3 text-left mb-2",
                        ),
                        dayNumber = el(
                            "span",
                            "w-10 h-10 shrink-0 grid place-items-center rounded-full text-lg font-semibold " +
                                (today ? "bg-accent text-on" : "bg-bg"),
                            date.getDate(),
                        ),
                        dateLabel = el(
                            "span",
                            "flex-1 text-sm font-semibold",
                            date.toLocaleDateString(undefined, {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                            }),
                        );
                    section.dataset.day = k;
                    heading.setAttribute(
                        "aria-label",
                        "Add event on " + dateLabel.textContent,
                    );
                    heading.append(dayNumber, dateLabel);
                    heading.onclick = () => openSheet(k);
                    section.append(heading);
                    if (!items.length) {
                        section.append(
                            el(
                                "p",
                                "pl-[52px] text-sm text-mute",
                                "No events",
                            ),
                        );
                    } else {
                        items.forEach((event) => {
                            const color = sty(event),
                                card = el(
                                    "button",
                                    "w-full min-w-0 flex items-start gap-3 rounded-xl border border-line px-3 py-2.5 mb-2 last:mb-0 text-left",
                                ),
                                time = el(
                                    "span",
                                    "w-[4.5rem] shrink-0 pt-0.5 text-xs font-medium text-mute",
                                    event.tm ? trange(event) : "All day",
                                ),
                                title = tag(
                                    el(
                                        "span",
                                        "block min-w-0 truncate text-sm font-semibold",
                                        eventDisplayTitle(event),
                                    ),
                                    event,
                                );
                            card.style.background = color.c;
                            card.style.color = INK;
                            card.style.borderLeft = "4px solid " + color.d;
                            card.setAttribute(
                                "aria-label",
                                (event.tm ? trange(event) : "All day") +
                                    ": " +
                                    eventDisplayTitle(event),
                            );
                            card.append(time, title);
                            activateEventNode(card, event);
                            section.append(card);
                        });
                    }
                    list.append(section);
                });
                if (needScroll) {
                    const focus = list.querySelector(
                        '[data-day="' +
                            (keys.includes(sel) ? sel : keys[0]) +
                            '"]',
                    );
                    if (focus)
                        list.scrollTop =
                            focus.getBoundingClientRect().top -
                            list.getBoundingClientRect().top +
                            list.scrollTop;
                    needScroll = false;
                }
            }
            function renderWeek(keys, td, on) {
                const tg = $("tg"),
                    st = tg.scrollTop,
                    hourStart = compactWeek ? 8 : 0,
                    hourEnd = compactWeek ? 20 : 24,
                    rangeStart = hourStart * 60,
                    rangeEnd = hourEnd * 60;
                suppressScrollEvents = true;
                tg.innerHTML = "";
                const cols =
                    "grid-template-columns:" +
                    GUT +
                    " repeat(" +
                    keys.length +
                    ",minmax(0,1fr))";
                const head = el(
                    "div",
                    "sticky top-0 z-10 bg-card border-b border-line",
                );
                const hr = el("div", "grid");
                hr.style.cssText = cols;
                hr.append(el("div"));
                keys.forEach((k) => {
                    const d = parse(k),
                        c = el(
                            "button",
                            "text-left p-2 border-l border-line flex flex-col items-start",
                        );
                    c.append(
                        el(
                            "span",
                            "text-xs uppercase tracking-wide text-mute",
                            d.toLocaleDateString(undefined, {
                                weekday: "short",
                            }),
                        ),
                        el(
                            "span",
                            "text-2xl lg:text-3xl font-medium w-10 h-10 lg:w-12 lg:h-12 grid place-items-center rounded-full " +
                                (k === td ? "bg-accent text-on" : ""),
                            d.getDate(),
                        ),
                    );
                    const outsideCount = compactWeek
                        ? ev.filter((e) => {
                              if (!on(e, k) || !e.tm) return false;
                              const start = mins(e.tm);
                              let end = e.te ? mins(e.te) : start + 60;
                              if (end <= start) end += 1440;
                              return start < rangeStart || end > rangeEnd;
                          }).length
                        : 0;
                    if (outsideCount) {
                        c.append(
                            el(
                                "span",
                                "text-[9px] leading-tight text-mute",
                                outsideCount + " outside",
                            ),
                        );
                        c.setAttribute(
                            "aria-label",
                            `${d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}, ${outsideCount} events outside 8 AM to 8 PM`,
                        );
                    }
                    c.onclick = () => openSheet(k);
                    hr.append(c);
                });
                head.append(hr);
                const ad = keys.map((k) => ev.filter((e) => on(e, k) && !e.tm));
                if (ad.some((a) => a.length)) {
                    const ar = el("div", "grid border-t border-line");
                    ar.style.cssText = cols;
                    ar.append(
                        el(
                            "div",
                            "text-[10px] text-mute p-1 text-right",
                            "all-day",
                        ),
                    );
                    ad.forEach((a, i) => {
                        const c = el(
                            "div",
                            "border-l border-line p-1 flex flex-col gap-1 min-w-0",
                        );
                        a.forEach((e) => {
                            const m = sty(e),
                                p = el(
                                    "div",
                                    "truncate rounded-md px-2 py-1 text-xs lg:text-sm font-semibold",
                                    eventDisplayTitle(e),
                                );
                            p.style.background = m.c;
                            p.style.color = INK;
                            const eventTag = tag(p, e);
                            activateEventNode(eventTag, e);
                            c.append(eventTag);
                        });
                        c.onclick = () => openSheet(keys[i]);
                        ar.append(c);
                    });
                    head.append(ar);
                }
                tg.append(head);
                if (tg.clientHeight > 0) {
                    const bottomPadding =
                        parseFloat(getComputedStyle(tg).paddingBottom) || 0;
                    const available =
                        tg.clientHeight - head.offsetHeight - bottomPadding;
                    const nh = compactWeek
                        ? Math.max(24, Math.floor(available / (hourEnd - hourStart)))
                        : Math.max(56, Math.round(tg.clientHeight / 9.5));
                    if (nh !== H) {
                        H = nh;
                        needScroll = true;
                    }
                }
                const body = el("div", "grid relative");
                body.style.cssText =
                    cols + ";height:" + (hourEnd - hourStart) * H + "px;z-index:0";
                const gut = el("div", "relative");
                for (let h = hourStart; h < hourEnd; h++) {
                    const l = el(
                        "div",
                        "absolute right-1.5 text-[11px] lg:text-xs text-mute",
                        formatTime(new Date(2000, 0, 1, h), {
                            hour: "numeric",
                        }),
                    );
                    l.style.top =
                        Math.max(2, (h - hourStart) * H - 8) + "px";
                    gut.append(l);
                }
                body.append(gut);
                const now = new Date(),
                    nm = now.getHours() * 60 + now.getMinutes();
                keys.forEach((k) => {
                    const c = el(
                        "div",
                        "relative border-l border-line cursor-pointer",
                    );
                    c.style.backgroundImage =
                        "linear-gradient(to bottom,var(--line) 1px,transparent 1px)";
                    c.style.backgroundSize = "100% " + H + "px";
                    layoutDay(ev.filter((e) => on(e, k))).forEach((i) => {
                        const e = i.e,
                            m = sty(e),
                            displayStart = Math.max(i.s, rangeStart),
                            displayEnd = Math.min(i.f, rangeEnd);
                        if (displayEnd <= displayStart) return;
                        const duration = displayEnd - displayStart,
                            h = (duration / 60) * H - 3;
                        const p = el(
                            "div",
                            "absolute rounded-lg px-2 py-1 overflow-hidden",
                        );
                        const overlay =
                                i.n > 1 && !i.primary && !i.sideBySide,
                            width = i.sideBySide
                                ? 100 / i.peerCount
                                : overlay
                                  ? Math.min(
                                        84,
                                        56 +
                                            28 *
                                                (duration /
                                                    i.primaryDuration),
                                    )
                                  : 100,
                            left = i.sideBySide
                                ? (100 * i.peerIndex) / i.peerCount
                                : overlay
                                  ? 100 - width
                                  : 0,
                            fill = overlay
                                ? `color-mix(in srgb, ${m.c} 84%, var(--card))`
                                : m.c;
                        p.style.cssText =
                            "top:" +
                            (((displayStart - rangeStart) / 60) * H + 1) +
                            "px;height:" +
                            h +
                            "px;left:calc(" +
                            left +
                            "% + 2px);width:calc(" +
                            width +
                            "% - 4px);background:" +
                            m.c +
                            ";background:" +
                            fill +
                            ";color:" +
                            INK +
                            ";border:2px solid var(--card);z-index:" +
                            i.z;
                        if (h >= 52)
                            p.append(
                                el(
                                    "div",
                                    "text-xs lg:text-sm opacity-70 truncate",
                                    trange(e),
                                ),
                                tag(
                                    el(
                                        "div",
                                        "text-sm lg:text-base font-semibold leading-tight line-clamp-2 break-words",
                                        eventDisplayTitle(e),
                                    ),
                                    e,
                                ),
                            );
                        else
                            p.append(
                                tag(
                                    el(
                                        "div",
                                        "text-xs lg:text-sm font-semibold truncate",
                                        tshort(e.tm) + " " + eventDisplayTitle(e),
                                    ),
                                    e,
                                ),
                            );
                        activateEventNode(p, e);
                        c.append(p);
                    });
                    if (
                        k === td &&
                        (!compactWeek || (nm >= rangeStart && nm <= rangeEnd))
                    ) {
                        const n = el(
                            "div",
                            "absolute left-0 right-0 pointer-events-none z-[5]",
                        );
                        n.style.cssText =
                            "top:" +
                            ((nm - rangeStart) / 60) * H +
                            "px;border-top:2px solid var(--accent)";
                        c.append(n);
                    }
                    c.onclick = () => openSheet(k);
                    body.append(c);
                });
                tg.append(body);
                if (needScroll && tg.clientHeight > 0) {
                    tg.scrollTop = compactWeek
                        ? 0
                        : (keys.includes(td) ? Math.max(0, nm / 60 - 1) : 7) * H;
                    needScroll = false;
                } else tg.scrollTop = st;
                requestAnimationFrame(() => {
                    suppressScrollEvents = false;
                });
            }
            function renderEventDetails(event) {
                $("event-detail-title").textContent = event.t || "(no title)";
                const content = $("event-detail-content");
                content.innerHTML = "";
                const addRow = (label, value, valueClass = "") => {
                    const row = el("section", "py-3 border-b border-line last:border-b-0");
                    row.append(
                        el("h3", "text-xs font-semibold uppercase tracking-wide text-mute", label),
                        el("p", "mt-1 text-sm text-ink break-words " + valueClass, value),
                    );
                    content.append(row);
                };
                const when = parse(event.d).toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                });
                addRow("When", when + " · " + (event.tm ? trange(event) : "All day"));
                const calendar = calendarForEvent(event);
                addRow("Calendar", calendar?.name || event.calendarName || sty(event).n);
                if (event.location) addRow("Location", event.location);
                const assignedPeople = peopleForEvent(event);
                if (assignedPeople.length) {
                    const row = el("section", "py-3 border-b border-line last:border-b-0");
                    row.append(el("h3", "text-xs font-semibold uppercase tracking-wide text-mute", "People"));
                    const list = el("div", "mt-2 flex flex-wrap gap-2");
                    assignedPeople.forEach((person) => {
                        const chip = el("div", "inline-flex items-center gap-2 rounded-full border border-line bg-bg py-1 pl-1 pr-3");
                        chip.append(avatarNode(person, 28), el("span", "text-sm", person.name));
                        list.append(chip);
                    });
                    row.append(list);
                    content.append(row);
                } else {
                    addRow("People", eventMemberName(event));
                }
                if (event.notes)
                    addRow("Notes / description", event.notes, "whitespace-pre-wrap");
                if (event.rec) addRow("Repeats", "This is part of a repeating event.");
            }
            function render() {
                const td = iso(new Date()),
                    vis = (e) => {
                        const custom =
                            e.calendarId &&
                            !["event", "reminder", "dinner"].includes(e.calendarId);
                        if (custom && hide["calendar:" + e.calendarId]) return false;
                        if (!custom && K[e.kind] && hide[e.kind]) return false;
                        if (!custom && !K[e.kind] && hide.event) return false;
                        return true;
                    },
                    on = (e, k) => e.d === k && vis(e);
                $("vm").className =
                    "h-9 w-9 grid place-items-center rounded-full " +
                    (view === "month" ? "bg-accent text-on" : "");
                $("vw").className =
                    "h-9 w-9 grid place-items-center rounded-full " +
                    (view === "week" ? "bg-accent text-on" : "");
                $("vl").className =
                    "h-9 w-9 grid place-items-center rounded-full " +
                    (view === "list" ? "bg-accent text-on" : "");
                $("vm").setAttribute("aria-pressed", view === "month");
                $("vw").setAttribute("aria-pressed", view === "week");
                $("vl").setAttribute("aria-pressed", view === "list");
                $("dow").classList.toggle("hidden", view !== "month");
                const g = $("grid");
                g.innerHTML = "";
                g.style.display = view === "month" ? "" : "none";
                $("tg").style.display = view === "week" ? "" : "none";
                $("listview").style.display = view === "list" ? "" : "none";
                if (view === "month") {
                    $("mon").textContent = cur.toLocaleDateString(undefined, {
                        month: "long",
                        year: "numeric",
                    });
                    const first = cur.getDay(),
                        n = new Date(
                            cur.getFullYear(),
                            cur.getMonth() + 1,
                            0,
                        ).getDate(),
                        rows = Math.ceil((first + n) / 7);
                    const rem =
                            parseFloat(
                                getComputedStyle(document.documentElement)
                                    .fontSize,
                            ) || 16,
                        max = Math.max(
                            1,
                            Math.floor(
                                (g.clientHeight / rows - 2.25 * rem) /
                                    (1.875 * rem),
                            ),
                        );
                    g.style.gridTemplateRows =
                        "repeat(" + rows + ",minmax(0,1fr))";
                    g.style.gridTemplateColumns = "repeat(7,minmax(0,1fr))";
                    for (let i = 0; i < first; i++)
                        g.append(el("div", "bg-card"));
                    for (let d = 1; d <= n; d++) {
                        const k = iso(
                            new Date(cur.getFullYear(), cur.getMonth(), d),
                        );
                        g.append(
                            monthCell(
                                k,
                                d,
                                ev.filter((e) => on(e, k)),
                                max,
                                td,
                            ),
                        );
                    }
                    for (let i = first + n; i < rows * 7; i++)
                        g.append(el("div", "bg-card"));
                } else {
                    $("mon").textContent =
                        parse(wstart).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                        }) +
                        (days > 1
                            ? " – " +
                              parse(
                                  addDays(wstart, days - 1),
                              ).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                              })
                            : ", " + parse(wstart).getFullYear());
                    const keys = Array.from({ length: days }, (_, i) =>
                        addDays(wstart, i),
                    );
                    if (view === "week") renderWeek(keys, td, on);
                    else renderList(keys, td, on);
                }
                $("settings").classList.toggle("hidden", !setOpen);
                $("settings").classList.toggle("flex", setOpen);
                if (setOpen) {
                    const db = $("daybtns");
                    db.innerHTML = "";
                    for (let n = 1; n <= 7; n++) {
                        const b = el(
                            "button",
                            "h-11 rounded-lg border text-base font-semibold " +
                                (n === days
                                    ? "bg-accent text-on border-accent"
                                    : "bg-bg border-line"),
                            n,
                        );
                        b.onclick = () => setDays(n);
                        db.append(b);
                    }
                    renderTabs();
                    renderCals();
                    renderTheme();
                    renderTimeFormat();
                    renderWeekHours();
                    renderWakeLockSettings();
                    renderTodaySettings();
                }
                $("sheet").classList.toggle("hidden", !sheet);
                $("sheet").classList.toggle("flex", sheet);
                $("event-detail").classList.toggle("hidden", !detailEvent);
                $("event-detail").classList.toggle("flex", !!detailEvent);
                if (detailEvent) renderEventDetails(detailEvent);
                renderTodayOverlay();
                if (!sheet) return;
                formKind();
                $("sd").textContent = parse(sel).toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                });
                const l = $("list");
                l.innerHTML = "";
                const it = ev
                    .filter((e) => on(e, sel))
                    .sort((a, b) => (a.tm || "").localeCompare(b.tm || ""));
                if (!it.length)
                    l.append(el("p", "text-mute", "Nothing planned."));
                it.forEach((e) => {
                    const m = sty(e),
                        r = el(
                            "div",
                            "flex items-center gap-2.5 py-2 border-b border-line",
                        ),
                        b = el("span", "w-1 self-stretch rounded-sm");
                    b.style.background = m.d;
                    const t = el("div", "flex-1 min-w-0 flex flex-col");
                    const titleButton = el(
                        "button",
                        "w-full text-left truncate text-sm font-semibold",
                        eventDisplayTitle(e),
                    );
                    titleButton.type = "button";
                    const titleTag = tag(titleButton, e);
                    activateEventNode(titleTag, e);
                    t.append(
                        titleTag,
                        el(
                            "small",
                            "text-mute",
                            (e.tm ? trange(e) + " · " : "") +
                                m.n +
                                (e.rec ? " · repeats" : ""),
                        ),
                    );
                    const x = el(
                        "button",
                        "text-mute w-9 h-9 grid place-items-center",
                    );
                    x.innerHTML = ic("trash-2", 18);
                    x.setAttribute("aria-label", "Delete event");
                    x.onclick = async () => {
                        if (
                            e.rec &&
                            !confirm(
                                "This event repeats. Delete the whole series?",
                            )
                        )
                            return;
                        try {
                            if (demo) {
                                local = local.filter((z) => z.url !== e.url);
                                saveLocal();
                            } else
                                await api(
                                    "DELETE",
                                    "/api/events?url=" +
                                        encodeURIComponent(e.url) +
                                        "&etag=" +
                                        encodeURIComponent(e.etag || ""),
                                );
                            await load();
                        } catch (err) {
                            status(err.message);
                        }
                    };
                    r.append(b, t, x);
                    l.append(r);
                });
            }
            // Settings content is rendered on demand so each tab reflects the
            // current state without duplicating controls in the HTML.
            function renderCalendarPage() {
                const main = $("calendar-main-view"),
                    add = $("calendar-add-view"),
                    subviewOpen = calendarFormOpen || personFormOpen,
                    back = $("calendar-add-back");
                main.classList.toggle("hidden", calendarFormOpen);
                add.classList.toggle("hidden", !calendarFormOpen);
                $("stabs").style.display = subviewOpen ? "none" : "";
                $("settings-title").textContent = calendarFormOpen
                    ? "Add calendar"
                    : personFormOpen
                      ? editingPersonId
                          ? "Edit person"
                          : "Add person"
                      : "Settings";
                back.classList.toggle("hidden", !subviewOpen);
                back.classList.toggle("grid", subviewOpen);
                back.setAttribute(
                    "aria-label",
                    personFormOpen ? "Back to people" : "Back to calendars",
                );
                main.setAttribute("aria-hidden", calendarFormOpen);
                add.setAttribute("aria-hidden", !calendarFormOpen);
                main.inert = calendarFormOpen;
                add.inert = !calendarFormOpen;
            }
            function renderTabs() {
                const tb = $("stabs");
                tb.innerHTML = "";
                const tabs = [
                    ["calendars", "Calendars"],
                    ["people", "People"],
                    ["view", "View"],
                    ["today", "Today"],
                    ["appearance", "Appearance"],
                    ["about", "About"],
                ];
                if (demo) tabs.splice(1, 1);
                tabs.forEach(([k, n]) => {
                    const b = el(
                        "button",
                        "-mb-px flex-1 border-b-2 px-2 py-2.5 text-sm font-medium transition-colors " +
                            (k === setTab
                                ? "border-accent text-accent"
                                : "border-transparent text-mute hover:border-line hover:text-ink"),
                        n,
                    );
                    b.setAttribute("role", "tab");
                    b.setAttribute("aria-selected", k === setTab);
                    b.onclick = () => {
                        if (k !== "calendars") calendarFormOpen = false;
                        setTab = k;
                        render();
                    };
                    tb.append(b);
                    $("tab-" + k).style.display =
                        k === setTab && !calendarFormOpen ? "" : "none";
                });
                renderCalendarPage();
            }
            function mkSwitch(on) {
                const b = el(
                    "span",
                    "relative shrink-0 w-12 h-7 rounded-full border border-line block",
                );
                b.style.background = on ? "var(--accent)" : "var(--bg)";
                const k = el(
                    "span",
                    "absolute top-[3px] left-[3px] w-5 h-5 rounded-full transition-transform",
                );
                k.style.background = on ? "var(--on)" : "var(--mute)";
                k.style.transform = on ? "translateX(20px)" : "";
                b.append(k);
                return b;
            }
            function renderCalendarChoices() {
                const colors = $("calendar-colors");
                colors.innerHTML = "";
                Object.entries(CALENDAR_COLORS).forEach(([key, color]) => {
                    const button = el(
                        "button",
                        "flex flex-col items-center gap-1 rounded-lg border p-2 text-[10px] transition-colors " +
                            (key === addCalendarColor
                                ? "border-accent ring-2 ring-accent"
                                : "border-line"),
                        color.label,
                    );
                    button.type = "button";
                    button.title = color.label;
                    button.setAttribute("aria-label", color.label + " calendar color");
                    button.setAttribute("aria-pressed", key === addCalendarColor);
                    const swatch = el("span", "h-6 w-6 rounded-full border border-line");
                    swatch.style.background = color.bg;
                    button.prepend(swatch);
                    button.onclick = () => {
                        addCalendarColor = key;
                        renderCalendarChoices();
                    };
                    colors.append(button);
                });

                const icons = $("calendar-icons");
                icons.innerHTML = "";
                Object.entries(CALENDAR_ICON_LABELS).forEach(([key, label]) => {
                    const button = el(
                        "button",
                        "flex flex-col items-center gap-1 rounded-lg border p-2 text-[10px] transition-colors " +
                            (key === addCalendarIcon
                                ? "border-accent ring-2 ring-accent"
                                : "border-line"),
                        label,
                    );
                    button.type = "button";
                    button.title = label;
                    button.setAttribute("aria-label", label + " calendar icon");
                    button.setAttribute("aria-pressed", key === addCalendarIcon);
                    const glyph = el("span", "h-6 w-6 grid place-items-center");
                    glyph.innerHTML = ic(key, 20);
                    button.prepend(glyph);
                    button.onclick = () => {
                        addCalendarIcon = key;
                        renderCalendarChoices();
                    };
                    icons.append(button);
                });
            }
            function renderPersonCalendarChoices() {
                const choices = $("person-calendar-choices");
                choices.innerHTML = "";
                const eventCalendars = calendarConfigs.filter(
                    (calendar) => calendar.type === "event",
                );
                if (!eventCalendars.length) {
                    choices.append(
                        el("p", "text-xs text-mute", "No event calendars are configured."),
                    );
                    return;
                }
                eventCalendars.forEach((calendar) => {
                    const selected = addPersonCalendarIds.has(calendar.id);
                    const row = el(
                        "label",
                        "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer " +
                            (selected ? "border-accent bg-accent/10" : "border-line"),
                    );
                    const checkbox = el("input", "h-4 w-4 accent-accent");
                    checkbox.type = "checkbox";
                    checkbox.checked = selected;
                    checkbox.onchange = () => {
                        if (checkbox.checked) addPersonCalendarIds.add(calendar.id);
                        else addPersonCalendarIds.delete(calendar.id);
                        row.className =
                            "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer " +
                            (checkbox.checked ? "border-accent bg-accent/10" : "border-line");
                    };
                    row.append(checkbox, el("span", "truncate", calendar.name));
                    choices.append(row);
                });
            }
            function renderPersonAvatarChoices() {
                const choices = $("person-avatar-choices");
                choices.innerHTML = "";
                Object.entries({
                    person: "Person",
                    child: "Child",
                    baby: "Baby",
                    bird: "Bird",
                }).forEach(([key, label]) => {
                    const button = el(
                        "button",
                        "h-14 grid place-items-center rounded-lg border " +
                            (addPersonAvatar === key && !addPersonImage
                                ? "border-accent ring-2 ring-accent"
                                : "border-line"),
                    );
                    button.type = "button";
                    button.title = label;
                    button.setAttribute("aria-label", label + " avatar");
                    button.setAttribute(
                        "aria-pressed",
                        addPersonAvatar === key && !addPersonImage,
                    );
                    button.append(avatarNode({ avatar: key, name: label }, 28));
                    button.onclick = () => {
                        addPersonAvatar = key;
                        addPersonImage = null;
                        $("person-image").value = "";
                        renderPersonAvatarChoices();
                        renderPersonPreview();
                    };
                    choices.append(button);
                });
                const birdChoices = $("person-bird-choices");
                birdChoices.innerHTML = "";
                PERSON_BIRD_IMAGES.forEach(({ name, src }) => {
                    const selected = addPersonImage === src;
                    const button = el(
                        "button",
                        "flex flex-col items-center gap-1 rounded-lg border p-1.5 transition-colors " +
                            (selected ? "border-accent ring-2 ring-accent" : "border-line"),
                    );
                    button.type = "button";
                    button.title = name;
                    button.setAttribute("aria-label", name + " avatar");
                    button.setAttribute("aria-pressed", selected);
                    const image = el("img", "h-12 w-12 rounded-full object-cover");
                    image.src = src;
                    image.alt = "";
                    button.append(image);
                    button.onclick = () => {
                        addPersonAvatar = "bird";
                        addPersonImage = src;
                        $("person-image").value = "";
                        renderPersonAvatarChoices();
                        renderPersonPreview();
                    };
                    birdChoices.append(button);
                });
            }
            function renderPersonPreview() {
                const preview = $("person-avatar-preview");
                preview.innerHTML = "";
                const name = $("person-name").value.trim() || "Preview";
                preview.append(
                    avatarNode(
                        { name, avatar: addPersonAvatar, image: addPersonImage },
                        36,
                    ),
                    el("span", null, "Avatar preview"),
                );

            }
            function openPersonForm(person = null) {
                editingPersonId = person?.id || null;
                personFormOpen = true;
                setTab = "people";
                addPersonAvatar = person?.avatar || "person";
                addPersonImage = person?.image || null;
                addPersonCalendarIds = new Set(person?.calendarIds || []);
                $("person-name").value = person?.name || "";
                $("person-image").value = "";
                $("person-status").textContent = "";
                render();
                $("person-name").focus();
            }
            function renderPeopleAdmin() {
                const section = $("people-admin");
                section.style.display = demo ? "none" : "";
                if (demo) return;
                $("person-main-view").classList.toggle("hidden", personFormOpen);
                $("person-form").classList.toggle("hidden", !personFormOpen);
                const cards = $("person-cards");
                cards.innerHTML = "";
                $("person-list-status").textContent = "";
                if (!people.length)
                    cards.append(
                        el(
                            "p",
                            "text-xs text-mute py-1",
                            "No people yet. Add someone to assign events to them.",
                        ),
                    );
                people.forEach((person) => {
                    const row = el(
                        "div",
                        "flex items-center gap-3 border-b border-line py-2 last:border-b-0",
                    );
                    const linkedCalendars = (person.calendarIds || [])
                        .map((id) => calendarConfigs.find((calendar) => calendar.id === id))
                        .filter((calendar) => calendar?.type === "event");
                    const identity = el("div", "flex-1 min-w-0 flex flex-col");
                    identity.append(
                        el("span", "truncate text-sm font-medium", person.name),
                        el(
                            "span",
                            "truncate text-xs text-mute",
                            linkedCalendars.length
                                ? linkedCalendars.map((calendar) => calendar.name).join(", ")
                                : "No calendars associated",
                        ),
                    );
                    row.append(avatarNode(person, 36), identity);

                    const edit = el(
                        "button",
                        "h-9 w-9 grid place-items-center rounded-lg text-mute hover:bg-bg hover:text-accent",
                    );
                    edit.type = "button";
                    edit.innerHTML = ic("pencil", 16);
                    edit.setAttribute("aria-label", "Edit " + person.name);
                    edit.title = "Edit person";
                    edit.onclick = () => openPersonForm(person);
                    row.append(edit);
                    const remove = el(
                        "button",
                        "h-9 w-9 grid place-items-center rounded-lg text-mute hover:text-rose-600",
                    );
                    remove.type = "button";
                    remove.innerHTML = ic("trash-2", 16);
                    remove.setAttribute("aria-label", "Remove " + person.name);
                    remove.title = "Remove person";
                    remove.onclick = () => removePerson(person);
                    row.append(remove);
                    cards.append(row);
                });
                $("person-add-toggle").classList.toggle("hidden", personFormOpen);
                $("person-add-save").disabled = personSaving;
                $("person-add-cancel").disabled = personSaving;
                $("person-add-save").textContent = personSaving
                    ? "Saving…"
                    : editingPersonId
                      ? "Save changes"
                      : "Save person";
                renderPersonCalendarChoices();
                renderPersonAvatarChoices();
                renderPersonPreview();
            }
            async function encodeAvatar(file) {
                if (!/^image\/(png|jpeg|webp)$/.test(file.type))
                    throw new Error("Choose a PNG, JPEG, or WebP image.");
                if (file.size > 10 * 1024 * 1024)
                    throw new Error("Choose an image smaller than 10 MB.");
                const url = URL.createObjectURL(file);
                try {
                    const image = new Image();
                    await new Promise((resolve, reject) => {
                        image.onload = resolve;
                        image.onerror = () => reject(new Error("Could not read that image."));
                        image.src = url;
                    });
                    const size = 256,
                        scale = Math.max(size / image.naturalWidth, size / image.naturalHeight),
                        width = image.naturalWidth * scale,
                        height = image.naturalHeight * scale,
                        canvas = document.createElement("canvas");
                    canvas.width = size;
                    canvas.height = size;
                    canvas.getContext("2d").drawImage(
                        image,
                        (size - width) / 2,
                        (size - height) / 2,
                        width,
                        height,
                    );
                    return canvas.toDataURL("image/webp", 0.82);
                } finally {
                    URL.revokeObjectURL(url);
                }
            }
            function resetPersonForm() {
                personFormOpen = false;
                personSaving = false;
                editingPersonId = null;
                addPersonAvatar = "person";
                addPersonImage = null;
                addPersonCalendarIds = new Set();
                $("person-name").value = "";
                $("person-image").value = "";
                $("person-status").textContent = "";
            }
            async function savePerson() {
                const name = $("person-name").value.trim();
                if (!name) {
                    $("person-status").textContent = "Enter a name for this person.";
                    return;
                }
                personSaving = true;
                $("person-add-save").disabled = true;
                $("person-add-save").textContent = "Saving…";
                $("person-status").textContent = "";
                try {
                    const result = await api(
                        editingPersonId ? "PUT" : "POST",
                        editingPersonId
                            ? "/api/config/people/" + encodeURIComponent(editingPersonId)
                            : "/api/config/people",
                        {
                            name,
                            avatar: addPersonAvatar,
                            image: addPersonImage,
                            calendarIds: [...addPersonCalendarIds],
                        },
                    );
                    people = result.people;
                    resetPersonForm();
                    syncTitlePeople($("title").value);
                    renderWhoOptions();
                    saveSet();
                    render();
                } catch (error) {
                    personSaving = false;
                    $("person-add-save").disabled = false;
                    $("person-add-cancel").disabled = false;
                    $("person-add-save").textContent = editingPersonId
                        ? "Save changes"
                        : "Save person";
                    $("person-status").textContent = error.message;
                }
            }
            async function removePerson(person) {
                if (!confirm(`Remove ${person.name}? Existing events will keep their saved name.`))
                    return;
                try {
                    const result = await api(
                        "DELETE",
                        "/api/config/people/" + encodeURIComponent(person.id),
                    );
                    people = result.people;
                    selectedPersonIds.delete(person.id);
                    syncTitlePeople($("title").value);
                    renderWhoOptions();
                    saveSet();
                    render();
                } catch (error) {
                    $("person-list-status").textContent = error.message;
                }
            }
            function renderCals() {
                renderCalendarChoices();
                const c = $("cals");
                c.innerHTML = "";
                const fam = M.find((m) => m.on) || M[M.length - 1];
                const addRow = (calendar, custom = false) => {
                    const { id, type, name, color, icon } = calendar;
                    const palette = color && CALENDAR_COLORS[color];
                    const fallback = type === "event" ? fam : K[type];
                    const col = palette
                        ? { c: palette.bg, d: palette.fg }
                        : fallback;
                    const iconName = icon || (type === "event" ? "calendar" : K[type]?.i);
                    const hiddenKey = custom ? "calendar:" + id : type;
                    const label = custom
                        ? name
                        : type === "event"
                          ? (name || "Family") + " calendar"
                          : name || K[type].n;
                    const row = el(
                        "div",
                        "flex items-center gap-2 py-2 w-full cursor-pointer",
                    );
                    const identity = el(
                        "div",
                        "flex flex-1 min-w-0 items-center gap-3",
                    );
                    const glyph = el(
                        "span",
                        "w-9 h-9 rounded-full grid place-items-center shrink-0",
                    );
                    glyph.style.background = col.c;
                    glyph.style.color = col.d;
                    glyph.innerHTML = ic(iconName, 18);
                    identity.append(
                        glyph,
                        el("span", "flex-1 text-sm font-medium", label),
                    );
                    const toggleCalendar = () => {
                        hide[hiddenKey] = !hide[hiddenKey];
                        saveSet();
                        render();
                    };
                    row.onclick = toggleCalendar;
                    if (custom) {
                        const remove = el(
                            "button",
                            "w-9 h-9 grid place-items-center rounded-lg text-mute hover:text-rose-600",
                        );
                        remove.type = "button";
                        remove.innerHTML = ic("trash-2", 16);
                        remove.setAttribute(
                            "aria-label",
                            `Remove ${name} calendar from Covey`,
                        );
                        remove.title = "Remove from Covey";
                        remove.onclick = (event) => {
                            event.stopPropagation();
                            removeCalendar(calendar);
                        };
                        row.append(remove);
                    }
                    const toggle = el("button", "shrink-0");
                    toggle.type = "button";
                    toggle.setAttribute("role", "switch");
                    toggle.setAttribute("aria-checked", !hide[hiddenKey]);
                    toggle.setAttribute("aria-label", label);
                    toggle.append(mkSwitch(!hide[hiddenKey]));
                    toggle.onclick = (event) => {
                        event.stopPropagation();
                        toggleCalendar();
                    };
                    row.prepend(identity);
                    row.append(toggle);
                    c.append(row);
                };
                kinds
                    .filter((type) => type === "event" || K[type])
                    .forEach((type) => {
                        const configured = calendarConfigs.find(
                            (calendar) => calendar.id === type,
                        );
                        addRow({
                            id: type,
                            type,
                            name: configured?.name,
                            color: configured?.color,
                            icon: configured?.icon,
                        });
                    });
                calendarConfigs
                    .filter((calendar) => !["event", "reminder", "dinner"].includes(calendar.id))
                    .forEach((calendar) => addRow(calendar, true));
                $("calendar-add-section").style.display = demo ? "none" : "";
                renderPeopleAdmin();
                renderCalendarPage();
            }
            function renderTheme() {
                const ts = $("textsizes");
                ts.innerHTML = "";
                [
                    ["sm", "Small"],
                    ["md", "Medium"],
                    ["lg", "Large"],
                    ["xl", "X-Large"],
                ].forEach(([k, n]) => {
                    const b = el(
                        "button",
                        "flex-1 h-9 rounded-full text-sm font-semibold " +
                            (k === txt ? "bg-accent text-on" : ""),
                        n,
                    );
                    b.onclick = () => {
                        txt = k;
                        GT.setText(k);
                        saveSet();
                        render();
                    };
                    ts.append(b);
                });
                const md = eff(),
                    tb = $("themes");
                tb.innerHTML = "";
                Object.entries(GT.T).forEach(([k, t]) => {
                    const c = t[md];
                    const b = el(
                        "button",
                        "flex flex-col gap-1.5 rounded-xl border p-2 text-xs font-medium " +
                            (k === pal
                                ? "border-accent ring-2 ring-accent"
                                : "border-line"),
                    );
                    const sw = el(
                        "span",
                        "flex w-full h-8 rounded-lg overflow-hidden border",
                    );
                    sw.style.borderColor = c.line;
                    [c.bg, c.card, c.accent].forEach((x) => {
                        const d = el("span", "flex-1");
                        d.style.background = x;
                        sw.append(d);
                    });
                    b.append(sw, el("span", null, t.n));
                    b.onclick = () => {
                        pal = k;
                        saveSet();
                        paint();
                        render();
                    };
                    tb.append(b);
                });
                $("autosw").setAttribute("aria-checked", auto);
                $("autosw").style.background = auto
                    ? "var(--accent)"
                    : "var(--bg)";
                const kn = $("autoknob");
                kn.style.background = auto ? "var(--on)" : "var(--mute)";
                kn.style.transform = auto ? "translateX(20px)" : "";
                $("autotimes").style.opacity = auto ? "1" : ".5";
                $("dfrom").disabled = $("dto").disabled = !auto;
                if (document.activeElement !== $("dfrom"))
                    $("dfrom").value = dFrom;
                if (document.activeElement !== $("dto")) $("dto").value = dTo;
            }
            function renderTimeFormat() {
                const choices = $("timeformats");
                choices.innerHTML = "";
                [
                    ["device", "Device"],
                    ["12", "12-hour"],
                    ["24", "24-hour"],
                ].forEach(([key, label]) => {
                    const button = el(
                        "button",
                        "flex-1 h-9 rounded-full text-sm font-semibold " +
                            (timeFormat === key ? "bg-accent text-on" : ""),
                        label,
                    );
                    button.type = "button";
                    button.setAttribute("aria-pressed", timeFormat === key);
                    button.onclick = () => {
                        timeFormat = key;
                        saveSet();
                        render();
                        tick();
                    };
                    choices.append(button);
                });
            }
            function renderWeekHours() {
                const choices = $("weekhours");
                choices.innerHTML = "";
                [
                    [false, "Full day"],
                    [true, "Compact"],
                ].forEach(([compact, label]) => {
                    const button = el(
                        "button",
                        "flex-1 h-9 rounded-full text-sm font-semibold " +
                            (compactWeek === compact
                                ? "bg-accent text-on"
                                : ""),
                        label,
                    );
                    button.type = "button";
                    button.setAttribute("aria-pressed", compactWeek === compact);
                    button.onclick = () => {
                        compactWeek = compact;
                        needScroll = true;
                        saveSet();
                        render();
                    };
                    choices.append(button);
                });
            }
            function formKind() {
                if (!kinds.includes(addKind)) addKind = "event";
                const ks = $("kindsel");
                ks.innerHTML = "";
                ks.style.display = kinds.length > 1 ? "" : "none";
                kinds.forEach((k) => {
                    const b = el(
                        "button",
                        "flex-1 h-9 rounded-full text-sm font-semibold " +
                            (k === addKind ? "bg-accent text-on" : ""),
                        {
                            event: "Event",
                            reminder: "Reminder",
                            dinner: "Dinner",
                        }[k],
                    );
                    b.onclick = () => {
                        addKind = k;
                        formKind();
                    };
                    ks.append(b);
                });
                $("title").placeholder = {
                    event: "Add an event",
                    reminder: "Remind us to...",
                    dinner: "What's for dinner?",
                }[addKind];
                const calendarTarget = $("calendar-target");
                const previousCalendarId = calendarTarget.value;
                const eventCalendars = calendarConfigs.filter(
                    (calendar) => calendar.type === "event",
                );
                calendarTarget.innerHTML = "";
                eventCalendars.forEach((calendar) => {
                    const option = el("option", null, calendar.name);
                    option.value = calendar.id;
                    calendarTarget.append(option);
                });
                if (eventCalendars.some((calendar) => calendar.id === previousCalendarId))
                    calendarTarget.value = previousCalendarId;
                $("calendar-target-wrap").classList.toggle(
                    "hidden",
                    addKind !== "event" || eventCalendars.length <= 1,
                );
                const who = addKind === "event" && people.length > 0;
                const timed = addKind === "event";
                $("who-wrap").classList.toggle("hidden", !who);
                $("timewrap").style.display = timed ? "" : "none";
                $("endtimewrap").style.display = timed ? "" : "none";
            }
            // Create an event locally in preview mode or send it to the server,
            // then reload the active range so the new event is rendered normally.
            let adding = false;
            function setAdding(value) {
                const button = $("go");
                adding = value;
                button.disabled = value;
                button.setAttribute("aria-busy", value);
                $("go-label").classList.toggle("hidden", value);
                $("go-progress").classList.toggle("hidden", !value);
                $("go-progress-label").textContent = demo
                    ? "Saving…"
                    : "Saving to iCloud…";
            }
            async function add() {
                const t = $("title").value.trim();
                if (!t || adding) return;
                setAdding(true);
                const b = {
                    t,
                    d: sel,
                    tm: addKind === "event" ? $("time").value : "",
                    te: addKind === "event" ? $("endtime").value : "",
                    kind: addKind,
                };
                if (addKind === "event") {
                    const assignedPeople = personSelectionTouched
                        ? people.filter((person) => selectedPersonIds.has(person.id))
                        : personTitleMatches(t);
                    b.m = assignedPeople[0]?.name || "Family";
                    b.personIds = assignedPeople.map((person) => person.id);
                    if ($("calendar-target").value)
                        b.calendarId = $("calendar-target").value;
                }
                try {
                    if (demo) {
                        const id = String(Date.now() + Math.random());
                        local.push({ ...b, id, url: id, etag: "" });
                        saveLocal();
                    } else await api("POST", "/api/events", b);
                    const hiddenKey = b.calendarId &&
                        !["event", "reminder", "dinner"].includes(b.calendarId)
                        ? "calendar:" + b.calendarId
                        : addKind;
                    if (hide[hiddenKey]) {
                        hide[hiddenKey] = false;
                        saveSet();
                    }
                    $("title").value = "";
                    $("time").value = "";
                    $("endtime").value = "";
                    selectedPersonIds.clear();
                    personSelectionTouched = false;
                    renderWhoOptions();
                    closeSheet();
                    await load();
                } catch (e) {
                    status(e.message);
                } finally {
                    setAdding(false);
                }
            }
            function setCalendarAddStatus(message, error = false) {
                const output = $("calendar-add-status");
                output.textContent = message;
                output.className =
                    "min-h-4 text-xs " + (error ? "text-rose-600" : "text-mute");
            }
            function updateCalendarAddButton() {
                const button = $("calendar-add-save");
                button.disabled =
                    calendarSaving ||
                    !$("calendar-name").value.trim() ||
                    !$("calendar-confirm").checked;
                button.textContent = calendarSaving ? "Checking iCloud…" : "Add calendar";
            }
            async function saveCalendar() {
                const name = $("calendar-name").value.trim();
                if (calendarSaving || !name || !$("calendar-confirm").checked) return;
                calendarSaving = true;
                updateCalendarAddButton();
                setCalendarAddStatus("Checking that the calendar exists in iCloud…");
                try {
                    const config = await api("POST", "/api/config/calendars", {
                        name,
                        color: addCalendarColor,
                        icon: addCalendarIcon,
                        confirmedExisting: true,
                    });
                    calendarConfigs = config.calendars;
                    kinds = config.kinds;
                    hide["calendar:" + config.calendar.id] = false;
                    saveSet();
                    calendarFormOpen = false;
                    $("calendar-name").value = "";
                    $("calendar-confirm").checked = false;
                    setCalendarAddStatus("");
                    updateCalendarAddButton();
                    render();
                    const listStatus = $("calendar-list-status");
                    listStatus.textContent = `Added “${config.calendar.name}”.`;
                    listStatus.className = "min-h-4 text-xs text-mute";
                    $("calendar-add-toggle").focus();
                    load();
                } catch (error) {
                    setCalendarAddStatus(error.message, true);
                } finally {
                    calendarSaving = false;
                    updateCalendarAddButton();
                }
            }
            async function removeCalendar(calendar) {
                if (
                    !confirm(
                        `Remove “${calendar.name}” from Covey? Its calendar and events will remain in iCloud.`,
                    )
                )
                    return;
                const output = $("calendar-list-status");
                output.textContent = `Removing “${calendar.name}”…`;
                output.className = "min-h-4 text-xs text-mute";
                try {
                    const config = await api(
                        "DELETE",
                        "/api/config/calendars/" + encodeURIComponent(calendar.id),
                    );
                    calendarConfigs = config.calendars;
                    kinds = config.kinds;
                    people = config.people || people;
                    addPersonCalendarIds.delete(calendar.id);
                    delete hide["calendar:" + calendar.id];
                    saveSet();
                    output.textContent = `Removed “${calendar.name}” from Covey.`;
                    render();
                    load();
                } catch (error) {
                    output.textContent = error.message;
                    output.className = "min-h-4 text-xs text-rose-600";
                }
            }
            // Wire the static controls from index.html to the state and render
            // functions above, then perform the initial data load.
            $("go").onclick = add;
            $("calendar-add-toggle").onclick = () => {
                calendarFormOpen = true;
                renderCalendarChoices();
                setCalendarAddStatus("");
                render();
                $("calendar-name").focus();
            };
            $("calendar-add-back").onclick = () => {
                if (calendarFormOpen) {
                    calendarFormOpen = false;
                    render();
                    $("calendar-add-toggle").focus();
                } else if (personFormOpen) {
                    personFormOpen = false;
                    render();
                    $("person-add-toggle").focus();
                }
            };
            $("calendar-add-cancel").onclick = () => {
                calendarFormOpen = false;
                $("calendar-name").value = "";
                $("calendar-confirm").checked = false;
                setCalendarAddStatus("");
                updateCalendarAddButton();
                render();
                $("calendar-add-toggle").focus();
            };
            $("calendar-name").oninput = () => {
                setCalendarAddStatus("");
                updateCalendarAddButton();
            };
            $("calendar-confirm").onchange = () => {
                setCalendarAddStatus("");
                updateCalendarAddButton();
            };
            $("calendar-add-save").onclick = saveCalendar;
            updateCalendarAddButton();
            $("person-add-toggle").onclick = () => openPersonForm();
            $("person-add-cancel").onclick = () => {
                resetPersonForm();
                render();
                $("person-add-toggle").focus();
            };
            $("person-add-save").onclick = savePerson;
            $("person-name").oninput = renderPersonPreview;
            $("person-image").onchange = async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                const previousImage = addPersonImage;
                $("person-status").textContent = "Preparing avatar…";
                try {
                    addPersonImage = await encodeAvatar(file);
                    $("person-status").textContent = "";
                    renderPersonAvatarChoices();
                    renderPersonPreview();
                } catch (error) {
                    addPersonImage = previousImage;
                    event.target.value = "";
                    $("person-status").textContent = error.message;
                }
            };
            $("title").oninput = () => {
                syncTitlePeople($("title").value);
            };
            $("title").onkeydown = (e) => {
                if (e.key === "Enter") add();
            };
            $("close").onclick = closeSheet;
            $("sheet").onclick = (e) => {
                if (e.target === $("sheet")) closeSheet();
            };
            $("event-detail-close").onclick = closeEventDetails;
            $("event-detail").onclick = (e) => {
                if (e.target === $("event-detail")) closeEventDetails();
            };
            document.addEventListener("keydown", (e) => {
                if (e.key !== "Escape") return;
                if (todayOverlayOpen) {
                    closeTodayOverlay(true);
                    return;
                }
                if (detailEvent) {
                    closeEventDetails();
                } else if (setOpen) {
                    if (setTab === "calendars" && calendarFormOpen) {
                        calendarFormOpen = false;
                        render();
                        $("calendar-add-toggle").focus();
                    } else if (personFormOpen) {
                        resetPersonForm();
                        render();
                        $("person-add-toggle").focus();
                    } else {
                        setOpen = false;
                        calendarFormOpen = false;
                        render();
                    }
                } else if (sheet) {
                    sheet = false;
                    render();
                }
            });
            $("autosw").onclick = () => {
                auto = !auto;
                ovr = null;
                saveSet();
                paint();
                render();
            };
            $("dfrom").oninput = (e) => {
                if (e.target.value) {
                    dFrom = e.target.value;
                    saveSet();
                    paint();
                }
            };
            $("dto").oninput = (e) => {
                if (e.target.value) {
                    dTo = e.target.value;
                    saveSet();
                    paint();
                }
            };
            $("setbtn").onclick = () => {
                setOpen = true;
                render();
            };
            $("keep-screen-awake").onchange = (event) => {
                keepScreenAwake = event.target.checked;
                saveSet();
                updateScreenWakeLock();
            };
            $("today-enabled").onchange = (event) => {
                todayViewEnabled = event.target.checked;
                saveSet();
                renderTodaySettings();
                if (!todayViewEnabled) closeTodayOverlay(false);
                else checkTodayView();
            };
            $("today-preview").onclick = () => {
                const now = new Date();
                openTodayOverlay(
                    scheduledTodaySlot(now) || (now.getHours() < 12 ? "morning" : "evening"),
                    true,
                );
            };
            $("today-temperature-unit").onchange = (event) => {
                todayTemperatureUnit = event.target.value === "C" ? "C" : "F";
                saveSet();
                renderTodayOverlay(true);
            };
            $("today-weather-enabled").onchange = (event) => {
                todayWeatherEnabled = event.target.checked;
                if (todayWeatherStatus === "loading") {
                    todayWeatherStatus = todayWeather ? "ready" : "idle";
                    todayWeatherRequestDate = todayWeather?.date || "";
                } else if (todayWeatherEnabled && todayWeatherStatus === "error") {
                    todayWeatherStatus = "idle";
                    todayWeatherRequestDate = "";
                }
                saveSet();
                renderTodaySettings();
                renderTodayOverlay(true);
            };
            $("today-weather-location").oninput = () => {
                $("today-weather-location-status").textContent = "";
                renderTodaySettings();
            };
            $("today-weather-location-save").onclick = () => {
                const location = $("today-weather-location").value.trim();
                if (!location) {
                    $("today-weather-location-status").textContent =
                        "Enter a city or postal code first.";
                    return;
                }
                todayWeatherLocation = location;
                todayWeather = null;
                todayWeatherRequestDate = "";
                todayWeatherStatus = "idle";
                todayWeatherMessage = "";
                todayWeatherLastRequestAt = 0;
                saveSet();
                $("today-weather-location-status").textContent =
                    "Weather location saved.";
                renderTodaySettings();
                renderTodayOverlay(true);
            };
            $("sclose").onclick = () => {
                setOpen = false;
                calendarFormOpen = false;
                personFormOpen = false;
                renderCalendarPage();
                render();
            };
            $("settings").onclick = (e) => {
                if (e.target === $("settings")) {
                    setOpen = false;
                    calendarFormOpen = false;
                    personFormOpen = false;
                    renderCalendarPage();
                    render();
                }
            };
            $("addbtn").onclick = () => openSheet(sel);
            $("prev").onclick = () => go(-1);
            $("next").onclick = () => go(1);
            $("todaybtn").onclick = goToNow;
            $("vm").onclick = () => setView("month");
            $("vw").onclick = () => setView("week");
            $("vl").onclick = () => setView("list");
            if (!document.documentElement.requestFullscreen)
                $("fs").classList.add("hidden");
            $("fs").onclick = () => {
                try {
                    (document.fullscreenElement
                        ? document.exitFullscreen()
                        : document.documentElement.requestFullscreen()
                    ).catch(() => {});
                } catch (e) {}
            };
            document.addEventListener("fullscreenchange", () => {
                $("fs").innerHTML = ic(
                    document.fullscreenElement ? "minimize-2" : "maximize-2",
                    18,
                );
            });
            document.addEventListener("visibilitychange", () => {
                if (document.visibilityState === "visible")
                    requestScreenWakeLock();
            });
            addEventListener("resize", render);
            addEventListener("load", render);
            addEventListener("load", requestScreenWakeLock);
            $("tg").addEventListener("scroll", () => {
                if (suppressScrollEvents) return;
                armIdleReset();
            });
            $("listview").addEventListener("scroll", armIdleReset);
            ["pointerdown", "pointermove", "touchstart", "keydown", "wheel"].forEach(
                (evt) =>
                    document.addEventListener(evt, wakeChrome, {
                        passive: true,
                    }),
            );
            wakeChrome();
            setInterval(load, 60000);
            setInterval(tick, 10000);
            document.querySelectorAll("[data-i]").forEach((e) => {
                e.innerHTML = ic(e.dataset.i, +e.dataset.s || 20);
            });
            if (!demo)
                api("GET", "/api/config")
                    .then((c) => {
                        kinds = c.kinds;
                        calendarConfigs = c.calendars || [];
                        people = c.people || [];
                        syncTitlePeople($("title").value);
                        renderWhoOptions();
                        render();
                    })
                    .catch(() => {});
            $("syncbtn").onclick = () => {
                if (syncState === "pending") return;
                syncState = "pending";
                updateSyncBadge();
                load();
            };
            icon();
            tick();
            status("");
            updateSyncBadge();
            render();
            load().finally(hideSplash);
