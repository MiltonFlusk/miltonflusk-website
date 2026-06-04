// Milton Flusk Website - Shared interactions and procedural graphics

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {
        initMobileNav();
        fillDateFields();
        initFadeIns();
        initFormSubmitStates();
        initLiveGraphics();
        initMetricCounters();
        initChatbot();
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

    function initFadeIns() {
        const animatedItems = document.querySelectorAll("section, article, .panel, .metric, .feature-row");

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
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        animatedItems.forEach(function (item) {
            observer.observe(item);
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

    function initLiveGraphics() {
        const canvases = document.querySelectorAll("[data-live-graphic]");

        if (!canvases.length) {
            return;
        }

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        canvases.forEach(function (canvas) {
            const context = canvas.getContext("2d");
            const type = canvas.dataset.liveGraphic || "field";
            const palette = getPalette();
            const state = createGraphicState(type);

            function resize() {
                const rect = canvas.getBoundingClientRect();
                const scale = Math.min(window.devicePixelRatio || 1, 2);
                canvas.width = Math.max(1, Math.floor(rect.width * scale));
                canvas.height = Math.max(1, Math.floor(rect.height * scale));
                context.setTransform(scale, 0, 0, scale, 0, 0);
                state.width = rect.width;
                state.height = rect.height;
            }

            resize();
            window.addEventListener("resize", resize);

            let start = performance.now();

            function draw(now) {
                const elapsed = (now - start) / 1000;
                clearCanvas(context, state.width, state.height);

                if (type === "bars") {
                    drawBars(context, state, elapsed, palette);
                } else if (type === "curve") {
                    drawCurve(context, state, elapsed, palette);
                } else if (type === "orbit") {
                    drawOrbit(context, state, elapsed, palette);
                } else if (type === "risk") {
                    drawRiskMap(context, state, elapsed, palette);
                } else {
                    drawField(context, state, elapsed, palette);
                }

                if (!reduceMotion) {
                    requestAnimationFrame(draw);
                }
            }

            requestAnimationFrame(draw);
        });
    }

    function getPalette() {
        return {
            gold: "#c6a15b",
            gold2: "#e0c27a",
            teal: "#64d2c8",
            green: "#7ddf91",
            red: "#f28b82",
            blue: "#8ab4f8",
            text: "rgba(247, 241, 230, 0.72)",
            faint: "rgba(247, 241, 230, 0.08)"
        };
    }

    function createGraphicState(type) {
        const seed = type.split("").reduce(function (sum, char) {
            return sum + char.charCodeAt(0);
        }, 17);

        return {
            width: 300,
            height: 240,
            points: Array.from({ length: 46 }, function (_, index) {
                const a = seeded(seed + index * 11);
                const b = seeded(seed + index * 23);
                return {
                    x: a,
                    y: b,
                    speed: 0.18 + seeded(seed + index * 31) * 0.34,
                    phase: seeded(seed + index * 41) * Math.PI * 2
                };
            })
        };
    }

    function seeded(value) {
        const x = Math.sin(value * 999) * 10000;
        return x - Math.floor(x);
    }

    function clearCanvas(context, width, height) {
        context.clearRect(0, 0, width, height);
        context.fillStyle = "rgba(5, 6, 7, 0.88)";
        context.fillRect(0, 0, width, height);

        context.strokeStyle = "rgba(255,255,255,0.035)";
        context.lineWidth = 1;
        for (let x = 0; x < width; x += 34) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, height);
            context.stroke();
        }
        for (let y = 0; y < height; y += 34) {
            context.beginPath();
            context.moveTo(0, y);
            context.lineTo(width, y);
            context.stroke();
        }
    }

    function drawField(context, state, elapsed, palette) {
        const points = state.points.map(function (point) {
            return {
                x: point.x * state.width + Math.sin(elapsed * point.speed + point.phase) * 18,
                y: point.y * state.height + Math.cos(elapsed * point.speed + point.phase) * 14
            };
        });

        points.forEach(function (point, index) {
            for (let j = index + 1; j < points.length; j += 1) {
                const other = points[j];
                const distance = Math.hypot(point.x - other.x, point.y - other.y);
                if (distance < 105) {
                    context.strokeStyle = `rgba(100, 210, 200, ${0.16 - distance / 760})`;
                    context.beginPath();
                    context.moveTo(point.x, point.y);
                    context.lineTo(other.x, other.y);
                    context.stroke();
                }
            }
        });

        points.forEach(function (point, index) {
            context.fillStyle = index % 5 === 0 ? palette.gold2 : palette.teal;
            context.globalAlpha = 0.68;
            context.beginPath();
            context.arc(point.x, point.y, index % 5 === 0 ? 2.8 : 2, 0, Math.PI * 2);
            context.fill();
        });
        context.globalAlpha = 1;
    }

    function drawBars(context, state, elapsed, palette) {
        const bars = 22;
        const gap = 6;
        const width = (state.width - gap * (bars + 1)) / bars;

        for (let i = 0; i < bars; i += 1) {
            const wave = Math.sin(elapsed * 1.4 + i * 0.55) * 0.5 + 0.5;
            const trend = 0.28 + wave * 0.56 + (i / bars) * 0.12;
            const height = Math.min(state.height - 52, trend * state.height * 0.72);
            const x = gap + i * (width + gap);
            const y = state.height - height - 34;
            context.fillStyle = i % 4 === 0 ? "rgba(198,161,91,0.74)" : "rgba(100,210,200,0.55)";
            context.fillRect(x, y, width, height);
        }

        context.strokeStyle = palette.gold2;
        context.lineWidth = 2;
        context.beginPath();
        for (let x = 0; x < state.width; x += 10) {
            const y = state.height * 0.45 + Math.sin(x * 0.025 + elapsed * 1.8) * 24;
            if (x === 0) context.moveTo(x, y);
            else context.lineTo(x, y);
        }
        context.stroke();
    }

    function drawCurve(context, state, elapsed, palette) {
        const lines = [
            { color: palette.gold2, offset: 0, amp: 34 },
            { color: palette.teal, offset: 1.7, amp: 24 },
            { color: palette.blue, offset: 3.1, amp: 18 }
        ];

        lines.forEach(function (line) {
            context.strokeStyle = line.color;
            context.globalAlpha = 0.74;
            context.lineWidth = 2;
            context.beginPath();
            for (let x = 0; x <= state.width; x += 8) {
                const base = state.height * 0.52;
                const y = base + Math.sin(x * 0.022 + elapsed + line.offset) * line.amp +
                    Math.cos(x * 0.011 + elapsed * 0.8) * 11;
                if (x === 0) context.moveTo(x, y);
                else context.lineTo(x, y);
            }
            context.stroke();
        });

        context.globalAlpha = 1;
        drawAxisLabels(context, state, ["variance", "signal", "residual"], palette);
    }

    function drawOrbit(context, state, elapsed, palette) {
        const cx = state.width / 2;
        const cy = state.height / 2;
        const radius = Math.min(state.width, state.height) * 0.28;

        for (let ring = 1; ring <= 4; ring += 1) {
            context.strokeStyle = `rgba(247,241,230,${0.07 + ring * 0.02})`;
            context.beginPath();
            context.arc(cx, cy, radius * ring / 2.8, 0, Math.PI * 2);
            context.stroke();
        }

        for (let i = 0; i < 9; i += 1) {
            const angle = elapsed * (0.18 + i * 0.018) + i * Math.PI * 0.7;
            const r = radius * (0.55 + (i % 4) * 0.26);
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r * 0.72;
            context.fillStyle = i % 3 === 0 ? palette.gold2 : i % 3 === 1 ? palette.teal : palette.green;
            context.beginPath();
            context.arc(x, y, 4, 0, Math.PI * 2);
            context.fill();
        }
    }

    function drawRiskMap(context, state, elapsed, palette) {
        const cells = 9;
        const size = Math.min((state.width - 34) / cells, (state.height - 56) / cells);
        const startX = (state.width - size * cells) / 2;
        const startY = (state.height - size * cells) / 2;

        for (let row = 0; row < cells; row += 1) {
            for (let col = 0; col < cells; col += 1) {
                const value = Math.sin(row * 0.8 + elapsed) + Math.cos(col * 0.7 - elapsed * 0.7);
                const alpha = 0.16 + Math.abs(value) * 0.18;
                context.fillStyle = value > 0.8 ? `rgba(242,139,130,${alpha})` :
                    value < -0.8 ? `rgba(125,223,145,${alpha})` :
                        `rgba(198,161,91,${alpha * 0.8})`;
                context.fillRect(startX + col * size + 2, startY + row * size + 2, size - 4, size - 4);
            }
        }

        drawAxisLabels(context, state, ["stress", "variance", "liquidity"], palette);
    }

    function drawAxisLabels(context, state, labels, palette) {
        context.fillStyle = palette.text;
        context.font = "12px Inter, Arial, sans-serif";
        labels.forEach(function (label, index) {
            context.fillText(label, 16, 24 + index * 18);
        });
    }

    function initMetricCounters() {
        const metrics = document.querySelectorAll("[data-count]");
        if (!metrics.length) return;

        metrics.forEach(function (metric) {
            const target = Number(metric.dataset.count || "0");
            const suffix = metric.dataset.suffix || "";
            const duration = 900;
            const start = performance.now();

            function tick(now) {
                const progress = Math.min(1, (now - start) / duration);
                const eased = 1 - Math.pow(1 - progress, 3);
                metric.textContent = `${Math.round(target * eased)}${suffix}`;
                if (progress < 1) requestAnimationFrame(tick);
            }

            requestAnimationFrame(tick);
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
                `<p><strong>Assistant:</strong> ${getBotReply(question)}</p>`
            );

            chatbotInput.value = "";
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }

        chatbotSend.addEventListener("click", sendChatbotMessage);
        chatbotInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") sendChatbotMessage();
        });
    }

    function getBotReply(question) {
        const q = question.toLowerCase();

        if (q.includes("trade") || q.includes("trading") || q.includes("index") || q.includes("market")) {
            return "Index Market Lab is education and paper-trading practice only. It does not place trades, provide signals, or connect to a broker.";
        }

        if (q.includes("research") || q.includes("quant") || q.includes("portfolio")) {
            return "The research and portfolio sections cover data engineering, quantitative finance, statistics, risk modelling, and market analysis projects.";
        }

        if (q.includes("risk") || q.includes("disclosure")) {
            return "Trading involves risk of loss. Milton Flusk content is educational and not personalized financial advice.";
        }

        if (q.includes("math") || q.includes("mathematics")) {
            return "Mathematics support covers algebra, functions, calculus, trigonometry, geometry, sequences, and exam preparation.";
        }

        if (q.includes("physics") || q.includes("physical sciences") || q.includes("science")) {
            return "Physical Sciences support includes mechanics, projectile motion, momentum, electricity, circuits, and electrochemistry.";
        }

        if (q.includes("register") || q.includes("registration") || q.includes("sign up")) {
            return "Use the tutoring registration page to share student details, subjects, availability, and academic goals.";
        }

        if (q.includes("email") || q.includes("contact")) {
            return "You can contact Milton Flusk at info@miltonflusk.com for tutoring, research, portfolio, or professional enquiries.";
        }

        return "I can help with tutoring, quantitative research, portfolio work, Market Lab, registration, disclosures, and contact details.";
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
