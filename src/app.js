document.addEventListener('DOMContentLoaded', async () => {
  // --- Load Session Files Dynamically ---
  async function loadSessions() {
    const wrapper = document.querySelector('.slides-wrapper');
    if (wrapper.querySelectorAll('.slide-card').length > 0) {
      return; // Skip fetching if slides are already inlined
    }

    const sessions = ['session/session1.html', 'session/session2.html', 'session/session3.html', 'session/session4.html', 'session/session5.html', 'session/session6.html'];
    
    const fetches = sessions.map(file => fetch(file).then(r => {
      if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
      return r.text();
    }));
    
    try {
      const htmlContents = await Promise.all(fetches);
      htmlContents.forEach((html, sessionIndex) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const slideCards = tempDiv.querySelectorAll('.slide-card');
        slideCards.forEach(card => {
          card.classList.add(`session-${sessionIndex + 1}`);
          wrapper.appendChild(card);
        });
      });
    } catch (error) {
      console.error('Error loading session files:', error);
      
      // Render a premium looking CORS warning modal / banner
      const errorDiv = document.createElement('div');
      errorDiv.id = 'cors-warning-overlay';
      errorDiv.style.cssText = `
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(15, 23, 42, 0.95);
        display: flex; justify-content: center; align-items: center;
        z-index: 99999;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #f8fafc;
        padding: 20px;
        box-sizing: border-box;
      `;
      errorDiv.innerHTML = `
        <div style="background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 40px; max-width: 500px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); text-align: center; transform: translateY(0); transition: all 0.3s ease;">
          <div style="background: rgba(239, 68, 68, 0.15); width: 64px; height: 64px; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto 24px;">
            <svg style="width: 32px; height: 32px; fill: #ef4444;" viewBox="0 0 24 24">
              <path d="M12,2L1,21H23L12,2M12,6L19.53,19H4.47L12,6M11,10V14H13V10H11M11,16V18H13V16H11Z"/>
            </svg>
          </div>
          <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 12px; color: #f1f5f9;">슬라이드 데이터를 불러올 수 없습니다</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #94a3b8; margin-bottom: 24px; text-align: left;">
            현재 파일 시스템 프로토콜(<code>file://</code>)을 통해 브라우저로 직접 실행했거나 웹 서버 환경이 구성되지 않아 브라우저 보안 정책(CORS)에 의해 파일 로드가 차단되었습니다.
          </p>
          <div style="background: #0f172a; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: left; font-size: 13px; line-height: 1.5; border: 1px solid #1e293b;">
            <strong style="color: #38bdf8; display: block; margin-bottom: 8px;">해결 방법:</strong>
            1. VS Code가 켜져 있다면, 우측 하단의 <strong style="color: #fb7185;">Go Live</strong> (Live Server) 버튼을 클릭하세요.<br>
            2. 또는 터미널에서 아래 명령어로 로컬 서버를 구동해 실행하세요:<br>
            <code style="background: #1e293b; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-top: 6px; color: #e2e8f0; font-family: monospace;">python -m http.server 8000</code>
          </div>
          <p style="font-size: 11px; color: #64748b; margin-top: 16px;">상세 로그: ${error.message}</p>
        </div>
      `;
      document.body.appendChild(errorDiv);
      throw error; // stop execution
    }
  }

  await loadSessions();

  // --- State Initialization ---
  const state = {
    currentSlide: 0,
    viewMode: 'presentation', // 'presentation' | 'dashboard'
    theme: 'dark',
    isDrawing: false,
    drawerOpen: false,
    timer: {
      secondsLeft: 0,
      intervalId: null,
      isRunning: false
    }
  };

  // --- Element Selectors ---
  const slides = document.querySelectorAll('.slide-card');

  // Inject page numbers into slides dynamically
  slides.forEach((slide, index) => {
    const pageNum = document.createElement('div');
    pageNum.className = 'slide-page-number';
    pageNum.textContent = index + 1;
    slide.appendChild(pageNum);
  });

  const progressBar = document.querySelector('.progress-bar');
  const slideProgressText = document.querySelector('.slide-progress-info');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const toggleViewBtn = document.getElementById('toggle-view');
  const printPdfBtn = document.getElementById('print-pdf');

  const presentationViewport = document.querySelector('.slides-wrapper');
  const dashboardViewport = document.querySelector('.dashboard-viewport');
  const searchInput = document.getElementById('search-slides');
  const cardsGrid = document.querySelector('.cards-grid');

  // Drawer / Presenter Tools
  const toolsToggle = document.getElementById('toggle-tools');
  const toolsDrawer = document.getElementById('tools-drawer');
  const themeToggle = document.getElementById('toggle-theme');
  const drawingToggle = document.getElementById('toggle-drawing');
  const clearDrawingBtn = document.getElementById('clear-drawing');
  const scriptDisplay = document.getElementById('script-display');
  const visualDisplay = document.getElementById('visual-display');

  // Timer Elements
  const timerDisplay = document.querySelector('.timer-display');
  const timerStartBtn = document.getElementById('timer-start');
  const timerResetBtn = document.getElementById('timer-reset');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const flashScreen = document.getElementById('flash-screen');

  // Drawing Canvas
  const drawingCanvas = document.getElementById('drawing-canvas');
  const ctx = drawingCanvas.getContext('2d');
  let isDrawingActive = false;
  let lastX = 0;
  let lastY = 0;

  // --- Dynamic Slide Viewport Scaling ---
  function resizeSlides() {
    const mainViewport = document.querySelector('.main-viewport');
    const wrapper = document.querySelector('.slides-wrapper');
    if (!mainViewport || !wrapper) return;

    if (window.innerWidth <= 768) {
      // Mobile vertical scroll mode: clear dynamic scaling
      wrapper.style.transform = '';
      wrapper.style.width = '';
      wrapper.style.height = '';
      return;
    }

    // Design resolution reference
    const designWidth = 1366;
    const designHeight = 768;

    // Viewport padding (defined in CSS: 15px left/right/top, 85px bottom)
    const paddingX = 30; // 15px * 2
    const paddingY = 100; // 15px + 85px

    const availableWidth = mainViewport.clientWidth - paddingX;
    const availableHeight = mainViewport.clientHeight - paddingY;

    // Calculate scale factor to fit the slides-wrapper within available space
    const scale = Math.min(availableWidth / designWidth, availableHeight / designHeight);

    // Apply explicit sizing and scaling transform
    wrapper.style.width = `${designWidth}px`;
    wrapper.style.height = `${designHeight}px`;
    wrapper.style.transform = `scale(${scale})`;
    wrapper.style.transformOrigin = 'center center';
    wrapper.style.flexShrink = '0';
  }

  // --- Initialize Canvas Resolution ---
  function resizeCanvas() {
    drawingCanvas.width = drawingCanvas.parentElement.clientWidth;
    drawingCanvas.height = drawingCanvas.parentElement.clientHeight;
    // Retain canvas drawings on resize isn't strictly necessary for a simple pointer pen, 
    // but resetting size clears context variables.
    ctx.strokeStyle = '#f72585';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }

  // Combined resize handler
  function handleResize() {
    resizeSlides();
    resizeCanvas();
  }

  window.addEventListener('resize', handleResize);
  // Initial size deferred slightly until slide-cards lay out
  setTimeout(handleResize, 300);

  // --- View Control (Presentation vs Dashboard) ---
  function setViewMode(mode) {
    state.viewMode = mode;
    if (mode === 'presentation') {
      presentationViewport.style.display = 'flex';
      dashboardViewport.style.display = 'none';
      document.querySelector('.navigation-bar').style.display = 'flex';
      toggleViewBtn.classList.remove('active');
      toggleViewBtn.innerHTML = `
        <svg style="width:16px;height:16px;fill:currentColor" viewBox="0 0 24 24">
          <path d="M4,4H20V12H4V4M4,14H11V20H4V14M13,14H20V20H13V14Z" />
        </svg>
        대시보드 <span class="badge">Esc</span>
      `;
      // Close draw mode and drawer when leaving dashboard just to be clean
      handleResize();
    } else {
      presentationViewport.style.display = 'none';
      dashboardViewport.style.display = 'block';
      document.querySelector('.navigation-bar').style.display = 'none';
      toggleViewBtn.classList.add('active');
      toggleViewBtn.innerHTML = `
        <svg style="width:16px;height:16px;fill:currentColor" viewBox="0 0 24 24">
          <path d="M21,16V4H3V16H21M21,2H3C1.89,2 1,2.89 1,4V16C1,17.1 1.89,18 3,18H10V20H8V22H16V20H14V18H21C22.1,18 23,17.1 23,16V4C23,2.89 22.1,2 21,2Z" />
        </svg>
        슬라이드보기 <span class="badge">Esc</span>
      `;
      // Render dashboard cards
      renderDashboard();
    }
  }

  toggleViewBtn.addEventListener('click', () => {
    setViewMode(state.viewMode === 'presentation' ? 'dashboard' : 'presentation');
  });

  if (printPdfBtn) {
    printPdfBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // --- Presenter Drawer Toggle ---
  toolsToggle.addEventListener('click', () => {
    state.drawerOpen = !state.drawerOpen;
    if (state.drawerOpen) {
      toolsDrawer.classList.add('open');
      toolsToggle.style.borderColor = 'var(--accent-cyan)';
    } else {
      toolsDrawer.classList.remove('open');
      toolsToggle.style.borderColor = '';
    }
  });

  // Close drawer when clicking outside
  document.addEventListener('click', (e) => {
    if (state.drawerOpen && !toolsDrawer.contains(e.target) && !toolsToggle.contains(e.target)) {
      state.drawerOpen = false;
      toolsDrawer.classList.remove('open');
      toolsToggle.style.borderColor = '';
    }
  });

  // --- Theme Control (Dark/Light) ---
  function setTheme(theme) {
    state.theme = theme;
    document.body.setAttribute('data-theme', theme);
    if (theme === 'light') {
      themeToggle.classList.add('active');
      themeToggle.querySelector('.btn-text').textContent = '다크 모드 전환';
    } else {
      themeToggle.classList.remove('active');
      themeToggle.querySelector('.btn-text').textContent = '발표용 라이트 모드';
    }
  }

  themeToggle.addEventListener('click', () => {
    setTheme(state.theme === 'dark' ? 'light' : 'dark');
  });

  // --- Slide Navigation Logic ---
  function showSlide(index) {
    if (index < 0 || index >= slides.length) return;

    // Deactivate current slide
    slides.forEach((slide, idx) => {
      slide.classList.remove('active', 'prev');
      if (idx < index) {
        slide.classList.add('prev');
      }
    });

    state.currentSlide = index;
    slides[index].classList.add('active');

    // Update hash router
    window.location.hash = `slide-${index + 1}`;

    // Update Navigation UI
    const progressPercent = ((index + 1) / slides.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
    slideProgressText.textContent = `${index + 1} / ${slides.length}`;

    // Disable boundary navigation buttons
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === slides.length - 1;

    // Reset drawing layer between slides to prevent annotations bleeding across slides
    clearCanvas();

    // Update Presenter Notes and Visual Guide in tools drawer
    const activeSlide = slides[index];
    const scriptEl = activeSlide.querySelector('.presenter-notes');
    const visualEl = activeSlide.querySelector('.visual-guide-notes');

    if (scriptDisplay) {
      scriptDisplay.textContent = scriptEl ? scriptEl.textContent.trim() : '발표자 대본이 작성되지 않았습니다.';
    }
    if (visualDisplay) {
      visualDisplay.textContent = visualEl ? visualEl.textContent.trim() : '시각화 가이드가 작성되지 않았습니다.';
    }
  }

  function nextSlide() {
    if (state.currentSlide < slides.length - 1) {
      showSlide(state.currentSlide + 1);
    }
  }

  function prevSlide() {
    if (state.currentSlide > 0) {
      showSlide(state.currentSlide - 1);
    }
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    // If typing in search box, ignore navigation hotkeys
    if (document.activeElement === searchInput) {
      if (e.key === 'Escape') {
        searchInput.blur();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
      case ' ': // Spacebar
        if (state.viewMode === 'presentation' && !state.isDrawing) {
          e.preventDefault();
          nextSlide();
        }
        break;
      case 'ArrowLeft':
      case 'PageUp':
        if (state.viewMode === 'presentation' && !state.isDrawing) {
          e.preventDefault();
          prevSlide();
        }
        break;
      case 'Home':
        if (state.viewMode === 'presentation') {
          e.preventDefault();
          showSlide(0);
        }
        break;
      case 'End':
        if (state.viewMode === 'presentation') {
          e.preventDefault();
          showSlide(slides.length - 1);
        }
        break;
      case 'Escape':
        e.preventDefault();
        if (state.isDrawing) {
          toggleDrawingMode(false);
        } else {
          setViewMode(state.viewMode === 'presentation' ? 'dashboard' : 'presentation');
        }
        break;
      case 'd':
      case 'D':
        if (e.ctrlKey) {
          e.preventDefault();
          setViewMode(state.viewMode === 'presentation' ? 'dashboard' : 'presentation');
        }
        break;
      case 'p':
      case 'P':
        // Ctrl+P is standard print, let's avoid overriding it if Ctrl is pressed
        if (!e.ctrlKey && state.viewMode === 'presentation') {
          e.preventDefault();
          toggleDrawingMode(!state.isDrawing);
        }
        break;
      case 't':
      case 'T':
        if (!e.ctrlKey) {
          e.preventDefault();
          toolsToggle.click();
        }
        break;
    }
  });

  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  // --- Hash Route Loading ---
  function parseHash() {
    const hash = window.location.hash;
    const match = hash.match(/^#slide-(\d+)$/);
    if (match) {
      const slideNum = parseInt(match[1], 10) - 1;
      if (slideNum >= 0 && slideNum < slides.length) {
        showSlide(slideNum);
        setViewMode('presentation');
        return;
      }
    }
    showSlide(0);
  }

  window.addEventListener('hashchange', parseHash);
  parseHash(); // Trigger on initial load

  // --- Drawing Board Logic (Instructor Pointer Pen) ---
  function toggleDrawingMode(active) {
    state.isDrawing = active;
    const canvasLayer = document.querySelector('.drawing-canvas-layer');
    const drawingIndicator = document.getElementById('drawing-indicator');

    if (active) {
      canvasLayer.classList.add('drawing-active');
      drawingToggle.classList.add('active');
      drawingToggle.querySelector('.btn-text').textContent = '포인터 펜 끄기 (P)';
      drawingIndicator.style.display = 'block';
      isDrawingActive = true;
    } else {
      canvasLayer.classList.remove('drawing-active');
      drawingToggle.classList.remove('active');
      drawingToggle.querySelector('.btn-text').textContent = '포인터 펜 켜기 (P)';
      drawingIndicator.style.display = 'none';
      isDrawingActive = false;
    }
  }

  drawingToggle.addEventListener('click', () => {
    toggleDrawingMode(!state.isDrawing);
  });

  function clearCanvas() {
    ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
  }

  clearDrawingBtn.addEventListener('click', clearCanvas);

  // Drawing event handlers
  let drawing = false;

  function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (evt.clientX - rect.left) * (canvas.width / rect.width),
      y: (evt.clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  function startDrawing(e) {
    if (!isDrawingActive) return;
    drawing = true;
    const pos = getMousePos(drawingCanvas, e);
    [lastX, lastY] = [pos.x, pos.y];
  }

  function draw(e) {
    if (!drawing || !isDrawingActive) return;
    const pos = getMousePos(drawingCanvas, e);

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    [lastX, lastY] = [pos.x, pos.y];
  }

  function stopDrawing() {
    drawing = false;
  }

  drawingCanvas.addEventListener('mousedown', startDrawing);
  drawingCanvas.addEventListener('mousemove', draw);
  drawingCanvas.addEventListener('mouseup', stopDrawing);
  drawingCanvas.addEventListener('mouseout', stopDrawing);

  // --- Countdown Timer Logic ---
  function updateTimerDisplay() {
    const mins = Math.floor(state.timer.secondsLeft / 60);
    const secs = state.timer.secondsLeft % 60;
    const displayStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    timerDisplay.textContent = displayStr;

    if (state.timer.secondsLeft <= 30 && state.timer.secondsLeft > 0) {
      timerDisplay.classList.add('timer-warning');
    } else {
      timerDisplay.classList.remove('timer-warning');
    }
  }

  function startTimer() {
    if (state.timer.secondsLeft <= 0) return;

    state.timer.isRunning = true;
    timerStartBtn.classList.remove('active-play');
    timerStartBtn.classList.add('active-pause');
    timerStartBtn.textContent = '일시 정지';

    state.timer.intervalId = setInterval(() => {
      state.timer.secondsLeft--;
      updateTimerDisplay();

      if (state.timer.secondsLeft <= 0) {
        clearInterval(state.timer.intervalId);
        state.timer.isRunning = false;
        triggerTimerFlash();
        resetTimerUI();
      }
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(state.timer.intervalId);
    state.timer.isRunning = false;
    timerStartBtn.classList.remove('active-pause');
    timerStartBtn.classList.add('active-play');
    timerStartBtn.textContent = '타이머 시작';
  }

  function resetTimerUI() {
    timerStartBtn.classList.remove('active-pause');
    timerStartBtn.classList.add('active-play');
    timerStartBtn.textContent = '타이머 시작';
  }

  function triggerTimerFlash() {
    // Flash background for visual alarm
    flashScreen.style.display = 'block';

    // Play alert sound if user allowed audio context
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);

      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
      }, 800);
    } catch (err) {
      console.log('Audio Context not allowed or initialized yet.', err);
    }

    setTimeout(() => {
      flashScreen.style.display = 'none';
    }, 3000);
  }

  timerStartBtn.addEventListener('click', () => {
    if (state.timer.isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  });

  timerResetBtn.addEventListener('click', () => {
    clearInterval(state.timer.intervalId);
    state.timer.isRunning = false;
    state.timer.secondsLeft = 0;
    updateTimerDisplay();
    resetTimerUI();
  });

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mins = parseInt(btn.getAttribute('data-mins'), 10);
      clearInterval(state.timer.intervalId);
      state.timer.isRunning = false;
      state.timer.secondsLeft = mins * 60;
      updateTimerDisplay();
      resetTimerUI();
    });
  });

  updateTimerDisplay();

  // --- Copy Prompt Code Block Logic ---
  document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('copy-btn')) {
      const btn = e.target;
      const codeBlock = btn.closest('.code-container').querySelector('.code-block');
      const textToCopy = codeBlock.textContent.trim();

      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btn.textContent;
        btn.textContent = '복사 완료!';
        btn.classList.add('copied');

        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove('copied');
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    }
  });

  // --- Dashboard Rendering and Filtering ---
  function renderDashboard(filterQuery = '') {
    cardsGrid.innerHTML = '';
    const lowercaseQuery = filterQuery.toLowerCase();
    let matchesCount = 0;

    slides.forEach((slide, idx) => {
      const titleEl = slide.querySelector('.slide-title');
      const categoryEl = slide.querySelector('.slide-category');
      const title = titleEl ? titleEl.textContent : '슬라이드';
      const category = categoryEl ? categoryEl.textContent : '구분 없음';

      // Get some description preview text from slide body
      let desc = '';
      const paragraphs = slide.querySelectorAll('.slide-body p, .slide-body li');
      if (paragraphs.length > 0) {
        desc = Array.from(paragraphs)
          .slice(0, 2)
          .map(p => p.textContent)
          .join(' ')
          .substring(0, 100) + '...';
      }

      // Check filters
      if (
        title.toLowerCase().includes(lowercaseQuery) ||
        category.toLowerCase().includes(lowercaseQuery) ||
        desc.toLowerCase().includes(lowercaseQuery)
      ) {
        matchesCount++;
        const card = document.createElement('div');
        card.className = 'dashboard-card';
        card.setAttribute('data-index', idx);

        // Inherit session class from slide
        const sessionClass = Array.from(slide.classList).find(c => c.startsWith('session-'));
        if (sessionClass) {
          card.classList.add(sessionClass);
        }

        // Pick badge day color based on category/meta
        const dayBadgeEl = slide.querySelector('.day-badge');
        const dayTextFromHtml = dayBadgeEl ? dayBadgeEl.textContent.trim() : '';
        const isDay1 = dayTextFromHtml.includes('1일차') || category.includes('1일차');
        const dayText = isDay1 ? '1일차' : '2일차';

        card.innerHTML = `
          <div class="card-num">
            <span>Slide ${idx + 1}</span>
            <span class="card-tag" style="background:${isDay1 ? 'rgba(157,78,221,0.15)' : 'rgba(79,70,229,0.15)'};color:${isDay1 ? 'var(--accent-purple)' : 'var(--accent-blue)'}">${dayText}</span>
          </div>
          <div class="card-title">${title}</div>
          <div class="card-desc">${desc}</div>
          <div class="card-tags">
            <span class="card-tag">${category}</span>
          </div>
        `;

        card.addEventListener('click', () => {
          setViewMode('presentation');
          showSlide(idx);
        });

        cardsGrid.appendChild(card);
      }
    });

    if (matchesCount === 0) {
      cardsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">
          검색 결과에 맞는 슬라이드가 없습니다.
        </div>
      `;
    }
  }

  // Hook up search filter event listener
  searchInput.addEventListener('input', (e) => {
    renderDashboard(e.target.value);
  });
});
