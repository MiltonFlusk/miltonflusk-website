// Milton Flusk Website - Shared JavaScript

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        fillDateFields();
        initFadeIns();
        initFormSubmitStates();
        initChatbot();
    });

    function fillDateFields() {
        const dateFields = document.querySelectorAll('input[type="date"]');

        dateFields.forEach(function (field) {
            if (!field.value && field.name === "date") {
                field.value = new Date().toISOString().split("T")[0];
            }
        });
    }

    function initFadeIns() {
        const animatedItems = document.querySelectorAll(
            "section, article, .rounded-3xl, .trade-panel"
        );

        if (!animatedItems.length || !("IntersectionObserver" in window)) {
            animatedItems.forEach(function (item) {
                item.classList.add("show");
            });
            return;
        }

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
    }

    function initFormSubmitStates() {
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
    }

    function initChatbot() {
        const chatbotToggle = document.getElementById("chatbotToggle");
        const chatbotBox = document.getElementById("chatbotBox");
        const chatbotInput = document.getElementById("chatbotInput");
        const chatbotSend = document.getElementById("chatbotSend");
        const chatbotMessages = document.getElementById("chatbotMessages");

        if (!chatbotToggle || !chatbotBox || !chatbotInput || !chatbotSend || !chatbotMessages) {
            return;
        }

        chatbotToggle.addEventListener("click", function () {
            chatbotBox.classList.toggle("open");
        });

        function sendChatbotMessage() {
            const question = chatbotInput.value.trim();

            if (!question) return;

            chatbotMessages.insertAdjacentHTML(
                "beforeend",
                `<p><strong>You:</strong> ${escapeHtml(question)}</p>`
            );

            chatbotMessages.insertAdjacentHTML(
                "beforeend",
                `<p><strong>Bot:</strong> ${getBotReply(question)}</p>`
            );

            chatbotInput.value = "";
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }

        chatbotSend.addEventListener("click", sendChatbotMessage);

        chatbotInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                sendChatbotMessage();
            }
        });
    }

    function getBotReply(question) {
        const q = question.toLowerCase();

        if (q.includes("trade") || q.includes("trading") || q.includes("index")) {
            return "Index Market Lab is education and paper-trading practice only. It introduces the market education direction without placing trades or connecting to a broker.";
        }

        if (q.includes("risk") || q.includes("disclosure")) {
            return "Trading involves risk of loss. Milton Flusk content is educational and does not place trades or provide personalized financial advice.";
        }

        if (q.includes("math") || q.includes("mathematics")) {
            return "I offer Mathematics support for algebra, functions, calculus, trigonometry, geometry, sequences and exam preparation.";
        }

        if (q.includes("physics") || q.includes("physical sciences") || q.includes("science")) {
            return "I support Physical Sciences, including mechanics, projectile motion, momentum, work-energy-power, electricity, circuits and electrochemistry.";
        }

        if (q.includes("register") || q.includes("registration") || q.includes("sign up")) {
            return "You can begin by completing the tutoring registration form. It captures student details, subjects, preferred days and academic challenges.";
        }

        if (q.includes("agreement") || q.includes("terms")) {
            return "The tutoring agreement explains expectations around attendance, homework, communication, scheduling and payment arrangements.";
        }

        if (q.includes("portfolio") || q.includes("data")) {
            return "My portfolio includes work in data engineering, quantitative finance, risk modelling, statistics and analytics.";
        }

        if (q.includes("email") || q.includes("contact")) {
            return "You can contact me at info@miltonflusk.com for tutoring, portfolio or professional enquiries.";
        }

        if (q.includes("location") || q.includes("remote")) {
            return "I am based in South Africa and can support learners through remote sessions where suitable.";
        }

        return "Thanks for asking. I can help with questions about tutoring, market education, registration, portfolio work, research direction, availability and contact details.";
    }

    function escapeHtml(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }
})();
