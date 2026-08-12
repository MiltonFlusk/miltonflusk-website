// Scroll header
window.addEventListener('scroll', () => {
  document.getElementById('site-header').classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile drawer
function toggleDrawer() {
  document.getElementById('mobile-drawer').classList.toggle('open');
  document.getElementById('drawer-overlay').classList.toggle('open');
}

// Contact form
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  btn.innerHTML = `<svg style="width:16px;height:16px;animation:spin 1s linear infinite" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Sending...`;

  // Simulate send delay (replace with your backend call if needed)
  setTimeout(() => {
    document.getElementById('contact-form-wrap').innerHTML = `
      <div class="success-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <h3>Thank You!</h3>
        <p>Your inquiry has been sent. I'll get back to you soon.</p>
        <button class="btn-again" onclick="resetForm()">Send Another</button>
      </div>`;
  }, 1500);
}

function resetForm() {
  document.getElementById('contact-form-wrap').innerHTML = `
    <form id="contact-form" onsubmit="handleSubmit(event)">
      <div class="form-group">
        <label class="form-label" for="name">Your Name</label>
        <input class="form-input" id="name" type="text" required placeholder="John Smith"/>
      </div>
      <div class="form-group">
        <label class="form-label" for="email">Email Address</label>
        <input class="form-input" id="email" type="email" required placeholder="john@example.com"/>
      </div>
      <div class="form-group">
        <label class="form-label" for="message">Tell Us About Your Project</label>
        <textarea class="form-textarea" id="message" rows="4" required placeholder="I'm looking for..."></textarea>
      </div>
      <button type="submit" class="btn-submit" id="submit-btn">
        Send Inquiry
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </button>
    </form>`;
}