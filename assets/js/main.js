/**
 * Bêjing Medya - Main Interactive Engine
 * Supporting 10-Article Centered Slider, 9-Box Collage, Videos, and Bilingual reactivity
 */

let currentSlideIndex = 0;
let sliderAutoTimer = null;
let sliderArticlesList = [];

let currentVisibleCount = 9;
let currentFilterCategory = "all";

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  renderSlider();
  renderAboutSection();
  renderVideos();
  renderCollage();
  renderArticles("all");
  // renderSidebar removed
  initModals();
  initMobileDrawer();
  initScrollTop();

  window.addEventListener("bejing:langChange", () => {
    renderSlider();
    renderAboutSection();
    renderVideos();
    renderCollage();
    currentVisibleCount = 9;
    renderArticles(currentFilterCategory);
    // renderSidebar removed
  });
}

function getArticlesForCurrentLang() {
  const lang = getCurrentLang();
  return BEJING_ARTICLES.filter(a => a.lang === lang);
}

/**
 * 1. Centered 10-Article Carousel Slider
 */
function renderSlider() {
  const stage = document.getElementById("sliderStage");
  const dotsContainer = document.getElementById("sliderDots");
  if (!stage || !dotsContainer) return;

  const lang = getCurrentLang();
  const langArticles = getArticlesForCurrentLang();
  if (langArticles.length === 0) return;

  // Take latest 10 articles
  sliderArticlesList = langArticles.slice(0, 10);
  stage.innerHTML = "";
  dotsContainer.innerHTML = "";
  currentSlideIndex = 0;

  sliderArticlesList.forEach((article, idx) => {
    const cat = BEJING_CATEGORIES[article.categoryId];
    const catName = cat ? cat[lang] : article.categoryName;
    const readTimeStr = article.readTime ? (article.readTime[lang] || article.readTime.tr) : "5 dk okuma";

    // Slide Element
    const slide = document.createElement("div");
    slide.className = "slider-slide" + (idx === 0 ? " active" : "");
    slide.id = "slide-" + idx;

    slide.innerHTML = `
      <img src="${article.featured_image}" alt="${article.title}" class="slider-bg-img" loading="lazy" onerror="this.src='assets/images/logo.jpg'">
      <div class="slider-overlay"></div>
      <div class="slider-content">
        <span class="category-pill" style="margin-bottom: 8px;">${catName}</span>
        <h2 class="slider-title" onclick="window.location.href='article.html?id=${article.id}'">${article.title}</h2>
        <p class="slider-excerpt">${(article.excerpt && article.excerpt.length > 85) ? article.excerpt.substring(0, 85).trim() + '...' : (article.excerpt || '')}</p>
        <div class="slider-meta">
          <span><i class="fa-regular fa-clock"></i> ${article.date}</span>
          <span><i class="fa-regular fa-user"></i> ${article.author}</span>
          <span><i class="fa-solid fa-book-open"></i> ${readTimeStr}</span>
        </div>
        <a href="article.html?id=${article.id}" class="telegram-pill-btn" style="padding: 11px 28px; font-size: 0.95rem;">
          ${t("readMore")} <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>
    `;
    stage.appendChild(slide);

    // Indicator Dot
    const dot = document.createElement("div");
    dot.className = "slider-dot" + (idx === 0 ? " active" : "");
    dot.onclick = () => goToSlide(idx);
    dotsContainer.appendChild(dot);
  });

  startSliderTimer();

  // Pause on hover
  stage.onmouseenter = stopSliderTimer;
  stage.onmouseleave = startSliderTimer;
}

function showSlide(index) {
  const slides = document.querySelectorAll(".slider-slide");
  const dots = document.querySelectorAll(".slider-dot");
  if (slides.length === 0) return;

  if (index >= slides.length) currentSlideIndex = 0;
  else if (index < 0) currentSlideIndex = slides.length - 1;
  else currentSlideIndex = index;

  slides.forEach((s, idx) => {
    if (idx === currentSlideIndex) s.classList.add("active");
    else s.classList.remove("active");
  });

  dots.forEach((d, idx) => {
    if (idx === currentSlideIndex) d.classList.add("active");
    else d.classList.remove("active");
  });
}

function slidePrev() {
  showSlide(currentSlideIndex - 1);
  resetSliderTimer();
}

function slideNext() {
  showSlide(currentSlideIndex + 1);
  resetSliderTimer();
}

function goToSlide(idx) {
  showSlide(idx);
  resetSliderTimer();
}

function startSliderTimer() {
  if (sliderAutoTimer) clearInterval(sliderAutoTimer);
  sliderAutoTimer = setInterval(() => {
    showSlide(currentSlideIndex + 1);
  }, 2000);
}

function stopSliderTimer() {
  if (sliderAutoTimer) clearInterval(sliderAutoTimer);
}

function resetSliderTimer() {
  stopSliderTimer();
  startSliderTimer();
}

/**
 * 2. About Us Section
 */
function renderAboutSection() {
  const textEl = document.getElementById("aboutStripDynamicText");
  if (!textEl) return;

  const lang = getCurrentLang();
  if (lang === "ku") {
    textEl.textContent = "Bêjing Medya; platformeke serbixwe ya raman û medyayê ye ku ramana azad, felsefe û bîra çandî ya jinên ciwan digihîne pêşerojê. Li ser şopa heqîqet û evînê, bi analîzên pênusa keziyan û weşanên vîdeoyî yên heftane, em dibin dengê ronakbîriya jinê.";
  } else {
    textEl.textContent = "Bêjing Medya; genç kadınların özgür düşüncesini, felsefesini ve kültürel hafızasını geleceğe taşıyan bağımsız bir düşünce ve medya platformudur. Hakikatin ve sevginin izinde, örgülerin kalemiyle yazılan analizler ve haftalık video yayınlarıyla kadın aydınlanmasına ses veriyoruz.";
  }
}

/**
 * 3. Video Showcase
 */
function renderVideos() {
  const grid = document.getElementById("videosGrid");
  if (!grid) return;

  const lang = getCurrentLang();
  grid.innerHTML = "";

  const activeLangVideos = BEJING_VIDEOS.filter(v => v.lang === lang);
  const otherVideos = BEJING_VIDEOS.filter(v => v.lang !== lang);
  const displayVideos = [...activeLangVideos, ...otherVideos].slice(0, 6);

  displayVideos.forEach(video => {
    const cat = BEJING_CATEGORIES[video.categoryId];
    const catTitle = cat ? cat[lang] : video.categoryName;

    const card = document.createElement("div");
    card.className = "video-card";
    card.onclick = () => openVideoModal(video.id);

    card.innerHTML = `
      <div class="video-thumb-wrap">
        <img src="${video.thumbnail}" alt="${video.title}" class="video-thumb" loading="lazy" onerror="this.src='${video.image}'">
        <div class="video-play-btn"><i class="fa-solid fa-play"></i></div>
        <div class="video-duration">${video.duration}</div>
      </div>
      <div class="video-card-body" style="text-align: center;">
        <span class="video-card-category">${catTitle}</span>
        <h4 class="video-card-title">${video.title}</h4>
        <div class="video-card-meta" style="justify-content: center;">
          <span><i class="fa-regular fa-clock"></i> ${video.date}</span>
          <span><i class="fa-solid fa-eye"></i> ${video.views}</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

/**
 * 4. 9-Box Collage of Latest Articles Across Categories
 */
function renderCollage() {
  const grid = document.getElementById("collageGrid");
  if (!grid) return;

  const lang = getCurrentLang();
  grid.innerHTML = "";

  const langArticles = getArticlesForCurrentLang();
  
  // Pick latest 9 articles across categories
  const collageArticles = langArticles.slice(0, 9);

  collageArticles.forEach(article => {
    const cat = BEJING_CATEGORIES[article.categoryId];
    const catName = cat ? cat[lang] : article.categoryName;
    const readTimeStr = article.readTime ? (article.readTime[lang] || article.readTime.tr) : "5 dk okuma";

    const card = document.createElement("div");
    card.className = "collage-card";
    card.onclick = () => {
      window.location.href = "article.html?id=" + article.id;
    };

    card.innerHTML = `
      <div class="collage-card-img-wrap">
        <img src="${article.featured_image}" alt="${article.title}" class="collage-card-img" loading="lazy" onerror="this.src='assets/images/logo.jpg'">
        <span class="category-pill" style="position: absolute; top: 12px; left: 12px; z-index: 2;">${catName}</span>
      </div>
      <div class="collage-card-body">
        <h3 class="collage-card-title">${article.title}</h3>
        <div class="collage-card-meta">
          <span><i class="fa-regular fa-clock"></i> ${article.date}</span>
          <span><i class="fa-solid fa-book-open"></i> ${readTimeStr}</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

/**
 * 5. Full Articles Grid & Category Filters
 */
function renderArticles(categoryId = "all", isAppend = false) {
  const grid = document.getElementById("mainArticlesGrid");
  if (!grid) return;

  const lang = getCurrentLang();
  currentFilterCategory = categoryId;

  if (!isAppend) {
    grid.innerHTML = "";
    currentVisibleCount = 9;
  }

  const langArticles = getArticlesForCurrentLang();
  const filtered = categoryId === "all"
    ? langArticles
    : langArticles.filter(a => a.categoryId === categoryId);

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="no-articles" style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--c-text-muted);">
      <i class="fa-regular fa-folder-open" style="font-size: 2.5rem; margin-bottom: 12px; color: var(--c-gold);"></i>
      <p>${t("noResults")}</p>
    </div>`;
    const loadMoreContainer = document.getElementById("loadMoreContainer");
    if (loadMoreContainer) loadMoreContainer.style.display = "none";
    return;
  }

  const visibleSlice = filtered.slice(0, currentVisibleCount);
  grid.innerHTML = "";

  visibleSlice.forEach(article => {
    const cat = BEJING_CATEGORIES[article.categoryId];
    const catName = cat ? cat[lang] : article.categoryName;

    const hasVideo = article.youtube_videos && article.youtube_videos.length > 0;
    const videoBadgeHtml = hasVideo ? `<span class="video-indicator-badge" title="${t('watchVideo')}" style="position: absolute; top: 14px; right: 14px; background: #CC0000; color: #FFF; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3); z-index: 2;"><i class="fa-solid fa-play" style="font-size: 0.75rem; margin-left: 2px;"></i></span>` : "";

    const card = document.createElement("article");
    card.className = "article-card";
    card.innerHTML = `
      <div class="article-card-thumb-wrap" onclick="window.location.href='article.html?id=${article.id}'" style="cursor: pointer; position: relative;">
        <img src="${article.featured_image}" alt="${article.title}" class="article-card-thumb" loading="lazy" onerror="this.src='assets/images/logo.jpg'">
        <span class="category-pill" style="position: absolute; top: 14px; left: 14px; z-index: 2;">${catName}</span>
        ${videoBadgeHtml}
      </div>
      <div class="article-card-body" style="text-align: center;">
        <h3 class="article-card-title" onclick="window.location.href='article.html?id=${article.id}'" style="cursor: pointer;">
          ${article.title}
        </h3>
        <p class="article-card-excerpt" style="text-align: center;">${article.excerpt}</p>
        <div class="article-card-footer" style="justify-content: center; gap: 18px;">
          <span><i class="fa-regular fa-clock"></i> ${article.date}</span>
          <a href="article.html?id=${article.id}" class="read-more-link">
            ${t("readMore")} <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  let loadMoreContainer = document.getElementById("loadMoreContainer");
  if (!loadMoreContainer) {
    loadMoreContainer = document.createElement("div");
    loadMoreContainer.id = "loadMoreContainer";
    loadMoreContainer.style.cssText = "grid-column: 1/-1; text-align: center; margin-top: 36px; margin-bottom: 24px;";
    grid.parentNode.appendChild(loadMoreContainer);
  }

  if (currentVisibleCount < filtered.length) {
    const remaining = filtered.length - currentVisibleCount;
    loadMoreContainer.style.display = "block";
    loadMoreContainer.innerHTML = `
      <button type="button" class="telegram-pill-btn" style="padding: 13px 38px; font-size: 0.96rem; cursor: pointer; border: none; background: var(--c-mahogany); margin: 0 auto;" onclick="loadMoreArticles()">
        <i class="fa-solid fa-rotate-right"></i> <span>${t("loadMore")} (${remaining})</span>
      </button>
    `;
  } else {
    loadMoreContainer.style.display = "none";
  }
}

function loadMoreArticles() {
  currentVisibleCount += 9;
  renderArticles(currentFilterCategory, true);
}

function setCategoryFilter(categoryId, btnElement) {
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
  if (btnElement) btnElement.classList.add("active");
  currentVisibleCount = 9;
  renderArticles(categoryId);
}

/**
 * 6. Sidebar (Centered)
 */
function renderSidebar() {
  const quoteEl = document.getElementById("sidebarQuoteText");
  const authorEl = document.getElementById("sidebarQuoteAuthor");
  const catListEl = document.getElementById("sidebarCategoryList");

  const lang = getCurrentLang();
  const langArticles = getArticlesForCurrentLang();

  if (quoteEl && authorEl && typeof BEJING_QUOTES !== 'undefined' && BEJING_QUOTES.length > 0) {
    const quote = BEJING_QUOTES[0];
    quoteEl.textContent = quote.text[lang] || quote.text.tr;
    authorEl.textContent = quote.author[lang] || quote.author.tr;
  }

  if (catListEl) {
    catListEl.innerHTML = "";
    Object.values(BEJING_CATEGORIES).forEach(cat => {
      const count = langArticles.filter(a => a.categoryId === cat.id).length;
      const item = document.createElement("a");
      item.href = "javascript:void(0)";
      item.className = "sidebar-category-item";
      item.onclick = () => {
        const btn = document.querySelector('.filter-btn[data-category="' + cat.id + '"]');
        setCategoryFilter(cat.id, btn);
        document.getElementById("articlesSection").scrollIntoView({ behavior: "smooth" });
      };

      item.innerHTML = `
        <span><i class="${cat.icon}" style="margin-right: 8px; color: var(--c-gold-dark);"></i>${cat[lang]}</span>
        <span class="cat-count-badge">${count}</span>
      `;
      catListEl.appendChild(item);
    });
  }
}

/**
 * Modals
 */
function initModals() {
  const videoOverlay = document.getElementById("videoModalOverlay");
  const videoCloseBtn = document.getElementById("videoModalClose");
  if (videoCloseBtn && videoOverlay) {
    videoCloseBtn.onclick = () => closeVideoModal();
    videoOverlay.onclick = (e) => {
      if (e.target === videoOverlay) closeVideoModal();
    };
  }

  const searchOverlay = document.getElementById("searchModalOverlay");
  const searchCloseBtn = document.getElementById("searchModalClose");
  const searchTrigger = document.getElementById("searchTriggerBtn");
  const searchInput = document.getElementById("searchModalInput");

  if (searchTrigger && searchOverlay) {
    searchTrigger.onclick = () => {
      searchOverlay.classList.add("active");
      if (searchInput) {
        searchInput.value = "";
        searchInput.focus();
        handleLiveSearch("");
      }
    };
  }

  if (searchCloseBtn && searchOverlay) {
    searchCloseBtn.onclick = () => searchOverlay.classList.remove("active");
    searchOverlay.onclick = (e) => {
      if (e.target === searchOverlay) searchOverlay.classList.remove("active");
    };
  }

  if (searchInput) {
    searchInput.oninput = (e) => handleLiveSearch(e.target.value);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeVideoModal();
      if (searchOverlay) searchOverlay.classList.remove("active");
      closeMobileDrawer();
    }
  });
}

function openVideoModal(videoId) {
  const video = BEJING_VIDEOS.find(v => v.id === videoId);
  if (!video) return;

  const overlay = document.getElementById("videoModalOverlay");
  const frame = document.getElementById("videoIframe");
  const title = document.getElementById("videoModalTitle");
  const desc = document.getElementById("videoModalDesc");

  if (frame) frame.src = video.videoUrl + "?autoplay=1";
  if (title) title.textContent = video.title;
  if (desc) desc.textContent = video.desc;

  if (overlay) overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeVideoModal() {
  const overlay = document.getElementById("videoModalOverlay");
  const frame = document.getElementById("videoIframe");
  if (frame) frame.src = "";
  if (overlay) overlay.classList.remove("active");
  document.body.style.overflow = "";
}

function handleLiveSearch(query) {
  const resultsContainer = document.getElementById("searchResultsList");
  if (!resultsContainer) return;

  const lang = getCurrentLang();
  const q = query.trim().toLowerCase();

  if (!q) {
    resultsContainer.innerHTML = '<p style="text-align: center; color: var(--c-text-muted); padding: 20px;">' + t("searchModalDesc") + '</p>';
    return;
  }

  const matches = BEJING_ARTICLES.filter(a => {
    const title = (a.title || "").toLowerCase();
    const excerpt = (a.excerpt || "").toLowerCase();
    const cat = BEJING_CATEGORIES[a.categoryId] ? BEJING_CATEGORIES[a.categoryId][lang].toLowerCase() : "";
    return title.includes(q) || excerpt.includes(q) || cat.includes(q);
  });

  if (matches.length === 0) {
    resultsContainer.innerHTML = '<p style="text-align: center; color: var(--c-text-muted); padding: 20px;">' + t("noResults") + '</p>';
    return;
  }

  resultsContainer.innerHTML = "";
  matches.slice(0, 15).forEach(m => {
    const cat = BEJING_CATEGORIES[m.categoryId];
    const catName = cat ? cat[lang] : m.categoryName;

    const row = document.createElement("div");
    row.style.cssText = "display: flex; gap: 14px; align-items: center; padding: 12px; border-radius: var(--radius-sm); background: var(--c-bg-surface); cursor: pointer; transition: background 0.2s; margin-bottom: 8px;";
    row.onmouseover = () => row.style.background = "var(--c-gold-subtle)";
    row.onmouseout = () => row.style.background = "var(--c-bg-surface)";
    row.onclick = () => {
      document.getElementById("searchModalOverlay").classList.remove("active");
      window.location.href = 'article.html?id=' + m.id;
    };

    row.innerHTML = `
      <img src="${m.featured_image}" alt="${m.title}" style="width: 68px; height: 52px; object-fit: cover; border-radius: 4px;" onerror="this.src='assets/images/logo.jpg'">
      <div style="flex: 1; text-align: left;">
        <span style="font-size: 0.72rem; color: var(--c-gold-dark); font-weight: 600;">${catName} (${m.lang.toUpperCase()})</span>
        <h5 style="font-family: var(--font-display); font-size: 0.98rem; margin: 2px 0 4px; color: var(--c-text-main);">${m.title}</h5>
        <span style="font-size: 0.76rem; color: var(--c-text-light);">${m.date} · ${m.author}</span>
      </div>
    `;
    resultsContainer.appendChild(row);
  });
}

function initMobileDrawer() {
  const toggleBtn = document.getElementById("mobileMenuToggle");
  const drawer = document.getElementById("mobileDrawer");
  const closeBtn = document.getElementById("drawerCloseBtn");

  if (toggleBtn && drawer) {
    toggleBtn.onclick = () => drawer.classList.add("active");
  }

  if (closeBtn && drawer) {
    closeBtn.onclick = () => drawer.classList.remove("active");
  }
}

function closeMobileDrawer() {
  const drawer = document.getElementById("mobileDrawer");
  if (drawer) drawer.classList.remove("active");
}

function initScrollTop() {
  const btn = document.getElementById("backToTopBtn");
  if (!btn) return;

  btn.onclick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
}
