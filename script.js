// ── Active nav link tracking ──────────────────────────────────────────────

const sections = document.querySelectorAll("[id]");
const navLinks = document.querySelectorAll(".nav-link");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
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

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
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
