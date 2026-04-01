// ── Nav & ToC generation ──────────────────────────────────────────────────

/**
 * Scrapes h2/h3/h4 elements from #content-wrap (must have an id) and
 * rebuilds the sidebar nav and the .toc-box from that heading tree.
 *
 * Heading mapping:
 *   h2  →  nav section label  +  top-level ToC entry
 *   h3  →  nav-link           +  nested ToC entry under current h2
 *   h4  →  nav-link sub       +  nested ToC entry under current h3
 */
function buildNavAndToC() {
  const contentWrap = document.getElementById("content-wrap");
  const sidebar = document.getElementById("sidebar");
  const tocBox = document.querySelector(".toc-box");

  if (!contentWrap || !sidebar || !tocBox) return;

  // Collect all headings that have an id, in DOM order
  const headings = [...contentWrap.querySelectorAll("h2[id], h3[id], h4[id]")];

  if (!headings.length) return;

  // ── Build sidebar nav ────────────────────────────────────────────────────

  // Remove all existing nav content after the header
  const sidebarHeader = document.getElementById("sidebar-header");
  while (sidebarHeader.nextSibling) {
    sidebarHeader.nextSibling.remove();
  }

  const navScroll = document.createElement("div");
  navScroll.id = "nav-scroll";

  let currentH2Section = null; // the current .nav-section-label group node

  for (const heading of headings) {
    const level = parseInt(heading.tagName[1]);
    const text = heading.textContent.trim();
    const href = `#${heading.id}`;

    if (level === 2) {
      // Section label (not a link, just a group header)
      const label = document.createElement("div");
      label.className = "nav-section-label";
      label.textContent = text;
      navScroll.appendChild(label);
      currentH2Section = label;
    } else if (level === 3) {
      const a = document.createElement("a");
      a.className = "nav-link";
      a.href = href;
      a.textContent = text;
      navScroll.appendChild(a);
    } else if (level === 4) {
      const a = document.createElement("a");
      a.className = "nav-link sub";
      a.href = href;
      a.textContent = text;
      navScroll.appendChild(a);
    }
  }

  sidebar.appendChild(navScroll);

  // ── Build ToC ────────────────────────────────────────────────────────────

  const tocTitle = tocBox.querySelector(".toc-title");
  // Clear everything except the title
  while (tocTitle.nextSibling) {
    tocTitle.nextSibling.remove();
  }

  const rootOl = document.createElement("ol");

  let currentH2Li = null; // <li> for current h2
  let currentH3Ul = null; // <ul> nested under h2 li
  let currentH3Li = null; // <li> for current h3
  let currentH4Ul = null; // <ul> nested under h3 li

  for (const heading of headings) {
    const level = parseInt(heading.tagName[1]);
    const text = heading.textContent.trim();
    const href = `#${heading.id}`;

    const a = document.createElement("a");
    a.href = href;
    a.textContent = text;

    if (level === 2) {
      currentH2Li = document.createElement("li");
      currentH3Ul = null;
      currentH3Li = null;
      currentH4Ul = null;
      currentH2Li.appendChild(a);
      rootOl.appendChild(currentH2Li);
    } else if (level === 3) {
      if (!currentH2Li) continue;
      if (!currentH3Ul) {
        currentH3Ul = document.createElement("ul");
        currentH2Li.appendChild(currentH3Ul);
      }
      currentH3Li = document.createElement("li");
      currentH4Ul = null;
      currentH3Li.appendChild(a);
      currentH3Ul.appendChild(currentH3Li);
    } else if (level === 4) {
      if (!currentH3Li) continue;
      if (!currentH4Ul) {
        currentH4Ul = document.createElement("ul");
        currentH3Li.appendChild(currentH4Ul);
      }
      const li = document.createElement("li");
      li.appendChild(a);
      currentH4Ul.appendChild(li);
    }
  }

  tocBox.appendChild(rootOl);
}

buildNavAndToC();

// ── Active nav link tracking ──────────────────────────────────────────────
// Runs after generation so it picks up the live nav links.

const sections = document.querySelectorAll("[id]");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Query live — nav is rebuilt on each page load
        const navLinks = document.querySelectorAll(".nav-link");
        navLinks.forEach((l) => l.classList.remove("active"));
        const active = document.querySelector(
          `.nav-link[href="#${entry.target.id}"]`,
        );
        if (active) active.classList.add("active");
      }
    });
  },
  { rootMargin: "-30% 0px -60% 0px" },
);

sections.forEach((s) => observer.observe(s));

// ── Smooth scroll ─────────────────────────────────────────────────────────

document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  e.preventDefault();
  const target = document.querySelector(a.getAttribute("href"));
  if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
});

// ── Sidebar collapse ──────────────────────────────────────────────────────

const sidebar = document.getElementById("sidebar");
const main = document.getElementById("main");
const collapseBtn = document.getElementById("sidebar-collapse-btn");
const COLLAPSED_CLASS = "collapsed";
const STORAGE_KEY = "sidebar-collapsed";

function setSidebarCollapsed(collapsed) {
  if (collapsed) {
    sidebar.classList.add(COLLAPSED_CLASS);
    main.classList.add(COLLAPSED_CLASS);
    collapseBtn.setAttribute("aria-label", "Expand sidebar");
    collapseBtn.setAttribute("title", "Expand sidebar");
  } else {
    sidebar.classList.remove(COLLAPSED_CLASS);
    main.classList.remove(COLLAPSED_CLASS);
    collapseBtn.setAttribute("aria-label", "Collapse sidebar");
    collapseBtn.setAttribute("title", "Collapse sidebar");
  }
  localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
}

collapseBtn.addEventListener("click", () => {
  setSidebarCollapsed(!sidebar.classList.contains(COLLAPSED_CLASS));
});

// Restore preference across page loads
const storedCollapsed = localStorage.getItem(STORAGE_KEY) === "1";
setSidebarCollapsed(storedCollapsed);

// ── Back to top ───────────────────────────────────────────────────────────

const backToTopBtn = document.getElementById("back-to-top-btn");
const SCROLL_THRESHOLD = 300; // px from top before button appears

window.addEventListener(
  "scroll",
  () => {
    backToTopBtn.classList.toggle("visible", window.scrollY > SCROLL_THRESHOLD);
  },
  { passive: true },
);

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
