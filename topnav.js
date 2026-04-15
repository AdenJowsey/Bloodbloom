/**
 * topnav.js
 * ---------
 * Defines the site-wide navigation structure and renders the top nav bar.
 *
 * ADDING A PAGE:
 *   - Top-level entry: add an object to NAV_ITEMS with { label, href }
 *   - Dropdown entry:  add { label, children: [{ label, href }, ...] }
 *
 * USAGE:
 *   Include this script in every page. It targets #topnav and renders into it.
 *   Mark the current page by adding data-current-page="<href>" to <body>,
 *   e.g. <body data-current-page="core-rules.html">
 */

const NAV_ITEMS = [
  {
    label: "Core Rules",
    href: "index.html",
  },
  {
    label: "Factions",
    children: [
      { label: "The Ashen Compact",  href: "factions/ashen-compact.html"  },
      { label: "The Gilded Court",   href: "factions/gilded-court.html"   },
      { label: "Ironbound Remnant",  href: "factions/ironbound-remnant.html" },
      { label: "The Pale Tribunal",  href: "factions/pale-tribunal.html"  },
      { label: "Thornwall Freeholds",href: "factions/thornwall-freeholds.html" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Renderer
// ---------------------------------------------------------------------------

function buildTopNav() {
  const nav = document.getElementById("topnav");
  if (!nav) return;

  const currentPage = document.body.dataset.currentPage ?? "";

  const inner = document.createElement("div");
  inner.id = "topnav-inner";

  // ── Wordmark ──
  const wordmark = document.createElement("a");
  wordmark.id = "topnav-wordmark";
  wordmark.href = "index.html";
  wordmark.textContent = "Bloodbloom";
  inner.appendChild(wordmark);

  // ── Links ──
  const links = document.createElement("ul");
  links.id = "topnav-links";

  for (const item of NAV_ITEMS) {
    const li = document.createElement("li");

    if (item.children) {
      // Dropdown
      const isActive = item.children.some((c) => c.href === currentPage);

      const btn = document.createElement("button");
      btn.className = "topnav-dropdown-btn" + (isActive ? " active" : "");
      btn.setAttribute("aria-haspopup", "true");
      btn.setAttribute("aria-expanded", "false");
      btn.innerHTML = `${item.label} <span class="topnav-caret">▾</span>`;

      const dropdown = document.createElement("ul");
      dropdown.className = "topnav-dropdown";

      for (const child of item.children) {
        const childLi = document.createElement("li");
        const a = document.createElement("a");
        a.href = child.href;
        a.textContent = child.label;
        if (child.href === currentPage) a.classList.add("active");
        childLi.appendChild(a);
        dropdown.appendChild(childLi);
      }

      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = li.classList.toggle("open");
        btn.setAttribute("aria-expanded", open);
      });

      li.appendChild(btn);
      li.appendChild(dropdown);

    } else {
      // Plain link
      const a = document.createElement("a");
      a.href = item.href;
      a.textContent = item.label;
      a.className = "topnav-link" + (item.href === currentPage ? " active" : "");
      li.appendChild(a);
    }

    links.appendChild(li);
  }

  inner.appendChild(links);
  nav.appendChild(inner);

  // Close dropdowns when clicking outside
  document.addEventListener("click", () => {
    document.querySelectorAll("#topnav-links li.open").forEach((li) => {
      li.classList.remove("open");
      li.querySelector("[aria-expanded]")?.setAttribute("aria-expanded", "false");
    });
  });
}

buildTopNav();