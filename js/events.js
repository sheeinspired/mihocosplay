const eventsGrid = document.getElementById("eventsGrid");
const eventsTabs = document.querySelectorAll(".events-tab");
const eventsSearch = document.getElementById("eventsSearch");
const eventsYearFilter = document.getElementById("eventsYearFilter");
const eventsVisibleCount = document.getElementById(
    "eventsVisibleCount"
);
const eventsEmpty = document.getElementById("eventsEmpty");

let allEvents = [];
let activeEventFilter = "all";

async function loadEvents() {
    if (!eventsGrid) {
        return;
    }

    try {
        const response = await fetch("data/events.json");

        if (!response.ok) {
            throw new Error(
                `Unable to load events: ${response.status}`
            );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Events data must be an array.");
        }

        allEvents = data.sort((a, b) => {
            if (b.year !== a.year) {
                return b.year - a.year;
            }

            return a.name.localeCompare(b.name);
        });

        createYearOptions();
        updateEvents();
    } catch (error) {
        console.error(error);

        eventsGrid.innerHTML = `
            <div class="events-error">
                <span>✦</span>
                <h3>Past appearances unavailable</h3>
                <p>
                    Open the website using Live Server or GitHub Pages
                    so the event archive can load.
                </p>
            </div>
        `;
    }
}

function createYearOptions() {
    const years = [...new Set(
        allEvents.map((event) => event.year)
    )].sort((a, b) => b - a);

    years.forEach((year) => {
        const option = document.createElement("option");

        option.value = String(year);
        option.textContent = String(year);

        eventsYearFilter.appendChild(option);
    });
}

function updateEvents() {
    const searchTerm = eventsSearch.value
        .trim()
        .toLowerCase();

    const selectedYear = eventsYearFilter.value;

    const filteredEvents = allEvents.filter((event) => {
        const matchesCategory =
            activeEventFilter === "all" ||
            event.scope === activeEventFilter ||
            event.roles.includes(activeEventFilter);

        const matchesYear =
            selectedYear === "all" ||
            String(event.year) === selectedYear;

        const searchableText = [
            event.name,
            event.location,
            event.roleLabel,
            event.description
        ]
            .join(" ")
            .toLowerCase();

        const matchesSearch =
            searchableText.includes(searchTerm);

        return (
            matchesCategory &&
            matchesYear &&
            matchesSearch
        );
    });

    renderEvents(filteredEvents);
}

function renderEvents(events) {
    eventsGrid.innerHTML = "";

    eventsVisibleCount.textContent = String(events.length);

    if (events.length === 0) {
        eventsEmpty.classList.add("visible");
        return;
    }

    eventsEmpty.classList.remove("visible");

    events.forEach((event) => {
        const card = document.createElement("article");

        card.className = "event-card";

        card.innerHTML = `
            <div class="event-card-top">

                <span class="event-country">
                    ${escapeEventHtml(event.location)}
                </span>

                <span class="event-year">
                    ${escapeEventHtml(event.year)}
                </span>

            </div>

            <div class="event-icon">
                ${escapeEventHtml(event.icon)}
            </div>

            <p class="event-type">
                ${
                    event.scope === "international"
                        ? "International Appearance"
                        : "Philippine Appearance"
                }
            </p>

            <h3>
                ${escapeEventHtml(event.name)}
            </h3>

            <p>
                ${escapeEventHtml(event.description)}
            </p>

            <span class="event-role">
                ${escapeEventHtml(event.roleLabel)}
            </span>
        `;

        eventsGrid.appendChild(card);
    });
}

eventsTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        eventsTabs.forEach((item) => {
            item.classList.remove("active");
        });

        tab.classList.add("active");
        activeEventFilter = tab.dataset.eventFilter;

        updateEvents();
    });
});

if (eventsSearch) {
    eventsSearch.addEventListener("input", updateEvents);
}

if (eventsYearFilter) {
    eventsYearFilter.addEventListener(
        "change",
        updateEvents
    );
}

function escapeEventHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

loadEvents();