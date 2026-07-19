const characterGrid = document.getElementById("characterGrid");
const characterSearch = document.getElementById("characterSearch");
const characterFilters = document.querySelectorAll(".character-filter");
const characterEmpty = document.getElementById("characterEmpty");
const randomCharacterButton = document.getElementById(
    "randomCharacterButton"
);

const characterModal = document.getElementById("characterModal");
const characterModalClose = document.getElementById(
    "characterModalClose"
);
const characterModalPrevious = document.getElementById(
    "characterModalPrevious"
);
const characterModalNext = document.getElementById(
    "characterModalNext"
);

const characterModalImage = document.getElementById(
    "characterModalImage"
);
const characterModalCategory = document.getElementById(
    "characterModalCategory"
);
const characterModalName = document.getElementById(
    "characterModalName"
);
const characterModalSeries = document.getElementById(
    "characterModalSeries"
);
const characterModalDescription = document.getElementById(
    "characterModalDescription"
);
const characterModalYear = document.getElementById(
    "characterModalYear"
);
const characterModalType = document.getElementById(
    "characterModalType"
);
const characterModalStars = document.getElementById(
    "characterModalStars"
);
const characterModalRarity = document.getElementById(
    "characterModalRarity"
);
const characterModalDifficulty = document.getElementById(
    "characterModalDifficulty"
);
const characterModalCounter = document.getElementById(
    "characterModalCounter"
);

let allCharacters = [];
let visibleCharacters = [];
let activeCharacterCategory = "all";
let currentCharacterIndex = 0;

async function loadCharacters() {
    if (!characterGrid) {
        return;
    }

    try {
        const response = await fetch("data/characters.json");

        if (!response.ok) {
            throw new Error(
                `Unable to load character data: ${response.status}`
            );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Character data must be an array.");
        }

        allCharacters = data;
        visibleCharacters = [...allCharacters];

        renderCharacters();
    } catch (error) {
        console.error(error);

        characterGrid.innerHTML = `
            <div class="character-error">
                <span>✦</span>
                <h3>Character archive unavailable</h3>
                <p>
                    Open the website using Live Server or GitHub Pages
                    so the character data can load.
                </p>
            </div>
        `;
    }
}

function renderCharacters() {
    characterGrid.innerHTML = "";

    if (visibleCharacters.length === 0) {
        characterEmpty.classList.add("visible");
        return;
    }

    characterEmpty.classList.remove("visible");

    visibleCharacters.forEach((character, index) => {
        const card = document.createElement("article");

        card.className = "character-card";
        card.tabIndex = 0;

        card.innerHTML = `
            <div class="character-card-image">

                <img
                    src="${escapeCharacterHtml(character.image)}"
                    alt="${escapeCharacterHtml(
                        character.name
                    )} cosplay by Miho"
                    loading="lazy"
                >

                <div class="character-card-light"></div>

                <span class="character-card-sparkle">
                    ✦
                </span>

                <div class="character-card-stars">
                    ${createStars(character.rarity)}
                </div>

            </div>

            <div class="character-card-content">

                <p class="character-card-category">
                    ${escapeCharacterHtml(character.categoryLabel)}
                </p>

                <h3>
                    ${escapeCharacterHtml(character.name)}
                </h3>

                <p class="character-card-series">
                    ${escapeCharacterHtml(character.series)}
                </p>

                <div class="character-card-footer">

                    <span>
                        ${escapeCharacterHtml(character.year)}
                    </span>

                    <button
                        class="character-view-button"
                        type="button"
                    >
                        View Profile
                        <strong>→</strong>
                    </button>

                </div>

            </div>
        `;

        card.addEventListener("click", () => {
            openCharacterModal(index);
        });

        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openCharacterModal(index);
            }
        });

        characterGrid.appendChild(card);
    });
}

function updateCharacterResults() {
    const searchValue = characterSearch.value
        .trim()
        .toLowerCase();

    visibleCharacters = allCharacters.filter((character) => {
        const matchesCategory =
            activeCharacterCategory === "all" ||
            character.category === activeCharacterCategory;

        const matchesSearch =
            character.name.toLowerCase().includes(searchValue) ||
            character.series.toLowerCase().includes(searchValue) ||
            character.categoryLabel
                .toLowerCase()
                .includes(searchValue);

        return matchesCategory && matchesSearch;
    });

    renderCharacters();
}

characterFilters.forEach((button) => {
    button.addEventListener("click", () => {
        characterFilters.forEach((filter) => {
            filter.classList.remove("active");
        });

        button.classList.add("active");

        activeCharacterCategory = button.dataset.filter;

        updateCharacterResults();
    });
});

if (characterSearch) {
    characterSearch.addEventListener("input", updateCharacterResults);
}

if (randomCharacterButton) {
    randomCharacterButton.addEventListener("click", () => {
        const pool =
            visibleCharacters.length > 0
                ? visibleCharacters
                : allCharacters;

        if (pool.length === 0) {
            return;
        }

        visibleCharacters = pool;

        const randomIndex = Math.floor(
            Math.random() * visibleCharacters.length
        );

        openCharacterModal(randomIndex);
    });
}

function openCharacterModal(index) {
    const character = visibleCharacters[index];

    if (!character) {
        return;
    }

    currentCharacterIndex = index;

    updateCharacterModal();

    characterModal.classList.add("active");
    characterModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("character-modal-open");

    window.setTimeout(() => {
        characterModalClose.focus();
    }, 100);
}

function closeCharacterModal() {
    characterModal.classList.remove("active");
    characterModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("character-modal-open");
}

function updateCharacterModal() {
    const character = visibleCharacters[currentCharacterIndex];

    if (!character) {
        return;
    }

    characterModalImage.src = character.image;
    characterModalImage.alt =
        `${character.name} cosplay by Miho`;

    characterModalCategory.textContent =
        character.categoryLabel;

    characterModalName.textContent = character.name;
    characterModalSeries.textContent = character.series;
    characterModalDescription.textContent =
        character.description;

    characterModalYear.textContent = character.year;
    characterModalType.textContent = character.type;
    characterModalStars.textContent =
        createStars(character.rarity);

    characterModalRarity.textContent =
        getRarityLabel(character.rarity);

    characterModalDifficulty.textContent =
        `${character.difficulty} / 5`;

    characterModalCounter.textContent =
        `${currentCharacterIndex + 1} / ${visibleCharacters.length}`;

    const hideArrows = visibleCharacters.length <= 1;

    characterModalPrevious.hidden = hideArrows;
    characterModalNext.hidden = hideArrows;
}

function showPreviousCharacter() {
    currentCharacterIndex =
        (currentCharacterIndex - 1 + visibleCharacters.length) %
        visibleCharacters.length;

    updateCharacterModal();
}

function showNextCharacter() {
    currentCharacterIndex =
        (currentCharacterIndex + 1) %
        visibleCharacters.length;

    updateCharacterModal();
}

function createStars(rarity) {
    const safeRarity = Math.max(
        1,
        Math.min(5, Number(rarity) || 1)
    );

    return "★".repeat(safeRarity) +
        "☆".repeat(5 - safeRarity);
}

function getRarityLabel(rarity) {
    const labels = {
        1: "Common",
        2: "Uncommon",
        3: "Rare",
        4: "Epic",
        5: "Legendary"
    };

    return labels[Number(rarity)] || "Rare";
}

if (characterModalClose) {
    characterModalClose.addEventListener(
        "click",
        closeCharacterModal
    );
}

if (characterModalPrevious) {
    characterModalPrevious.addEventListener(
        "click",
        showPreviousCharacter
    );
}

if (characterModalNext) {
    characterModalNext.addEventListener(
        "click",
        showNextCharacter
    );
}

if (characterModal) {
    characterModal.addEventListener("click", (event) => {
        if (event.target === characterModal) {
            closeCharacterModal();
        }
    });
}

document.addEventListener("keydown", (event) => {
    if (
        !characterModal ||
        !characterModal.classList.contains("active")
    ) {
        return;
    }

    if (event.key === "Escape") {
        closeCharacterModal();
    }

    if (event.key === "ArrowLeft") {
        showPreviousCharacter();
    }

    if (event.key === "ArrowRight") {
        showNextCharacter();
    }
});

function escapeCharacterHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

loadCharacters();