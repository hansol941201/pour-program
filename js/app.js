/* ==========================================================================
   POUR 업무 시스템 - 렌더링 / 라우팅 / 이벤트 로직
   새 섹션을 추가하려면:
     1) data.js 에 MENU_ITEMS 항목 추가
     2) 아래 SECTION_RENDERERS 에 렌더 함수 등록
   ========================================================================== */

const STORAGE_KEY = "pour_todo_items";

const $main = document.getElementById("main");
const $quicknav = document.getElementById("quicknav");
const $search = document.getElementById("global-search");
const $searchResults = document.getElementById("search-results");

/* ---------------------------------------------------------------------------
   Todo 상태 (localStorage 영속)
--------------------------------------------------------------------------- */

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return TODO_SEED.map((t) => ({ ...t }));
}

function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

let todos = loadTodos();

/* ---------------------------------------------------------------------------
   유틸
--------------------------------------------------------------------------- */

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function copyToClipboard(text, btnEl) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      if (!btnEl) return;
      const original = btnEl.textContent;
      btnEl.textContent = "복사됨";
      btnEl.classList.add("copied");
      setTimeout(() => {
        btnEl.textContent = original;
        btnEl.classList.remove("copied");
      }, 1200);
    })
    .catch(() => {});
}
window.copyToClipboard = copyToClipboard;

/* ---------------------------------------------------------------------------
   퀵네비 렌더
--------------------------------------------------------------------------- */

function renderQuickNav(activeId) {
  $quicknav.innerHTML =
    `<a href="#dashboard" class="quicknav-item ${!activeId ? "active" : ""}">
       <span class="icon">🏠</span><span>홈</span>
     </a>` +
    MENU_ITEMS.map(
      (m) => `
      <a href="#${m.id}" class="quicknav-item ${activeId === m.id ? "active" : ""}">
        <span class="icon">${m.icon}</span><span>${m.label}</span>
      </a>`
    ).join("");
}

/* ---------------------------------------------------------------------------
   대시보드
--------------------------------------------------------------------------- */

function renderDashboard() {
  const remaining = todos.filter((t) => !t.done).length;

  $main.innerHTML = `
    <div class="dashboard-grid">
      ${MENU_ITEMS.map((m) => {
        const badge = m.id === "todo" && remaining > 0 ? `<span class="badge">${remaining}건 남음</span>` : "";
        return `
        <a class="dash-card" href="#${m.id}">
          <span class="icon">${m.icon}</span>
          <span class="label">${m.label}</span>
          <span class="desc">${m.desc}</span>
          ${badge}
        </a>`;
      }).join("")}
    </div>
  `;
}

/* ---------------------------------------------------------------------------
   섹션 공통 헤더
--------------------------------------------------------------------------- */

function sectionHeader(menu) {
  return `
    <a href="#dashboard" class="back-link">← 홈으로</a>
    <div class="section-title">
      <h1>${menu.icon} ${menu.label}</h1>
      <span class="sub">${menu.desc}</span>
    </div>
  `;
}

/* ---------------------------------------------------------------------------
   섹션별 렌더러
--------------------------------------------------------------------------- */

const SECTION_RENDERERS = {
  todo(menu) {
    const items = todos
      .map(
        (t) => `
      <li class="todo-item ${t.done ? "done" : ""}" data-id="${t.id}">
        <input type="checkbox" ${t.done ? "checked" : ""} data-action="toggle">
        <span class="txt">${escapeHtml(t.text)}</span>
        <button class="del" data-action="delete">삭제</button>
      </li>`
      )
      .join("");

    $main.innerHTML = `
      ${sectionHeader(menu)}
      <div class="panel">
        <form class="todo-add" id="todo-add-form">
          <input type="text" id="todo-input" placeholder="할 일을 입력하고 Enter" autocomplete="off">
          <button type="submit">추가</button>
        </form>
        <ul class="todo-list" id="todo-list">
          ${items || '<li class="todo-empty">오늘 등록된 업무가 없습니다.</li>'}
        </ul>
      </div>
    `;

    document.getElementById("todo-add-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("todo-input");
      const text = input.value.trim();
      if (!text) return;
      todos.push({ id: "t" + Date.now(), text, done: false });
      saveTodos(todos);
      renderRoute();
    });

    document.getElementById("todo-list").addEventListener("click", (e) => {
      const li = e.target.closest(".todo-item");
      if (!li) return;
      const id = li.dataset.id;
      const action = e.target.dataset.action;
      if (action === "toggle") {
        const t = todos.find((t) => t.id === id);
        if (t) t.done = !t.done;
        saveTodos(todos);
        renderRoute();
      } else if (action === "delete") {
        todos = todos.filter((t) => t.id !== id);
        saveTodos(todos);
        renderRoute();
      }
    });
  },

  search(menu) {
    $main.innerHTML = `
      ${sectionHeader(menu)}
      <div class="panel">
        <p style="color:var(--text-sub); font-size:13.5px; margin:0;">
          상단 검색창에 키워드를 입력하면 업무, 문구, 아이디, 링크를 한번에 찾을 수 있습니다.
        </p>
      </div>
    `;
    $search.focus();
  },

  performance(menu) {
    $main.innerHTML = `
      ${sectionHeader(menu)}
      <div class="panel">
        <ol class="step-list">
          ${PERFORMANCE_STEPS.map(
            (s, i) => `
            <li class="step-item">
              <span class="step-num">${i + 1}</span>
              <span class="step-body">
                <div class="step-title">${escapeHtml(s.title)}</div>
                <div class="step-desc">${escapeHtml(s.desc)}</div>
              </span>
            </li>`
          ).join("")}
        </ol>
      </div>
    `;
  },

  mou(menu) {
    $main.innerHTML = `
      ${sectionHeader(menu)}
      <div class="panel">
        <ol class="step-list">
          ${MOU_STEPS.map(
            (s, i) => `
            <li class="step-item">
              <span class="step-num">${i + 1}</span>
              <span class="step-body">
                <div class="step-title">${escapeHtml(s.title)}</div>
                <div class="step-desc">${escapeHtml(s.desc)}</div>
              </span>
            </li>`
          ).join("")}
        </ol>
      </div>
    `;
  },

  platform(menu) {
    $main.innerHTML = `
      ${sectionHeader(menu)}
      <div class="panel">
        ${PLATFORM_ITEMS.map(
          (p) => `
          <div class="copy-card">
            <div class="copy-card-head">
              <span class="copy-card-title">${escapeHtml(p.name)}</span>
              <span class="copy-card-tag">${escapeHtml(p.note)}</span>
            </div>
            <div class="copy-card-body mono">${escapeHtml(p.url)}</div>
            <div style="display:flex; gap:8px;">
              <a class="copy-btn" href="${escapeHtml(p.url)}" target="_blank" rel="noopener">바로가기</a>
              <button class="copy-btn" data-copy="${escapeHtml(p.url)}">주소 복사</button>
            </div>
          </div>`
        ).join("")}
      </div>
    `;
    bindCopyButtons();
  },

  phone(menu) {
    $main.innerHTML = `
      ${sectionHeader(menu)}
      <div class="panel">
        ${PHONE_SCRIPTS.map(
          (s) => `
          <div class="copy-card">
            <div class="copy-card-head">
              <span class="copy-card-title">${escapeHtml(s.title)}</span>
              <span class="copy-card-tag">${escapeHtml(s.tag)}</span>
            </div>
            <div class="copy-card-body">${escapeHtml(s.body)}</div>
            <button class="copy-btn" data-copy="${escapeHtml(s.body)}">문구 복사</button>
          </div>`
        ).join("")}
      </div>
    `;
    bindCopyButtons();
  },

  email(menu) {
    $main.innerHTML = `
      ${sectionHeader(menu)}
      <div class="panel">
        ${EMAIL_TEMPLATES.map(
          (s) => `
          <div class="copy-card">
            <div class="copy-card-head">
              <span class="copy-card-title">${escapeHtml(s.title)}</span>
              <span class="copy-card-tag">${escapeHtml(s.tag)}</span>
            </div>
            <div class="copy-card-body">${escapeHtml(s.body)}</div>
            <button class="copy-btn" data-copy="${escapeHtml(s.body)}">문구 복사</button>
          </div>`
        ).join("")}
      </div>
    `;
    bindCopyButtons();
  },

  account(menu) {
    $main.innerHTML = `
      ${sectionHeader(menu)}
      <div class="panel">
        <div class="table-row head">
          <span>사이트</span><span>아이디</span><span>비고</span><span></span>
        </div>
        ${ACCOUNT_ITEMS.map(
          (a) => `
          <div class="table-row">
            <span>${escapeHtml(a.site)}</span>
            <span class="mono">${escapeHtml(a.id)}</span>
            <span style="color:var(--text-sub);">${escapeHtml(a.note)}</span>
            <button class="copy-btn" data-copy="${escapeHtml(a.id)}">아이디 복사</button>
          </div>`
        ).join("")}
      </div>
    `;
    bindCopyButtons();
  },
};

function bindCopyButtons() {
  $main.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", () => copyToClipboard(btn.dataset.copy, btn));
  });
}

/* ---------------------------------------------------------------------------
   라우팅
--------------------------------------------------------------------------- */

function renderRoute() {
  const id = location.hash.replace("#", "") || "dashboard";

  if (id === "dashboard" || !MENU_ITEMS.some((m) => m.id === id)) {
    renderQuickNav(null);
    renderDashboard();
    return;
  }

  const menu = MENU_ITEMS.find((m) => m.id === id);
  renderQuickNav(id);
  const renderer = SECTION_RENDERERS[id];
  if (renderer) {
    renderer(menu);
  } else {
    $main.innerHTML = `${sectionHeader(menu)}<div class="panel">준비 중입니다.</div>`;
  }
}

window.addEventListener("hashchange", renderRoute);

/* ---------------------------------------------------------------------------
   통합검색
--------------------------------------------------------------------------- */

function buildSearchIndex() {
  const index = [];

  todos.forEach((t) =>
    index.push({ group: "오늘 할 업무", title: t.text, desc: "", href: "#todo" })
  );

  PERFORMANCE_STEPS.forEach((s) =>
    index.push({ group: "실적정리 (월말)", title: s.title, desc: s.desc, href: "#performance" })
  );

  MOU_STEPS.forEach((s) =>
    index.push({ group: "MOU 체결순서", title: s.title, desc: s.desc, href: "#mou" })
  );

  PLATFORM_ITEMS.forEach((p) =>
    index.push({ group: "플랫폼", title: p.name, desc: p.url, href: "#platform" })
  );

  PHONE_SCRIPTS.forEach((s) =>
    index.push({ group: "전화응대", title: s.title, desc: s.body, href: "#phone" })
  );

  EMAIL_TEMPLATES.forEach((s) =>
    index.push({ group: "메일문구", title: s.title, desc: s.body, href: "#email" })
  );

  ACCOUNT_ITEMS.forEach((a) =>
    index.push({ group: "아이디 관리", title: a.site, desc: a.id, href: "#account" })
  );

  return index;
}

function runSearch(query) {
  const q = query.trim().toLowerCase();
  if (!q) {
    $searchResults.classList.add("hidden");
    $searchResults.innerHTML = "";
    return;
  }

  const index = buildSearchIndex();
  const results = index
    .filter(
      (item) =>
        item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)
    )
    .slice(0, 20);

  if (results.length === 0) {
    $searchResults.innerHTML = `<div class="search-result-empty">검색 결과가 없습니다.</div>`;
  } else {
    const grouped = {};
    results.forEach((r) => {
      grouped[r.group] = grouped[r.group] || [];
      grouped[r.group].push(r);
    });

    $searchResults.innerHTML = Object.entries(grouped)
      .map(
        ([group, items]) => `
        <div class="search-result-group">${escapeHtml(group)}</div>
        ${items
          .map(
            (r) => `
          <a class="search-result-item" href="${r.href}">
            <span class="search-result-title">${escapeHtml(r.title)}</span>
            <span class="search-result-desc">${escapeHtml(r.desc).slice(0, 40)}</span>
          </a>`
          )
          .join("")}`
      )
      .join("");
  }

  $searchResults.classList.remove("hidden");
}

$search.addEventListener("input", (e) => runSearch(e.target.value));
$search.addEventListener("focus", (e) => {
  if (e.target.value.trim()) $searchResults.classList.remove("hidden");
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-wrap")) {
    $searchResults.classList.add("hidden");
  }
});
$searchResults.addEventListener("click", () => {
  $searchResults.classList.add("hidden");
});

/* ---------------------------------------------------------------------------
   시계
--------------------------------------------------------------------------- */

function tickClock() {
  const now = new Date();
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const pad = (n) => String(n).padStart(2, "0");
  document.getElementById("clock").textContent =
    `${now.getMonth() + 1}월 ${now.getDate()}일 (${days[now.getDay()]}) ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}
tickClock();
setInterval(tickClock, 1000 * 30);

/* ---------------------------------------------------------------------------
   초기 렌더
--------------------------------------------------------------------------- */

renderRoute();
