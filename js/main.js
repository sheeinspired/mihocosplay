const header = document.querySelector(".site-header");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-link");

const introScreen = document.getElementById("introScreen");
const introEnterButton = document.getElementById("introEnterButton");
const introSkipButton = document.getElementById("introSkipButton");

function updateHeader() {
    if (!header) {
        return;
    }

    if (window.scrollY > 20) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
}

function closeMenu() {
    if (!menuToggle || !navLinks) {
        return;
    }

    menuToggle.classList.remove("active");
    navLinks.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
}

function closeIntro() {
    if (!introScreen) {
        return;
    }

    introScreen.classList.add("hidden");
    document.body.classList.remove("intro-open");

    window.setTimeout(() => {
        introScreen.style.display = "none";
    }, 850);
}

if (introScreen) {
    document.body.classList.add("intro-open");
}

if (introEnterButton) {
    introEnterButton.addEventListener("click", closeIntro);
}

if (introSkipButton) {
    introSkipButton.addEventListener("click", closeIntro);
}

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("active");

        menuToggle.classList.toggle("active", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
}

navItems.forEach((item) => {
    item.addEventListener("click", closeMenu);
});

window.addEventListener("scroll", updateHeader);

window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
        closeMenu();
    }
});

document.addEventListener("keydown", (event) => {
    if (
        event.key === "Escape" &&
        introScreen &&
        !introScreen.classList.contains("hidden")
    ) {
        closeIntro();
    }
});

updateHeader();