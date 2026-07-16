const galleryContainer = document.getElementById("cosplayGallery");
const galleryFilters = document.querySelectorAll(".gallery-filter");
const galleryEmpty = document.getElementById("galleryEmpty");

const lightbox = document.getElementById("cosplayLightbox");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrevious = document.getElementById("lightboxPrevious");
const lightboxNext = document.getElementById("lightboxNext");

const lightboxImage = document.getElementById("lightboxImage");
const lightboxCategory = document.getElementById("lightboxCategory");
const lightboxCharacter = document.getElementById("lightboxCharacter");
const lightboxSeries = document.getElementById("lightboxSeries");
const lightboxDescription = document.getElementById(
    "lightboxDescription"
);
const lightboxYear = document.getElementById("lightboxYear");
const lightboxType = document.getElementById("lightboxType");
const lightboxCounter = document.getElementById("lightboxCounter");

let allCosplays = [];
let visibleCosplays = [];
let currentCosplayIndex = 0;

async function loadCosplays() {
    try {
        const response = await fetch("data/cosplays.json");

        if (!response.ok) {
            throw new Error(
                `Unable to load cosplay data: ${response.status}`
            );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Cosplay data must be an array.");
        }

        allCosplays = data;
        visibleCosplays = [...allCosplays];

        renderCosplays(visibleCosplays);
    } catch (error) {
        console.error(error);

        galleryContainer.innerHTML = `
            <div class="gallery-error">
                <span>✦</span>
                <h3>Gallery unavailable</h3>
                <p>
                    Please open the website using Live Server so the
                    cosplay data can load correctly.
                </p>
            </div>
        `;
    }
}

function renderCosplays(cosplays) {
    galleryContainer.innerHTML = "";

    if (cosplays.length === 0) {
        galleryEmpty.classList.add("visible");
        return;
    }

    galleryEmpty.classList.remove("visible");

    cosplays.forEach((cosplay, index) => {
        const card = document.createElement("article");

        card.className = cosplay.featured
            ? "cosplay-card cosplay-card-featured"
            : "cosplay-card";

        card.tabIndex = 0;
        card.dataset.index = String(index);

        card.innerHTML = `
            <div class="cosplay-card-image">

                <img
                    src="${escapeHtml(cosplay.image)}"
                    alt="${escapeHtml(cosplay.character)} cosplay by Miho"
                    loading="lazy"
                >

                <div class="cosplay-card-shine"></div>

                <span class="cosplay-card-symbol">
                    ✦
                </span>

                ${
                    cosplay.featured
                        ? `
                            <span class="cosplay-featured-badge">
                                Featured
                            </span>
                        `
                        : ""
                }

            </div>

            <div class="cosplay-card-information">

                <p class="cosplay-card-category">
                    ${escapeHtml(cosplay.categoryLabel)}
                </p>

                <h3>
                    ${escapeHtml(cosplay.character)}
                </h3>

                <p class="cosplay-card-series">
                    ${escapeHtml(cosplay.series)}
                </p>

                <div class="cosplay-card-footer">

                    <span>
                        ${escapeHtml(cosplay.year)}
                    </span>

                    <button
                        class="cosplay-view-button"
                        type="button"
                        aria-label="View ${escapeHtml(
                            cosplay.character
                        )} cosplay"
                    >
                        View Details
                        <strong>→</strong>
                    </button>

                </div>

            </div>
        `;

        card.addEventListener("click", () => {
            openLightbox(index);
        });

        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openLightbox(index);
            }
        });

        galleryContainer.appendChild(card);
    });
}

function filterCosplays(category) {
    if (category === "all") {
        visibleCosplays = [...allCosplays];
    } else {
        visibleCosplays = allCosplays.filter(
            (cosplay) => cosplay.category === category
        );
    }

    renderCosplays(visibleCosplays);
}

galleryFilters.forEach((filterButton) => {
    filterButton.addEventListener("click", () => {
        galleryFilters.forEach((button) => {
            button.classList.remove("active");
        });

        filterButton.classList.add("active");

        const selectedFilter = filterButton.dataset.filter;

        filterCosplays(selectedFilter);
    });
});

function openLightbox(index) {
    if (!visibleCosplays[index]) {
        return;
    }

    currentCosplayIndex = index;

    updateLightbox();

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.classList.add("lightbox-open");

    window.setTimeout(() => {
        lightboxClose.focus();
    }, 100);
}

function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");

    document.body.classList.remove("lightbox-open");
}

function updateLightbox() {
    const cosplay = visibleCosplays[currentCosplayIndex];

    if (!cosplay) {
        return;
    }

    lightboxImage.src = cosplay.image;
    lightboxImage.alt = `${cosplay.character} cosplay by Miho`;

    lightboxCategory.textContent = cosplay.categoryLabel;
    lightboxCharacter.textContent = cosplay.character;
    lightboxSeries.textContent = cosplay.series;
    lightboxDescription.textContent = cosplay.description;
    lightboxYear.textContent = cosplay.year;
    lightboxType.textContent = cosplay.type;

    lightboxCounter.textContent =
        `${currentCosplayIndex + 1} / ${visibleCosplays.length}`;

    const hideNavigation = visibleCosplays.length <= 1;

    lightboxPrevious.hidden = hideNavigation;
    lightboxNext.hidden = hideNavigation;
}

function showPreviousCosplay() {
    currentCosplayIndex =
        (currentCosplayIndex - 1 + visibleCosplays.length) %
        visibleCosplays.length;

    updateLightbox();
}

function showNextCosplay() {
    currentCosplayIndex =
        (currentCosplayIndex + 1) %
        visibleCosplays.length;

    updateLightbox();
}

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrevious.addEventListener("click", showPreviousCosplay);
lightboxNext.addEventListener("click", showNextCosplay);

lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("active")) {
        return;
    }

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowLeft") {
        showPreviousCosplay();
    }

    if (event.key === "ArrowRight") {
        showNextCosplay();
    }
});

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

loadCosplays();