// Milton Flusk Website - Shared interactions

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        initMobileNav();
        fillDateFields();
        initFormSubmitStates();
    });

    function initMobileNav() {
        const toggle = document.querySelector("[data-mobile-toggle]");
        const links = document.querySelector("[data-nav-links]");

        if (!toggle || !links) {
            return;
        }

        toggle.addEventListener("click", function () {
            const isOpen = links.classList.toggle("open");
            toggle.setAttribute("aria-expanded", String(isOpen));
        });

        links.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                links.classList.remove("open");
                toggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    function fillDateFields() {
        document.querySelectorAll('input[type="date"]').forEach(function (field) {
            if (!field.value && field.name === "date") {
                field.value = new Date().toISOString().split("T")[0];
            }
        });
    }

    function initFormSubmitStates() {
        document.querySelectorAll("form").forEach(function (form) {
            form.addEventListener("submit", function () {
                const button = form.querySelector('button[type="submit"]');

                if (button) {
                    button.dataset.originalText = button.textContent;
                    button.textContent = "Submitting...";
                    button.disabled = true;
                }
            });
        });
    }
})();
