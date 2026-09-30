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
                const assignedPeople = peopleForEvent(e);
                if (assignedPeople.length) {
                    const facepile = el("span", "inline-flex items-center");
                    facepile.style.position = "absolute";
                    facepile.style.right = "4px";
                    facepile.style.top = "50%";
                    facepile.style.transform = "translateY(-50%)";
                    facepile.title = assignedPeople
                        .map((person) => person.name)
                        .join(", ");
                    facepile.setAttribute("aria-hidden", "true");
                    const visiblePeople = assignedPeople.slice(0, 2);
                    visiblePeople.forEach((person, index) => {
                        const avatar = avatarNode(person, 20);
                        avatar.style.border = "1px solid var(--card)";
                        avatar.style.marginLeft = index ? "-4px" : "0";
                        avatar.title = person.name;
                        facepile.append(avatar);
                    });
                    if (assignedPeople.length > visiblePeople.length) {
                        const overflow = el(
                            "span",
                            "relative inline-grid place-items-center rounded-full bg-card text-ink shrink-0 text-[9px] font-semibold",
                            "+" + (assignedPeople.length - visiblePeople.length),
                        );
                        overflow.style.width = "18px";
                        overflow.style.height = "18px";
                        overflow.style.marginLeft = "-4px";
                        overflow.style.border = "1px solid var(--card)";
                        facepile.append(overflow);
                    }
                    const facepileWidth =
                        visiblePeople.length === 1
                            ? 16
                            : visiblePeople.length * 12 + 4 +
                              (assignedPeople.length > visiblePeople.length ? 14 : 0);
                    n.style.position = "relative";
                    if (n.tagName === "STRONG") n.style.display = "block";
                    n.style.paddingRight = facepileWidth + 8 + "px";
                    n.append(facepile);
                }
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
                initFilt = null,
                timeFormat = "device",
                compactWeek = false;
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
                if (typeof st.filt === "string") initFilt = st.filt;
                else if (
                    Number.isInteger(st.filt) &&
                    M[st.filt]?.on
                )
                    initFilt = "member:" + M[st.filt].n;
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
                addPersonAvatar = "person",
                addPersonImage = null;
            let syncState = "pending",
                lastSyncAt = null;
            let ev = [],
                local = [],
                kinds = ["event", "reminder", "dinner"],
                addKind = "event",
                view = initView || "week",
                filt = initFilt,
                sel = iso(new Date()),
                wstart = home(),
                cur = new Date(),
                sheet = false,
                detailEvent = null,
                detailReturnFocus = null,
                setOpen = false,
                setTab = "calendars";
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
                            filt,
                            timeFormat,
                            compactWeek,
                        }),
                    );
                } catch (e) {}
            };
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
            const personFilterKey = (person) =>
                person.id ? "person:" + person.id : "member:" + person.n;
            const eventMemberName = (event) => {
                const assigned = peopleForEvent(event);
                return assigned.length
                    ? assigned.map((person) => person.name).join(", ")
                    : event.m || "Family";
            };
            const eventFilterKeys = (event) => {
                const assigned = peopleForEvent(event);
                return assigned.length
                    ? assigned.map(personFilterKey)
                    : ["member:" + eventMemberName(event)];
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
                    const p = await Promise.all(
                        months().map((k) =>
                            demo
                                ? local.filter((e) => e.d.startsWith(k))
                                : api("GET", "/api/events?month=" + k),
                        ),
                    );
                    ev = p.flat();
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
                        return (
                            e.kind !== "event" ||
                            filt === null ||
                            eventFilterKeys(e).includes(filt)
                        );
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
                }
                $("sheet").classList.toggle("hidden", !sheet);
                $("sheet").classList.toggle("flex", sheet);
                $("event-detail").classList.toggle("hidden", !detailEvent);
                $("event-detail").classList.toggle("flex", !!detailEvent);
                if (detailEvent) renderEventDetails(detailEvent);
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
                const main = $("calendar-main-view");
                const add = $("calendar-add-view");
                main.classList.toggle("hidden", calendarFormOpen);
                add.classList.toggle("hidden", !calendarFormOpen);
                $("stabs").style.display = calendarFormOpen ? "none" : "";
                $("settings-title").textContent = calendarFormOpen
                    ? "Add calendar"
                    : "Settings";
                const back = $("calendar-add-back");
                back.classList.toggle("hidden", !calendarFormOpen);
                back.classList.toggle("grid", calendarFormOpen);
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
                        "h-16 flex flex-col items-center justify-center gap-1 rounded-lg border " +
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
                    button.append(
                        avatarNode({ avatar: key, name: label }, 28),
                        el("span", "text-[10px] text-mute", label),
                    );
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
            function renderPeopleAdmin() {
                const section = $("people-admin");
                section.style.display = demo ? "none" : "";
                if (demo) return;
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
                    row.append(
                        avatarNode(person, 36),
                        el("span", "flex-1 min-w-0 truncate text-sm font-medium", person.name),
                    );

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
                $("person-form").classList.toggle("hidden", !personFormOpen);
                $("person-add-toggle").classList.toggle("hidden", personFormOpen);
                $("person-add-save").disabled = personSaving;
                $("person-add-cancel").disabled = personSaving;
                $("person-add-save").textContent = personSaving
                    ? "Saving…"
                    : "Save person";
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
                addPersonAvatar = "person";
                addPersonImage = null;
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
                    const result = await api("POST", "/api/config/people", {
                        name,
                        avatar: addPersonAvatar,
                        image: addPersonImage,
                    });
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
                    $("person-add-save").textContent = "Save person";
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
                    if (filt === "person:" + person.id) filt = null;
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
                const filterMembers = [...M.filter((member) => member.on), ...people];
                $("peoplewrap").style.display = filterMembers.length > 1 ? "" : "none";
                const pp = $("people");
                pp.innerHTML = "";
                if (filterMembers.length > 1) {
                    const all = el(
                        "button",
                        "h-9 px-3 rounded-full border text-sm font-semibold " +
                            (filt === null
                                ? "bg-accent text-on border-accent"
                                : "border-line"),
                        "All",
                    );
                    all.setAttribute("aria-pressed", filt === null);
                    all.onclick = () => {
                        filt = null;
                        saveSet();
                        render();
                    };
                    pp.append(all);
                    filterMembers.forEach((member) => {
                        const key = personFilterKey(member),
                            isPerson = !!member.id,
                            button = el(
                                "button",
                                "h-9 px-3 inline-flex items-center gap-1.5 rounded-full border text-sm font-semibold " +
                                    (filt === key
                                        ? "border-accent ring-2 ring-accent"
                                        : "border-line"),
                            );
                        button.setAttribute("aria-pressed", filt === key);
                        if (isPerson) {
                            button.append(
                                avatarNode(member, 22),
                                el("span", null, member.name),
                            );
                        } else {
                            button.textContent = member.n;
                            button.style.background = member.c;
                            button.style.color = INK;
                        }
                        button.onclick = () => {
                            filt = filt === key ? null : key;
                            saveSet();
                            render();
                        };
                        pp.append(button);
                    });
                }
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
                    [true, "8 AM–8 PM"],
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
                calendarFormOpen = false;
                render();
                $("calendar-add-toggle").focus();
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
            $("person-add-toggle").onclick = () => {
                personFormOpen = true;
                setTab = "people";
                $("person-status").textContent = "";
                render();
                $("person-name").focus();
            };
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
                $("person-status").textContent = "Preparing avatar…";
                try {
                    addPersonImage = await encodeAvatar(file);
                    $("person-status").textContent = "";
                    renderPersonAvatarChoices();
                    renderPersonPreview();
                } catch (error) {
                    addPersonImage = null;
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
            addEventListener("resize", render);
            addEventListener("load", render);
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
                        if (
                            filt &&
                            filt.startsWith("person:") &&
                            !people.some((person) => filt === "person:" + person.id)
                        )
                            filt = null;
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
