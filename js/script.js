// Milton Flusk Website - Shared JavaScript

document.addEventListener("DOMContentLoaded", function () {
    // Auto-fill date fields if they are empty
    const dateFields = document.querySelectorAll('input[type="date"]');

    dateFields.forEach(function (field) {
        if (!field.value && field.name === "date") {
            const today = new Date().toISOString().split("T")[0];
            field.value = today;
        }
    });

    // Fade-in animation for sections/cards
    const animatedItems = document.querySelectorAll(
        "section, article, .rounded-3xl"
    );

    animatedItems.forEach(function (item) {
        item.classList.add("fade-in");
    });

    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                }
            });
        },
        {
            threshold: 0.1
        }
    );

    animatedItems.forEach(function (item) {
        observer.observe(item);
    });

    // Simple form success support
    const forms = document.querySelectorAll("form");

    forms.forEach(function (form) {
        form.addEventListener("submit", function () {
            const button = form.querySelector('button[type="submit"]');

            if (button) {
                button.innerText = "Submitting...";
                button.disabled = true;
            }
        });
    });
});