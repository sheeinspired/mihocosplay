const mediaGrid = document.getElementById("mediaGrid");

const mediaFilters = document.querySelectorAll(
    ".media-filter"
);

const mediaSearch = document.getElementById(
    "mediaSearch"
);

const mediaYearFilter = document.getElementById(
    "mediaYearFilter"
);

const mediaVisibleCount = document.getElementById(
    "mediaVisibleCount"
);

const mediaEmpty = document.getElementById(
    "mediaEmpty"
);

const mediaModal = document.getElementById(
    "mediaModal"
);

const mediaModalOverlay = document.getElementById(
    "mediaModalOverlay"
);

const mediaModalClose = document.getElementById(
    "mediaModalClose"
);

const mediaModalImage = document.getElementById(
    "mediaModalImage"
);

const mediaModalSymbol = document.getElementById(
    "mediaModalSymbol"
);

const mediaModalCategory = document.getElementById(
    "mediaModalCategory"
);

const mediaModalTitle = document.getElementById(
    "mediaModalTitle"
);

const mediaModalPublisher = document.getElementById(
    "mediaModalPublisher"
);

const mediaModalDescription = document.getElementById(
    "mediaModalDescription"
);

const mediaModalYear = document.getElementById(
    "mediaModalYear"
);

const mediaModalType = document.getElementById(
    "mediaModalType"
);

const mediaModalLink = document.getElementById(
    "mediaModalLink"
);

let allMediaFeatures = [];
let activeMediaFilter = "all";

async function loadMediaFeatures() {
    if (!mediaGrid) {
        return;
    }

    try {
        const response = await fetch("data/media.json");

        if (!response.ok) {
            throw new Error(
                `Unable to load media features: ${response.status}`
            );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error(
                "Media data must be an array."
            );
        }

        allMediaFeatures = data.sort((a, b) => {
            if (b.year !== a.year) {
                return b.year - a.year;
            }

            return a.title.localeCompare(b.title);
        });

        createMediaYearOptions();
        updateMediaFeatures();
    } catch (error) {
        console.error(error);

        mediaGrid.innerHTML = `
            <div class="media-error">
                <span>✦</span>

                <h3>
                    Media features unavailable
                </h3>

                <p>
                    Open the website using Live Server or
                    GitHub Pages so the media archive can load.
                </p>
            </div>
        `;
    }
}

function createMediaYearOptions() {
    if (!mediaYearFilter) {
        return;
    }

    const years = [
        ...new Set(
            allMediaFeatures.map(
                (feature) => feature.year
            )
        )
    ].sort((a, b) => b - a);

    years.forEach((year) => {
        const option = document.createElement("option");

        option.value = String(year);
        option.textContent = String(year);

        mediaYearFilter.appendChild(option);
    });
}

function updateMediaFeatures() {
    const searchTerm = mediaSearch
        ? mediaSearch.value.trim().toLowerCase()
        : "";

    const selectedYear = mediaYearFilter
        ? mediaYearFilter.value
        : "all";

    const filteredMedia = allMediaFeatures.filter(
        (feature) => {
            const matchesCategory =
                activeMediaFilter === "all" ||
                feature.type === activeMediaFilter;

            const matchesYear =
                selectedYear === "all" ||
                String(feature.year) === selectedYear;

            const searchableText = [
                feature.title,
                feature.publisher,
                feature.typeLabel,
                feature.description,
                feature.year
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
        }
    );

    renderMediaFeatures(filteredMedia);
}

function renderMediaFeatures(features) {
    mediaGrid.innerHTML = "";

    if (mediaVisibleCount) {
        mediaVisibleCount.textContent = String(
            features.length
        );
    }

    if (features.length === 0) {
        mediaEmpty.classList.add("visible");
        return;
    }

    mediaEmpty.classList.remove("visible");

    features.forEach((feature) => {
        const card = document.createElement("article");

        card.className = "media-card";
        card.tabIndex = 0;

        card.innerHTML = `
            <div class="media-card-visual">

                ${
                    feature.image
                        ? `
                            <img
                                src="${escapeMediaHtml(
                                    feature.image
                                )}"
                                alt="${escapeMediaHtml(
                                    feature.title
                                )}"
                            >
                        `
                        : `
                            <div class="media-card-placeholder">
                                <span>
                                    ${escapeMediaHtml(
                                        feature.symbol
                                    )}
                                </span>
                            </div>
                        `
                }

                <span class="media-card-year">
                    ${escapeMediaHtml(feature.year)}
                </span>

            </div>

            <div class="media-card-content">

                <p class="media-card-type">
                    ${escapeMediaHtml(feature.typeLabel)}
                </p>

                <h3>
                    ${escapeMediaHtml(feature.title)}
                </h3>

                <p class="media-card-publisher">
                    ${escapeMediaHtml(feature.publisher)}
                </p>

                <p class="media-card-description">
                    ${escapeMediaHtml(feature.description)}
                </p>

                <button
                    class="media-card-button"
                    type="button"
                >
                    View Feature
                    <span>→</span>
                </button>

            </div>
        `;

        card.addEventListener("click", () => {
            openMediaModal(feature);
        });

        card.addEventListener("keydown", (event) => {
            if (
                event.key === "Enter" ||
                event.key === " "
            ) {
                event.preventDefault();
                openMediaModal(feature);
            }
        });

        mediaGrid.appendChild(card);
    });
}

function openMediaModal(feature) {
    if (!mediaModal) {
        return;
    }

    mediaModalTitle.textContent = feature.title;
    mediaModalPublisher.textContent = feature.publisher;
    mediaModalCategory.textContent = feature.typeLabel;
    mediaModalDescription.textContent =
        feature.description;
    mediaModalYear.textContent = feature.year;
    mediaModalType.textContent =
        capitalizeMediaText(feature.type);

    mediaModalSymbol.textContent =
        feature.symbol || "M";

    if (feature.image) {
        mediaModalImage.src = feature.image;
        mediaModalImage.alt = feature.title;
        mediaModalImage.classList.add("visible");
    } else {
        mediaModalImage.src = "";
        mediaModalImage.alt = "";
        mediaModalImage.classList.remove("visible");
    }

    if (feature.url) {
        mediaModalLink.href = feature.url;
        mediaModalLink.classList.remove("hidden");
    } else {
        mediaModalLink.href = "#";
        mediaModalLink.classList.add("hidden");
    }

    mediaModal.classList.add("visible");
    mediaModal.setAttribute("aria-hidden", "false");

    document.body.classList.add("media-modal-open");

    mediaModalClose.focus();
}

function closeMediaModal() {
    if (!mediaModal) {
        return;
    }

    mediaModal.classList.remove("visible");
    mediaModal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("media-modal-open");
}

mediaFilters.forEach((filter) => {
    filter.addEventListener("click", () => {
        mediaFilters.forEach((item) => {
            item.classList.remove("active");
        });

        filter.classList.add("active");

        activeMediaFilter =
            filter.dataset.mediaFilter;

        updateMediaFeatures();
    });
});

if (mediaSearch) {
    mediaSearch.addEventListener(
        "input",
        updateMediaFeatures
    );
}

if (mediaYearFilter) {
    mediaYearFilter.addEventListener(
        "change",
        updateMediaFeatures
    );
}

if (mediaModalClose) {
    mediaModalClose.addEventListener(
        "click",
        closeMediaModal
    );
}

if (mediaModalOverlay) {
    mediaModalOverlay.addEventListener(
        "click",
        closeMediaModal
    );
}

document.addEventListener("keydown", (event) => {
    if (
        event.key === "Escape" &&
        mediaModal &&
        mediaModal.classList.contains("visible")
    ) {
        closeMediaModal();
    }
});

function capitalizeMediaText(value) {
    return String(value)
        .charAt(0)
        .toUpperCase() +
        String(value).slice(1);
}

function escapeMediaHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

loadMediaFeatures();