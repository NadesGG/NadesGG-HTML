// Shared behavior for guide pages: copy buttons on code blocks and the beta signup form.
(() => {
  for (const btn of document.querySelectorAll(".copy")) {
    btn.addEventListener("click", async () => {
      const pre = btn.closest(".code").querySelector("pre");
      try {
        await navigator.clipboard.writeText(pre.innerText.trim() + "\n");
        btn.textContent = "Copied";
      } catch {
        const range = document.createRange();
        range.selectNodeContents(pre);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        btn.textContent = "Press Ctrl+C";
      }
      setTimeout(() => { btn.textContent = "Copy"; }, 1800);
    });
  }

  // Posts to Formspree with fetch; without JS the form still posts normally.
  for (const form of document.querySelectorAll("form[data-beta]")) {
    const btn = form.querySelector("button");
    const err = form.parentElement.querySelector(".notice.err");
    const done = form.parentElement.querySelector(".notice.ok");
    form.addEventListener("submit", async e => {
      e.preventDefault();
      btn.disabled = true;
      err.hidden = true;
      try {
        const res = await fetch(form.action, {
          method: "POST",
          headers: { "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email.value, source: form.source.value })
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error((data && data.errors && data.errors[0] && data.errors[0].message) || "");
        }
        form.hidden = true;
        done.hidden = false;
      } catch (ex) {
        err.textContent = ex.message || "Couldn't sign you up. Try again or ping us on Discord.";
        err.hidden = false;
      } finally {
        btn.disabled = false;
      }
    });
  }
})();
