const partnershipGrid = document.getElementById(
    "partnershipGrid"
);

const partnershipTabs = document.querySelectorAll(
    ".partnership-tab"
);

const partnershipEmpty = document.getElementById(
    "partnershipEmpty"
);

let allPartnerships = [];
let activePartnershipFilter = "all";

async function loadPartnerships() {
    if (!partnershipGrid) {
        return;
    }

    try {
        const response = await fetch(
            "data/partnerships.json"
        );

        if (!response.ok) {
            throw new Error(
                `Unable to load partnerships: ${response.status}`
            );
        }

        allPartnerships = await response.json();

        renderPartnerships(allPartnerships);
    } catch (error) {
        console.error(error);

        partnershipGrid.innerHTML = `
            <div class="partnership-error">
                <span>✦</span>
                <h3>Partnerships unavailable</h3>
                <p>
                    Open the website through Live Server or
                    GitHub Pages.
                </p>
            </div>
        `;
    }
}

function renderPartnerships(partnerships) {
    partnershipGrid.innerHTML = "";

    if (partnerships.length === 0) {
        partnershipEmpty.classList.add("visible");
        return;
    }

    partnershipEmpty.classList.remove("visible");

    partnerships.forEach((partnership) => {
        const card = document.createElement("article");

        card.className = "partnership-card";

        card.innerHTML = `
            <div class="partnership-symbol">
                ${escapePartnershipHtml(partnership.symbol)}
            </div>

            <div class="partnership-copy">

                <p class="partnership-category">
                    ${escapePartnershipHtml(
                        partnership.categoryLabel
                    )}
                </p>

                <h3>
                    ${escapePartnershipHtml(partnership.name)}
                </h3>

                <p class="partnership-role">
                    ${escapePartnershipHtml(partnership.role)}
                </p>

                ${
                    partnership.year
                        ? `
                            <span class="partnership-year">
                                ${escapePartnershipHtml(
                                    partnership.year
                                )}
                            </span>
                        `
                        : ""
                }

            </div>

            <span class="partnership-sparkle">
                ✦
            </span>
        `;

        partnershipGrid.appendChild(card);
    });
}

partnershipTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        partnershipTabs.forEach((item) => {
            item.classList.remove("active");
        });

        tab.classList.add("active");

        activePartnershipFilter =
            tab.dataset.partnershipFilter;

        const filteredPartnerships =
            activePartnershipFilter === "all"
                ? allPartnerships
                : allPartnerships.filter(
                    (partnership) =>
                        partnership.category ===
                        activePartnershipFilter
                );

        renderPartnerships(filteredPartnerships);
    });
});

function escapePartnershipHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

loadPartnerships();