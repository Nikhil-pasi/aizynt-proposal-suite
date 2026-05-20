document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarOpen = document.getElementById('sidebarOpenBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const resetBtn = document.getElementById('resetBtn');
  const loading = document.getElementById('loadingOverlay');
  const wrapper = document.getElementById('previewWrapper');
  const zoomInBtn = document.getElementById('zoomIn');
  const zoomOutBtn = document.getElementById('zoomOut');
  const zoomFitBtn = document.getElementById('zoomFit');
  const zoomValue = document.getElementById('zoomValue');
  const pdfDocument = document.getElementById('pdfDocument');

  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (m) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[m]));
  const lineBreakToHtml = (val) => val.replace(/\n/g, '<br>');

  const page1Bindings = [
    { input: 'clientName', target: 'p_clientName', mode: 'html', transform: lineBreakToHtml },
    { input: 'clientLocation', target: 'p_clientLocation', mode: 'text' },
    { input: 'presentedBy', target: 'p_presentedBy', mode: 'text' },
    { input: 'role', target: 'p_role', mode: 'text' },
    { input: 'proposalDate', target: 'p_date', mode: 'text' },
    { input: 'scope', target: 'p_scope', mode: 'text' },
    { input: 'proposalYear', target: 'p_year', mode: 'text' },
    { input: 'proposalYear', target: 'p2_year', mode: 'text' },
    { input: 'proposalYear', target: 'p3_year', mode: 'text' }
  ];
  const page1Defaults = {};
  page1Bindings.forEach((b) => {
    const input = document.getElementById(b.input);
    if (input) page1Defaults[b.input] = input.value;
  });
  function updatePage1Binding(b) {
    const input = document.getElementById(b.input);
    const target = document.getElementById(b.target);
    if (!input || !target) return;
    let val = input.value;
    if (b.transform) val = b.transform(val);
    if (b.mode === 'html') target.innerHTML = val;
    else target.textContent = val;
  }
  page1Bindings.forEach((b) => {
    const input = document.getElementById(b.input);
    if (!input) return;
    input.addEventListener('input', () => updatePage1Binding(b));
    updatePage1Binding(b);
  });

  document.querySelectorAll('[data-editor-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-editor-tab]').forEach((el) => el.classList.toggle('active', el === btn));
      document.querySelectorAll('.editor-panel').forEach((panel) => panel.classList.remove('active'));
      document.getElementById(btn.dataset.editorTab + 'Editor').classList.add('active');
    });
  });

  sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
  sidebarOpen.addEventListener('click', () => sidebar.classList.remove('collapsed'));

  let currentZoom = 1;
  const pageWidth = 794;
  const pageHeight = 1123;
  const pageGap = 26;
  const pageCount = 3;
  function applyZoom() {
    wrapper.style.transform = 'scale(' + currentZoom + ')';
    wrapper.style.width = (pageWidth * currentZoom) + 'px';
    wrapper.style.height = ((pageHeight * pageCount + pageGap) * currentZoom) + 'px';
    zoomValue.textContent = Math.round(currentZoom * 100) + '%';
  }
  zoomInBtn.addEventListener('click', () => { currentZoom = Math.min(1.3, currentZoom + 0.1); applyZoom(); });
  zoomOutBtn.addEventListener('click', () => { currentZoom = Math.max(0.25, currentZoom - 0.1); applyZoom(); });
  zoomFitBtn.addEventListener('click', () => {
    const s = document.querySelector('.preview-scroll');
    currentZoom = Math.min((s.clientHeight - 80) / (pageHeight * pageCount + pageGap), (s.clientWidth - 40) / pageWidth, 1);
    currentZoom = Math.max(0.25, Math.round(currentZoom * 20) / 20);
    applyZoom();
  });
  setTimeout(() => zoomFitBtn.click(), 150);

  const TAG_OPTIONS = ['No Website','Low Quality Website','Not Optimized Website','No Google Business','Not Claimed GMB','GMB Not Optimized','No Active Ads','Low Ad Spend','Poor Ad Targeting','No Brand Identity','Weak Branding','No Online Reviews','Few Reviews','Negative Reviews','Dead Social Media','Inactive Social','Social Not Optimized'];
  const ICON_OPTIONS = [
    { value: 'website', label: 'Website', svg: '<rect x="2" y="3" width="12" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="2" y1="6" x2="14" y2="6" stroke="currentColor" stroke-width="1"/>' },
    { value: 'map', label: 'Map / GMB', svg: '<path d="M8 14s4.5-3.7 4.5-7.2A4.5 4.5 0 0 0 3.5 6.8C3.5 10.3 8 14 8 14Z" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="8" cy="6.8" r="1.5" fill="none" stroke="currentColor" stroke-width="1.2"/>' },
    { value: 'ads', label: 'Ads', svg: '<path d="M3 10L6 7L9 9.5L13 5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 13H13" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>' },
    { value: 'palette', label: 'Brand', svg: '<path d="M8 2.5a5.5 5.5 0 0 0 0 11h.7c.8 0 1.1-.9.6-1.5-.4-.5 0-1.2.7-1.2h1.1A3.1 3.1 0 0 0 14 7.7 5.5 5.5 0 0 0 8 2.5Z" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="5.7" cy="7" r=".6" fill="currentColor"/><circle cx="8" cy="5.5" r=".6" fill="currentColor"/><circle cx="10.2" cy="7" r=".6" fill="currentColor"/>' },
    { value: 'star', label: 'Reviews', svg: '<path d="M8 2L9.5 6H14L10.5 8.5L11.5 13L8 10.5L4.5 13L5.5 8.5L2 6H6.5L8 2Z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>' },
    { value: 'social', label: 'Social', svg: '<rect x="2.5" y="3" width="11" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="8" cy="8" r="2.1" fill="none" stroke="currentColor" stroke-width="1.2"/><circle cx="11.2" cy="5.3" r=".6" fill="currentColor"/>' },
    { value: 'search', label: 'Search', svg: '<circle cx="7" cy="7" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10 10l3 3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' },
    { value: 'phone', label: 'Calls', svg: '<path d="M5 3.5l1.4 2.8-1.1 1.1c.8 1.7 1.9 2.8 3.5 3.5l1.1-1.1L12.7 11l-.7 2.2c-.2.5-.6.8-1.1.8A8.9 8.9 0 0 1 2 5.1c0-.5.3-.9.8-1.1L5 3.5Z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>' },
    { value: 'automation', label: 'Automation', svg: '<rect x="3" y="5" width="10" height="7" rx="2" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M8 5V3M5.5 8.5h0M10.5 8.5h0M6 12v1.5M10 12v1.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>' },
    { value: 'content', label: 'Content', svg: '<rect x="3" y="3" width="10" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M5.5 6h5M5.5 8.5h5M5.5 11h3" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/>' },
    { value: 'warning', label: 'Warning', svg: '<path d="M8 2.8L14 13H2L8 2.8Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M8 6.2v3.2M8 11.4h0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>' },
    { value: 'grid', label: 'System', svg: '<rect x="3" y="3" width="4" height="4" rx=".8" fill="none" stroke="currentColor" stroke-width="1.4"/><rect x="9" y="3" width="4" height="4" rx=".8" fill="none" stroke="currentColor" stroke-width="1.4"/><rect x="3" y="9" width="4" height="4" rx=".8" fill="none" stroke="currentColor" stroke-width="1.4"/><rect x="9" y="9" width="4" height="4" rx=".8" fill="none" stroke="currentColor" stroke-width="1.4"/>' }
  ];
  const DEFAULT_PAGE2 = {
    header: { company: 'AIZYNT', tagline: 'AI SOLUTIONS', client: 'Pronto Water Tank Cleaning · Nagpur', badge: 'CONFIDENTIAL' },
    hero: { eyebrow: 'GROWTH AUDIT · PAGE 02', line1: '14 years of', line2: 'trust — zero', line3: 'digital presence.', highlightMode: 'line2', highlightWord: 'trust', description: 'Here is what we found, and exactly how we fix it. Every gap below is an opportunity your competitors are already capturing.' },
    tags: ['No Website','No Google Business','No Active Ads','No Brand Identity','No Online Reviews','Dead Social Media'],
    problems: [
      { icon:'website', badge:'CRITICAL', title:'No Website', description:'Customers searching water tank cleaning Nagpur find competitors — Pronto is invisible online.', impact:'→ Losing 100+ monthly searches' },
      { icon:'map', badge:'CRITICAL', title:'No Google Business', description:'No Maps listing, no reviews, no local visibility — the #1 discovery platform is empty.', impact:'→ Invisible on Maps & local search' },
      { icon:'ads', badge:'HIGH', title:'No Paid Ads', description:"Zero Instagram or Facebook campaigns. Every competitor ad is a lead that should be Pronto's.", impact:'→ Zero paid reach, zero leads' },
      { icon:'palette', badge:'HIGH', title:'No Brand Identity', description:'No logo, no colours, no uniforms. Unbranded = perceived as lower value.', impact:'→ Perceived as lower value' },
      { icon:'star', badge:'HIGH', title:'No Reviews / Trust', description:'14 years of happy customers — none visible online. Competitors with 50+ reviews win by default.', impact:'→ Trust gap loses clients' },
      { icon:'social', badge:'MEDIUM', title:'Dead Social Media', description:'Profiles exist but inactive. No posts, no engagement — a dead profile signals a dead business.', impact:'→ No organic discovery' }
    ],
    solutions: [
      { icon:'website', title:'Lead-Converting Website', description:'Professional site with admin panel — built for calls, bookings and local trust. Works 24/7.', result:'↑ Online leads activated' },
      { icon:'search', title:'Google Business + SEO', description:'GMB setup + keyword optimisation to rank #1 in local Maps and search.', result:'↑ Local search visibility' },
      { icon:'ads', title:'Instagram & Facebook Ads', description:'Targeted campaigns reaching local households — optimised profiles to convert visitors.', result:'↑ Paid reach & inquiries' },
      { icon:'palette', title:'Brand Identity Kit', description:'Logo, tagline, palette, T-shirt & ID card — a complete brand that commands higher rates.', result:'↑ Perceived value & pricing' },
      { icon:'star', title:'Review & Trust Strategy', description:'Collect 5-star reviews from existing customers — years of goodwill made visible online.', result:'↑ Trust before first call' },
      { icon:'content', title:'Content & Social Presence', description:'Festival posts, service creatives and a monthly content calendar to maintain organic reach.', result:'↑ Organic discovery' }
    ],
    outcomes: [
      { label:'THE GOAL', value:'Rank #1', subtext:'Water tank cleaning searches in Nagpur' },
      { label:'THE RESULT', value:'More Leads', subtext:'Consistent online inquiries without referral dependency' },
      { label:'THE IMPACT', value:'Higher Rates', subtext:'Premium presence = premium pricing power' },
      { label:'NEXT STEP', value:"Let's Begin", subtext:'+91 76208 16906 · aizynt.com' }
    ],
    footer: { name:'Nikhil Bawariya - Founder, Aizynt AI Solutions', contact:'+91 76208 16906 · aizyntaisolutions@gmail.com · aizynt.com · @aizynt.ai', location:'Nagpur, Maharashtra\nConfidential', page:'02' }
  };
  let page2 = JSON.parse(JSON.stringify(DEFAULT_PAGE2));
  const getPath = (root, path) => path.split('.').reduce((obj, key) => obj && obj[key], root);
  const setPath = (root, path, value) => { const keys = path.split('.'); const last = keys.pop(); let obj = root; keys.forEach((key) => obj = obj[key]); obj[last] = value; };
  const badgeClass = (badge) => badge === 'CRITICAL' ? 'p2-critical' : badge === 'HIGH' ? 'p2-high' : 'p2-medium';
  function iconSvg(iconName) {
    const icon = ICON_OPTIONS.find((item) => item.value === iconName) || ICON_OPTIONS[0];
    return '<svg viewBox="0 0 16 16" aria-hidden="true">' + icon.svg + '</svg>';
  }
  function iconHtml(iconName) {
    const classes = {
      website:'ti-world-www',
      map:'ti-map-pin',
      ads:'ti-speakerphone',
      palette:'ti-palette',
      star:'ti-star',
      social:'ti-brand-instagram',
      search:'ti-search',
      phone:'ti-phone-call',
      automation:'ti-cpu',
      content:'ti-layout-grid',
      warning:'ti-alert-triangle',
      grid:'ti-grid-dots'
    };
    return '<i class="ti ' + (classes[iconName] || 'ti-sparkles') + '" aria-hidden="true"></i>';
  }
  function heroLine(text, key) {
    const mode = page2.hero.highlightMode;
    if (mode === key) return '<span class="highlight">' + esc(text) + '</span>';
    if (mode === 'word' && page2.hero.highlightWord) {
      const word = page2.hero.highlightWord.trim();
      const idx = text.toLowerCase().indexOf(word.toLowerCase());
      if (idx >= 0) return esc(text.slice(0, idx)) + '<span class="highlight">' + esc(text.slice(idx, idx + word.length)) + '</span>' + esc(text.slice(idx + word.length));
    }
    return esc(text);
  }
  function renderPage2() {
    document.querySelectorAll('[data-p2]').forEach((el) => { el.textContent = getPath(page2, el.dataset.p2); });
    document.getElementById('p2HeroTitle').innerHTML = [heroLine(page2.hero.line1, 'line1'), heroLine(page2.hero.line2, 'line2'), heroLine(page2.hero.line3, 'line3')].join('<br>');
    document.getElementById('p2Tags').innerHTML = page2.tags.map((tag) => '<span class="p2-tag"><span class="p2-dot"></span>' + esc(tag) + '</span>').join('');
    document.getElementById('p2ProblemGrid').innerHTML = page2.problems.map((card) => '<div class="p2-card p2-problem"><div class="p2-card-top"><div class="p2-icon">' + iconHtml(card.icon) + '</div><div class="p2-badge ' + badgeClass(card.badge) + '">' + esc(card.badge) + '</div></div><div class="p2-card-title">' + esc(card.title) + '</div><div class="p2-card-desc">' + esc(card.description) + '</div><div class="p2-card-note">' + esc(card.impact) + '</div></div>').join('');
    document.getElementById('p2SolutionGrid').innerHTML = page2.solutions.map((card) => '<div class="p2-card p2-solution"><div class="p2-icon">' + iconHtml(card.icon) + '</div><div class="p2-card-title">' + esc(card.title) + '</div><div class="p2-card-desc">' + esc(card.description) + '</div><div class="p2-card-note">' + esc(card.result) + '</div></div>').join('');
    document.getElementById('p2OutcomeGrid').innerHTML = page2.outcomes.map((item) => '<div class="p2-outcome-col"><div class="p2-oc-label">' + esc(item.label) + '</div><div class="p2-oc-val">' + esc(item.value) + '</div><div class="p2-oc-sub">' + esc(item.subtext) + '</div></div>').join('');
  }
  function field(label, path, type) {
    const value = esc(getPath(page2, path));
    return '<div class="form-group"><label>' + label + '</label>' + (type === 'textarea' ? '<textarea data-p2-path="' + path + '">' + value + '</textarea>' : '<input data-p2-path="' + path + '" value="' + value + '">') + '</div>';
  }
  function arrField(label, arrayName, index, prop, type) {
    const value = esc(page2[arrayName][index][prop]);
    return '<div class="form-group"><label>' + label + '</label>' + (type === 'textarea' ? '<textarea data-p2-array="' + arrayName + '" data-index="' + index + '" data-field="' + prop + '">' + value + '</textarea>' : '<input data-p2-array="' + arrayName + '" data-index="' + index + '" data-field="' + prop + '" value="' + value + '">') + '</div>';
  }
  function iconSelect(arrayName, index) {
    const current = page2[arrayName][index].icon || ICON_OPTIONS[0].value;
    return '<div class="form-group"><label>Icon</label><select data-p2-array="' + arrayName + '" data-index="' + index + '" data-field="icon">' + ICON_OPTIONS.map((icon) => '<option value="' + icon.value + '"' + (icon.value === current ? ' selected' : '') + '>' + esc(icon.label) + '</option>').join('') + '</select></div>';
  }
  function renderPage2Editor() {
    document.getElementById('page2Fields').innerHTML = '<div class="page-label">Page 2 Controls</div>' +
      '<div class="p2-editor-card"><div class="p2-editor-title">Hero</div>' + field('Eyebrow','hero.eyebrow') + '<div class="small-row">' + field('Title Line 1','hero.line1') + field('Title Line 2','hero.line2') + '</div>' + field('Title Line 3','hero.line3') + '<div class="small-row"><div class="form-group"><label>Highlight Target</label><select data-p2-path="hero.highlightMode">' + ['line1','line2','line3','word'].map((x) => '<option value="' + x + '"' + (page2.hero.highlightMode === x ? ' selected' : '') + '>' + x + '</option>').join('') + '</select></div>' + field('Highlight Word','hero.highlightWord') + '</div>' + field('Description','hero.description','textarea') + '</div>' +
      '<div class="p2-editor-card"><div class="mini-head"><span>Current State Tags</span><button class="small-btn" data-action="addTag"' + (page2.tags.length >= 12 ? ' disabled' : '') + '>Add Tag</button></div>' + page2.tags.map((tag, index) => '<div class="mini-card"><div class="mini-head"><span>Tag ' + (index + 1) + '</span><button class="small-btn danger" data-action="deleteTag" data-index="' + index + '">Delete</button></div><div class="form-group"><label>Prebuilt Option</label><select data-tag-select="' + index + '">' + TAG_OPTIONS.map((option) => '<option value="' + esc(option) + '"' + (option === tag ? ' selected' : '') + '>' + esc(option) + '</option>').join('') + '</select></div><div class="form-group"><label>Tag Text</label><input data-tag-input="' + index + '" value="' + esc(tag) + '"></div></div>').join('') + '</div>' +
      '<div class="p2-editor-card"><div class="mini-head"><span>Problem Cards (' + page2.problems.length + '/6)</span><button class="small-btn" data-action="addProblem"' + (page2.problems.length >= 6 ? ' disabled' : '') + '>Add Card</button></div>' + page2.problems.map((card, index) => '<div class="mini-card"><div class="mini-head"><span>Problem ' + (index + 1) + '</span><button class="small-btn danger" data-action="deleteProblem" data-index="' + index + '"' + (page2.problems.length <= 1 ? ' disabled' : '') + '>Delete</button></div><div class="form-group"><label>Badge Level</label><select data-p2-array="problems" data-index="' + index + '" data-field="badge">' + ['CRITICAL','HIGH','MEDIUM'].map((badge) => '<option value="' + badge + '"' + (badge === card.badge ? ' selected' : '') + '>' + badge + '</option>').join('') + '</select></div>' + iconSelect('problems',index) + arrField('Title','problems',index,'title') + arrField('Description','problems',index,'description','textarea') + arrField('Impact Line','problems',index,'impact') + '</div>').join('') + '</div>' +
      '<div class="p2-editor-card"><div class="mini-head"><span>Solution Cards (' + page2.solutions.length + '/6)</span><button class="small-btn" data-action="addSolution"' + (page2.solutions.length >= 6 ? ' disabled' : '') + '>Add Card</button></div>' + page2.solutions.map((card, index) => '<div class="mini-card"><div class="mini-head"><span>Solution ' + (index + 1) + '</span><button class="small-btn danger" data-action="deleteSolution" data-index="' + index + '"' + (page2.solutions.length <= 1 ? ' disabled' : '') + '>Delete</button></div>' + iconSelect('solutions',index) + arrField('Title','solutions',index,'title') + arrField('Description','solutions',index,'description','textarea') + arrField('Result Line','solutions',index,'result') + '</div>').join('') + '</div>' +
      '<div class="p2-editor-card"><div class="p2-editor-title">Outcome Banner</div>' + page2.outcomes.map((item, index) => '<div class="mini-card"><div class="mini-head"><span>Outcome ' + (index + 1) + '</span></div><div class="small-row">' + arrField('Label','outcomes',index,'label') + arrField('Value','outcomes',index,'value') + '</div>' + arrField('Subtext','outcomes',index,'subtext','textarea') + '</div>').join('') + '</div>' +
      '<div class="p2-editor-card"><div class="p2-editor-title">Footer</div>' + field('Founder / Name','footer.name') + field('Contact Line','footer.contact','textarea') + field('Location Line','footer.location') + field('Page Number','footer.page') + '</div>';
  }
  function renderPage2All() { renderPage2(); renderPage2Editor(); }
  document.addEventListener('input', (event) => {
    const el = event.target;
    if (el.dataset.p2Path) { setPath(page2, el.dataset.p2Path, el.value); renderPage2(); }
    if (el.dataset.p2Array) { page2[el.dataset.p2Array][Number(el.dataset.index)][el.dataset.field] = el.value; renderPage2(); }
    if (el.dataset.tagInput) { page2.tags[Number(el.dataset.tagInput)] = el.value; renderPage2(); }
  });
  document.addEventListener('change', (event) => {
    const el = event.target;
    if (el.dataset.p2Path) { setPath(page2, el.dataset.p2Path, el.value); renderPage2(); }
    if (el.dataset.p2Array) { page2[el.dataset.p2Array][Number(el.dataset.index)][el.dataset.field] = el.value; renderPage2(); }
    if (el.dataset.tagSelect) { page2.tags[Number(el.dataset.tagSelect)] = el.value; renderPage2All(); }
  });
  document.addEventListener('click', (event) => {
    const action = event.target.dataset.action;
    if (!action) return;
    const index = Number(event.target.dataset.index);
    if (action === 'addTag') page2.tags.push(TAG_OPTIONS[0]);
    if (action === 'deleteTag') page2.tags.splice(index, 1);
    if (action === 'addProblem' && page2.problems.length < 6) page2.problems.push({ icon:'warning', badge:'MEDIUM', title:'New Problem', description:'Describe the problem here.', impact:'-> Add the business impact' });
    if (action === 'deleteProblem' && page2.problems.length > 1) page2.problems.splice(index, 1);
    if (action === 'addSolution' && page2.solutions.length < 6) page2.solutions.push({ icon:'grid', title:'New Solution', description:'Describe the solution here.', result:'Up: Add the expected result' });
    if (action === 'deleteSolution' && page2.solutions.length > 1) page2.solutions.splice(index, 1);
    renderPage2All();
  });
  renderPage2All();

  const STATUS_OPTIONS = ['NOT FOUND','NOT OPTIMISED','INACTIVE','ACTIVE'];
  const DEFAULT_PAGE3 = {
    hero: {
      eyebrow: 'GOOGLE BUSINESS AUDIT - NAGPUR',
      line1: 'Your competitors are',
      line2: 'winning on Google.',
      line3: 'Pronto is not there.',
      highlightMode: 'line2',
      description: 'We searched "water tank cleaning Nagpur" on Google. Here is exactly what we found - and what every potential Pronto customer sees instead.'
    },
    scores: [
      { value: '1,200+', label: 'Reviews - R2 Solutions\n(top Google result)' },
      { value: '4.9 star', label: 'Average rating of\ntop 3 competitors' },
      { value: '24 hrs', label: 'Top competitors\nshow open 24 hours' },
      { value: '4', label: 'Active businesses ranking\nabove Pronto on Google' },
      { value: '0', label: 'Times Pronto appears\nin Google search results' }
    ],
    audit: { label: 'LIVE GOOGLE BUSINESS AUDIT - SEARCHED "WATER TANK CLEANING NAGPUR"' },
    competitors: [
      { business:'R2 Solutions', sub:'Omkar Nagar, Nagpur', rating:'5.0', reviews:'1,200+', website:'yes', open:'yes', estimate:'yes', rank:'#1 RANK', years:'5+ yrs', client:false },
      { business:'Orange City WTC', sub:'Mire Layout, Nagpur', rating:'4.9', reviews:'426', website:'no', open:'yes', estimate:'no', rank:'#2 RANK', years:'5+ yrs', client:false },
      { business:'Om Sai Ram Services', sub:'Manewada Rd, Nagpur', rating:'4.9', reviews:'198', website:'no', open:'yes', estimate:'yes', rank:'#3 RANK', years:'3+ yrs', client:false },
      { business:'Maitry WTC Services', sub:'Renuka Vihar, Nagpur', rating:'4.9', reviews:'107', website:'no', open:'yes', estimate:'yes', rank:'#4 RANK', years:'New', client:false },
      { business:'Pronto WTC', sub:'Kamal Chowk - 14 years experience', rating:'Not listed', reviews:'0', website:'no', open:'no', estimate:'no', rank:'NOT FOUND', years:'14 yrs', client:true }
    ],
    gaps: {
      label: "WHAT EVERY RANKED COMPETITOR HAS - THAT PRONTO DOESN'T",
      cards: [
        { icon:'star', competitorLabel:'TOP COMPETITOR HAS', competitorValue:'1,200+ reviews', title:'Google Reviews', clientValue:'Pronto: 0 reviews', description:'Customers read reviews before calling. 1,200 reviews means instant trust; 0 reviews loses calls.' },
        { icon:'website', competitorLabel:'R2 SOLUTIONS HAS', competitorValue:'Full website', title:'Professional Website', clientValue:'Pronto: No website', description:'Google rewards businesses with websites in local search and customers get confidence before calling.' },
        { icon:'phone', competitorLabel:'ALL 4 SHOW AS', competitorValue:'Open 24 hours', title:'Business Hours Listed', clientValue:'Pronto: Not visible', description:'Customers searching at night see open competitors first. Pronto does not appear.' },
        { icon:'grid', competitorLabel:'RANKED BUSINESSES', competitorValue:'20-50+ photos', title:'Service Photos on GMB', clientValue:'Pronto: 0 photos', description:'Business photos build visual trust and support stronger Maps ranking signals.' },
        { icon:'search', competitorLabel:'COMPETITORS TARGET', competitorValue:'Local SEO keywords', title:'SEO Keywords & Category', clientValue:'Pronto: Not indexed', description:'Water tank cleaning Nagpur and related searches are captured by competitors.' },
        { icon:'ads', competitorLabel:'R2 SOLUTIONS', competitorValue:'Online estimates', title:'Online Enquiry System', clientValue:'Pronto: No online booking', description:'Competitors make quote requests easy. Pronto forces customers to search for contact details.' }
      ]
    },
    roadmap: {
      label: 'HOW AIZYNT FIXES THIS - GOOGLE BUSINESS ROADMAP FOR PRONTO',
      items: [
        { phase:'WEEK 1', title:'GMB Setup & Verify', target:'Profile live, category set, hours and photos uploaded', result:'-> Appear on Google Maps' },
        { phase:'WEEK 2-3', title:'Reviews Campaign', target:'WhatsApp existing customers for 5-star reviews', result:'-> 20+ reviews in 30 days' },
        { phase:'MONTH 1-2', title:'SEO Keywords + Posts', target:'Local keywords, service posts, Q&A active', result:'-> Rising in local search' },
        { phase:'MONTH 3-6', title:'Rank in Top 3', target:'50+ reviews, optimised profile, consistent posting', result:'-> Calls from Google daily' }
      ]
    },
    revenue: [
      { phase:'TODAY', time:'Current state', value:'Rs.0', description:'Zero online leads from Google. Word of mouth only.' },
      { phase:'MONTH 1-2', time:'GMB live + reviews', value:'Rs.8K-15K', description:'First online calls as profile gets indexed.' },
      { phase:'MONTH 3-4', time:'Ranking + website', value:'Rs.25K-40K', description:'Consistent Maps and website enquiries.' },
      { phase:'MONTH 6+', time:'Top 3 on Google', value:'Rs.60K+', description:'Online becomes a primary lead source.' }
    ],
    footer: { name:'Nikhil Bawariya - Founder, Aizynt AI Solutions', contact:'+91 76208 16906 - aizyntaisolutions@gmail.com - aizynt.com - @aizynt.ai', location:'Nagpur, Maharashtra\nConfidential', page:'03 / 09' }
  };
  let page3 = JSON.parse(JSON.stringify(DEFAULT_PAGE3));
  const setPath3 = (root, path, value) => { const keys = path.split('.'); const last = keys.pop(); let obj = root; keys.forEach((key) => obj = obj[key]); obj[last] = value; };
  const getPath3 = (root, path) => path.split('.').reduce((obj, key) => obj && obj[key], root);
  function p3HeroLine(text, key) {
    return page3.hero.highlightMode === key ? '<span class="highlight">' + esc(text) + '</span>' : esc(text);
  }
  function checkMark(value) {
    return value === 'yes' ? '<span class="p3-check">&#10003;</span>' : '<span class="p3-cross">X</span>';
  }
  function p3IconSymbol(iconName) {
    const labels = { website:'W', map:'G', ads:'AD', palette:'B', star:'R', social:'S', search:'SEO', phone:'24', automation:'AI', content:'C', warning:'!', grid:'P' };
    return labels[iconName] || 'G';
  }
  function parseMoneyValue(value) {
    const text = String(value || '').toUpperCase();
    const matches = [...text.matchAll(/(\d+(?:\.\d+)?)/g)].map((m) => Number(m[1]));
    if (!matches.length) return 0;
    const average = matches.reduce((sum, n) => sum + n, 0) / matches.length;
    const multiplier = text.includes('K') ? 1000 : 1;
    return Math.round(average * multiplier);
  }
  function chartPath(points) {
    return points.map((pt, index) => (index ? 'L' : 'M') + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1)).join(' ');
  }
  function renderGrowthChart() {
    const values = page3.revenue.map((item) => parseMoneyValue(item.value));
    const maxValue = Math.max(70000, ...values, 45000);
    const labels = page3.revenue.map((item) => item.phase);
    const w = 529;
    const h = 78;
    const left = 26;
    const right = 18;
    const top = 12;
    const bottom = 17;
    const innerW = w - left - right;
    const innerH = h - top - bottom;
    const toPoint = (value, index, total) => ({
      x: left + (innerW * index) / Math.max(1, total - 1),
      y: top + innerH - (innerH * value) / maxValue
    });
    const pronto = values.map((value, index) => toPoint(value, index, values.length));
    const competitor = values.map((_, index) => toPoint(index === values.length - 1 ? 45000 : 40000, index, values.length));
    const area = chartPath(pronto) + ' L ' + pronto[pronto.length - 1].x.toFixed(1) + ' ' + (top + innerH).toFixed(1) + ' L ' + pronto[0].x.toFixed(1) + ' ' + (top + innerH).toFixed(1) + ' Z';
    const start = page3.revenue[0] || {};
    const finish = page3.revenue[page3.revenue.length - 1] || {};
    const chart = document.getElementById('p3GrowthChart');
    if (!chart) return;
    const svgMarkup =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' +
      '<defs><linearGradient id="p3ChartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3B82F6" stop-opacity=".28"/><stop offset="100%" stop-color="#3B82F6" stop-opacity="0"/></linearGradient></defs>' +
      '<rect x="0" y="0" width="' + w + '" height="' + h + '" rx="8" fill="#EFF6FF" opacity=".78"/>' +
      [0, 1, 2].map((i) => '<line x1="' + left + '" x2="' + (w - right) + '" y1="' + (top + (innerH * i / 2)).toFixed(1) + '" y2="' + (top + (innerH * i / 2)).toFixed(1) + '" stroke="#2563EB" stroke-opacity=".12" stroke-width=".6"/>').join('') +
      '<path d="' + area + '" fill="url(#p3ChartFill)"/>' +
      '<path d="' + chartPath(competitor) + '" fill="none" stroke="#10B981" stroke-width="1.45" stroke-dasharray="6 5" stroke-linecap="round"/>' +
      '<path d="' + chartPath(pronto) + '" fill="none" stroke="#2563EB" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
      pronto.map((pt, index) => '<g><circle cx="' + pt.x.toFixed(1) + '" cy="' + pt.y.toFixed(1) + '" r="3.5" fill="#FFFFFF" stroke="#2563EB" stroke-width="2"/>' + (index === 0 || index === pronto.length - 1 ? '<text x="' + pt.x.toFixed(1) + '" y="' + Math.max(8, pt.y - 6).toFixed(1) + '" fill="#172033" font-family="Manrope, Arial, sans-serif" font-size="5.3" font-weight="900" text-anchor="middle">' + esc(page3.revenue[index].value) + '</text>' : '') + '<text x="' + pt.x.toFixed(1) + '" y="' + (h - 6) + '" fill="#64748B" font-family="Manrope, Arial, sans-serif" font-size="4.8" font-weight="800" text-anchor="middle">' + esc(labels[index]) + '</text></g>').join('') +
      '</svg>';
    chart.innerHTML =
      '<div class="p3-chart-card"><div class="p3-chart-top"><div><div class="p3-chart-eye">REVENUE GROWTH PROJECTION</div><div class="p3-chart-title">' + esc(start.value || 'Rs.0') + ' to ' + esc(finish.value || 'Rs.60K+') + ' in 6 months</div></div><div class="p3-chart-legend"><span><i></i>Pronto projected</span><span><b></b>Competitor baseline</span></div></div>' +
      '<img class="p3-chart-img" src="data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgMarkup) + '" alt="Revenue growth projection chart"></div>';
  }
  function renderPage3() {
    document.querySelectorAll('[data-p3]').forEach((el) => { el.textContent = getPath3(page3, el.dataset.p3); });
    document.getElementById('p3HeroTitle').innerHTML = [p3HeroLine(page3.hero.line1, 'line1'), p3HeroLine(page3.hero.line2, 'line2'), p3HeroLine(page3.hero.line3, 'line3')].join('<br>');
    document.getElementById('p3ScoreStrip').innerHTML = page3.scores.map((item) => '<div class="p3-score"><div class="p3-score-value">' + esc(item.value) + '</div><div class="p3-score-label">' + esc(item.label).replace(/\n/g, '<br>') + '</div></div>').join('');
    document.getElementById('p3AuditRows').innerHTML = page3.competitors.map((row) => '<tr class="' + (row.client ? 'p3-client-row' : '') + '"><td><div class="p3-biz-name">' + esc(row.business) + '</div><div class="p3-biz-sub">' + esc(row.sub) + '</div></td><td><strong>' + esc(row.rating) + '</strong><div class="p3-stars">' + (row.client ? '' : '&starf;&starf;&starf;&starf;&starf;') + '</div></td><td><strong>' + esc(row.reviews) + '</strong></td><td>' + checkMark(row.website) + '</td><td>' + checkMark(row.open) + '</td><td>' + checkMark(row.estimate) + '</td><td><span class="p3-rank">' + esc(row.rank) + '</span></td><td>' + esc(row.years) + '</td></tr>').join('');
    document.getElementById('p3GapGrid').innerHTML = page3.gaps.cards.map((card) => '<div class="p3-gap-card"><div class="p3-gap-top"><div class="p3-icon">' + iconHtml(card.icon) + '</div><div class="p3-comp"><div class="p3-comp-label">' + esc(card.competitorLabel) + '</div><div class="p3-comp-value">' + esc(card.competitorValue) + '</div></div></div><div class="p3-gap-title">' + esc(card.title) + '</div><div class="p3-gap-client">' + esc(card.clientValue) + '</div><div class="p3-gap-desc">' + esc(card.description) + '</div></div>').join('');
    document.getElementById('p3Roadmap').innerHTML = page3.roadmap.items.map((item) => '<div class="p3-road-item"><div class="p3-road-phase">' + esc(item.phase) + '</div><div class="p3-road-title">' + esc(item.title) + '</div><div class="p3-road-target">' + esc(item.target) + '</div><div class="p3-road-result">' + esc(item.result) + '</div></div>').join('');
    document.getElementById('p3Revenue').innerHTML = page3.revenue.map((item) => '<div class="p3-rev-item"><div class="p3-rev-phase">' + esc(item.phase) + '</div><div class="p3-rev-time">' + esc(item.time) + '</div><div class="p3-rev-value">' + esc(item.value) + '</div><div class="p3-rev-desc">' + esc(item.description) + '</div></div>').join('');
    renderGrowthChart();
  }
  function p3Field(label, path, type) {
    const value = esc(getPath3(page3, path));
    return '<div class="form-group"><label>' + label + '</label>' + (type === 'textarea' ? '<textarea data-p3-path="' + path + '">' + value + '</textarea>' : '<input data-p3-path="' + path + '" value="' + value + '">') + '</div>';
  }
  function p3ArrField(label, arrayName, index, prop, type) {
    const value = esc(page3[arrayName][index][prop]);
    return '<div class="form-group"><label>' + label + '</label>' + (type === 'textarea' ? '<textarea data-p3-array="' + arrayName + '" data-index="' + index + '" data-field="' + prop + '">' + value + '</textarea>' : '<input data-p3-array="' + arrayName + '" data-index="' + index + '" data-field="' + prop + '" value="' + value + '">') + '</div>';
  }
  function p3NestedField(label, group, arrayName, index, prop, type) {
    const value = esc(page3[group][arrayName][index][prop]);
    return '<div class="form-group"><label>' + label + '</label>' + (type === 'textarea' ? '<textarea data-p3-group="' + group + '" data-array="' + arrayName + '" data-index="' + index + '" data-field="' + prop + '">' + value + '</textarea>' : '<input data-p3-group="' + group + '" data-array="' + arrayName + '" data-index="' + index + '" data-field="' + prop + '" value="' + value + '">') + '</div>';
  }
  function p3IconSelect(index) {
    const current = page3.gaps.cards[index].icon || ICON_OPTIONS[0].value;
    return '<div class="form-group"><label>Icon</label><select data-p3-group="gaps" data-array="cards" data-index="' + index + '" data-field="icon">' + ICON_OPTIONS.map((icon) => '<option value="' + icon.value + '"' + (icon.value === current ? ' selected' : '') + '>' + esc(icon.label) + '</option>').join('') + '</select></div>';
  }
  function renderPage3Editor() {
    document.getElementById('page3Fields').innerHTML =
      '<div class="page-label">Page 3 - GMB Audit Controls</div>' +
      '<div class="p2-editor-card"><div class="p2-editor-title">Blue Hero</div>' + p3Field('Eyebrow','hero.eyebrow') + p3Field('Title Line 1','hero.line1') + p3Field('Title Line 2','hero.line2') + p3Field('Title Line 3','hero.line3') + '<div class="form-group"><label>Highlight Line</label><select data-p3-path="hero.highlightMode">' + ['line1','line2','line3'].map((x) => '<option value="' + x + '"' + (page3.hero.highlightMode === x ? ' selected' : '') + '>' + x + '</option>').join('') + '</select></div>' + p3Field('Description','hero.description','textarea') + '</div>' +
      '<div class="p2-editor-card"><div class="p2-editor-title">Score Strip</div>' + page3.scores.map((item, index) => '<div class="mini-card"><div class="mini-head"><span>Score ' + (index + 1) + '</span></div>' + p3ArrField('Value','scores',index,'value') + p3ArrField('Label','scores',index,'label','textarea') + '</div>').join('') + '</div>' +
      '<div class="p2-editor-card"><div class="p2-editor-title">Competitor Audit Table</div>' + p3Field('Section Label','audit.label') + page3.competitors.map((row, index) => '<div class="mini-card"><div class="mini-head"><span>' + (row.client ? 'Client Row' : 'Competitor ' + (index + 1)) + '</span></div>' + p3ArrField('Business','competitors',index,'business') + p3ArrField('Subline','competitors',index,'sub') + '<div class="small-row">' + p3ArrField('Rating','competitors',index,'rating') + p3ArrField('Reviews','competitors',index,'reviews') + '</div><div class="small-row"><div class="form-group"><label>Website</label><select data-p3-array="competitors" data-index="' + index + '" data-field="website"><option value="yes"' + (row.website === 'yes' ? ' selected' : '') + '>Yes</option><option value="no"' + (row.website === 'no' ? ' selected' : '') + '>No</option></select></div><div class="form-group"><label>24hr Open</label><select data-p3-array="competitors" data-index="' + index + '" data-field="open"><option value="yes"' + (row.open === 'yes' ? ' selected' : '') + '>Yes</option><option value="no"' + (row.open === 'no' ? ' selected' : '') + '>No</option></select></div></div><div class="small-row"><div class="form-group"><label>Online Estimate</label><select data-p3-array="competitors" data-index="' + index + '" data-field="estimate"><option value="yes"' + (row.estimate === 'yes' ? ' selected' : '') + '>Yes</option><option value="no"' + (row.estimate === 'no' ? ' selected' : '') + '>No</option></select></div>' + p3ArrField('Rank','competitors',index,'rank') + '</div>' + p3ArrField('Years Active','competitors',index,'years') + '</div>').join('') + '</div>' +
      '<div class="p2-editor-card"><div class="p2-editor-title">Gap Cards</div>' + p3Field('Section Label','gaps.label') + page3.gaps.cards.map((card, index) => '<div class="mini-card"><div class="mini-head"><span>Gap Card ' + (index + 1) + '</span></div>' + p3IconSelect(index) + p3NestedField('Competitor Label','gaps','cards',index,'competitorLabel') + p3NestedField('Competitor Value','gaps','cards',index,'competitorValue') + p3NestedField('Title','gaps','cards',index,'title') + p3NestedField('Client Value','gaps','cards',index,'clientValue') + p3NestedField('Description','gaps','cards',index,'description','textarea') + '</div>').join('') + '</div>' +
      '<div class="p2-editor-card"><div class="p2-editor-title">Roadmap</div>' + p3Field('Section Label','roadmap.label') + page3.roadmap.items.map((item, index) => '<div class="mini-card"><div class="mini-head"><span>Phase ' + (index + 1) + '</span></div>' + p3NestedField('Phase','roadmap','items',index,'phase') + p3NestedField('Title','roadmap','items',index,'title') + p3NestedField('Target','roadmap','items',index,'target','textarea') + p3NestedField('Result','roadmap','items',index,'result') + '</div>').join('') + '</div>' +
      '<div class="p2-editor-card"><div class="p2-editor-title">Revenue Projection</div>' + page3.revenue.map((item, index) => '<div class="mini-card"><div class="mini-head"><span>Revenue ' + (index + 1) + '</span></div>' + p3ArrField('Phase','revenue',index,'phase') + p3ArrField('Time','revenue',index,'time') + p3ArrField('Value','revenue',index,'value') + p3ArrField('Description','revenue',index,'description','textarea') + '</div>').join('') + '</div>' +
      '<div class="p2-editor-card"><div class="p2-editor-title">Footer</div>' + p3Field('Name','footer.name') + p3Field('Contact','footer.contact','textarea') + p3Field('Location','footer.location') + p3Field('Page Number','footer.page') + '</div>';
  }
  function renderPage3All() { renderPage3(); renderPage3Editor(); }
  document.addEventListener('input', (event) => {
    const el = event.target;
    if (el.dataset.p3Path) { setPath3(page3, el.dataset.p3Path, el.value); renderPage3(); }
    if (el.dataset.p3Array) { page3[el.dataset.p3Array][Number(el.dataset.index)][el.dataset.field] = el.value; renderPage3(); }
    if (el.dataset.p3Group) { page3[el.dataset.p3Group][el.dataset.array][Number(el.dataset.index)][el.dataset.field] = el.value; renderPage3(); }
  });
  document.addEventListener('change', (event) => {
    const el = event.target;
    if (el.dataset.p3Path) { setPath3(page3, el.dataset.p3Path, el.value); renderPage3All(); }
    if (el.dataset.p3Array) { page3[el.dataset.p3Array][Number(el.dataset.index)][el.dataset.field] = el.value; renderPage3(); }
    if (el.dataset.p3Group) { page3[el.dataset.p3Group][el.dataset.array][Number(el.dataset.index)][el.dataset.field] = el.value; renderPage3(); }
  });
  renderPage3All();

  function cleanupExportArtifacts() {
    document.querySelectorAll('.html2pdf__container, .html2canvas-container').forEach((el) => el.remove());
  }

  resetBtn.addEventListener('click', () => {
    if (!confirm('Reset all proposal pages to defaults?')) return;
    page1Bindings.forEach((b) => {
      const input = document.getElementById(b.input);
      if (input && page1Defaults[b.input] !== undefined) { input.value = page1Defaults[b.input]; updatePage1Binding(b); }
    });
    page2 = JSON.parse(JSON.stringify(DEFAULT_PAGE2));
    page3 = JSON.parse(JSON.stringify(DEFAULT_PAGE3));
    renderPage2All();
    renderPage3All();
  });

  async function renderPageCanvas(pdfFactory, element, width, height) {
    const stage = document.createElement('div');
    stage.className = 'pdf-capture-stage';
    stage.style.position = 'fixed';
    stage.style.left = '0';
    stage.style.top = '0';
    stage.style.width = width + 'px';
    stage.style.height = height + 'px';
    stage.style.overflow = 'hidden';
    stage.style.background = '#ffffff';
    stage.style.pointerEvents = 'none';
    stage.style.zIndex = '9998';

    const clone = element.cloneNode(true);
    clone.classList.add('pdf-capture-clone');
    clone.style.width = width + 'px';
    clone.style.height = height + 'px';
    clone.style.minWidth = width + 'px';
    clone.style.minHeight = height + 'px';
    clone.style.maxWidth = width + 'px';
    clone.style.maxHeight = height + 'px';
    clone.style.transform = 'none';
    clone.style.transformOrigin = 'top left';
    clone.style.borderRadius = '0';
    clone.style.boxShadow = 'none';
    clone.style.margin = '0';

    stage.appendChild(clone);
    document.body.appendChild(stage);
    await Promise.all(Array.from(clone.querySelectorAll('img')).map((img) => img.complete ? Promise.resolve() : new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    })));
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    try {
      const worker = pdfFactory().set({
        margin: 0,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          width,
          height,
          windowWidth: width,
          windowHeight: height,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#ffffff',
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
        pagebreak: { mode: [] }
      }).from(clone).toCanvas();
      await worker;
      return await worker.get('canvas');
    } finally {
      stage.remove();
    }
  }

  downloadBtn.addEventListener('click', async () => {
    if (downloadBtn.classList.contains('generating')) return;
    downloadBtn.classList.add('generating');
    downloadBtn.innerHTML = '<i class="ti ti-loader"></i> Generating...';
    loading.classList.add('active');
    const clientRaw = (document.getElementById('clientName').value || 'Client').replace(/\n/g, ' ');
    const clientSlug = clientRaw.replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/\s+/g, '_');
    const dateSlug = (document.getElementById('proposalDate').value || 'Proposal').replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/\s+/g, '_');
    const filename = 'Aizynt_Combined_Proposal_' + clientSlug + '_' + dateSlug + '.pdf';
    const prevTransform = wrapper.style.transform;
    const prevWidth = wrapper.style.width;
    const prevHeight = wrapper.style.height;
    const prevGap = pdfDocument.style.gap;
    const scrollArea = document.querySelector('.preview-scroll');
    const prevScrollTop = scrollArea.scrollTop;
    const prevScrollLeft = scrollArea.scrollLeft;
    cleanupExportArtifacts();
    wrapper.style.transform = 'scale(1)';
    wrapper.style.width = pageWidth + 'px';
    wrapper.style.height = (pageHeight * pageCount + pageGap * (pageCount - 1)) + 'px';
    pdfDocument.classList.add('exporting');
    document.body.classList.add('pdf-exporting');
    scrollArea.scrollTop = 0;
    scrollArea.scrollLeft = 0;
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      const pdfFactory = window.html2pdf || (typeof html2pdf !== 'undefined' ? html2pdf : null);
      if (!pdfFactory) throw new Error('PDF library not loaded.');
      const page1 = document.getElementById('proposalPage');
      const page2 = document.querySelector('#proposalPage2 .p2-page');
      const page3 = document.querySelector('#proposalPage3 .p3-page');
      if (!page1 || !page2 || !page3) throw new Error('Proposal pages not found.');

      const page1Canvas = await renderPageCanvas(pdfFactory, page1, pageWidth, pageHeight);
      const page2Canvas = await renderPageCanvas(pdfFactory, page2, 595, 842);
      const page3Canvas = await renderPageCanvas(pdfFactory, page3, 595, 842);
      const seedWorker = pdfFactory().set({
        margin: 0,
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
        pagebreak: { mode: [] }
      }).from(page1).toPdf();
      await seedWorker;
      const pdf = await seedWorker.get('pdf');
      const initialPages = pdf.internal.getNumberOfPages();
      for (let pageNo = initialPages; pageNo > 1; pageNo -= 1) pdf.deletePage(pageNo);
      pdf.setPage(1);
      if (pdf.internal.pages && Array.isArray(pdf.internal.pages[1])) pdf.internal.pages[1].length = 0;
      pdf.addImage(page1Canvas.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      pdf.addPage('a4', 'portrait');
      pdf.addImage(page2Canvas.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      pdf.addPage('a4', 'portrait');
      pdf.addImage(page3Canvas.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      console.log('Combined PDF page count:', initialPages, '->', pdf.internal.getNumberOfPages());
      pdf.save(filename);
      console.log('Combined PDF downloaded:', filename);
    } catch (err) {
      console.error('Combined PDF error:', err);
      alert('Combined PDF generation failed: ' + err.message + '\nTry Print / Save as PDF from browser.');
    } finally {
      pdfDocument.classList.remove('exporting');
      document.body.classList.remove('pdf-exporting');
      pdfDocument.style.gap = prevGap;
      wrapper.style.transform = prevTransform;
      wrapper.style.width = prevWidth;
      wrapper.style.height = prevHeight;
      scrollArea.scrollTop = prevScrollTop;
      scrollArea.scrollLeft = prevScrollLeft;
      loading.classList.remove('active');
      downloadBtn.classList.remove('generating');
      downloadBtn.innerHTML = '<i class="ti ti-download"></i> Download Combined PDF';
      cleanupExportArtifacts();
    }
  });
});
