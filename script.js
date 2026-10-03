const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('main section[id]');
const navContainer = document.getElementById('nav-links');
const navToggle = document.querySelector('.mobile-nav-toggle');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
sections.forEach((section) => sectionObserver.observe(section));

navToggle?.addEventListener('click', () => {
  const isOpen = navContainer.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});
navLinks.forEach((link) => link.addEventListener('click', () => {
  navContainer.classList.remove('open');
  navToggle?.setAttribute('aria-expanded', 'false');
}));

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
}

const heroVisual = document.querySelector('.hero-visual');
const avatarFigure = document.querySelector('.avatar-figure');
const avatar = document.querySelector('.avatar-image');
const eyePupils = document.querySelectorAll('.eye-pupil');
const orbits = document.querySelectorAll('.orbital');
const skillPills = document.querySelectorAll('.skill-float');

if (heroVisual && avatarFigure && avatar && !reduceMotion) {
  let tx = 0, ty = 0, cx = 0, cy = 0;
  const updateTarget = (clientX, clientY) => {
    const rect = heroVisual.getBoundingClientRect();
    tx = Math.max(-1, Math.min(1, (clientX - rect.left) / rect.width * 2 - 1));
    ty = Math.max(-1, Math.min(1, (clientY - rect.top) / rect.height * 2 - 1));
  };

  heroVisual.addEventListener('pointermove', (event) => updateTarget(event.clientX, event.clientY));
  heroVisual.addEventListener('pointerleave', () => { tx = 0; ty = 0; });

  const frame = () => {
    cx += (tx - cx) * .075;
    cy += (ty - cy) * .075;
    avatarFigure.style.transform = `translate3d(${cx * 11}px, ${cy * 8}px, 0) rotate(${cx * 1.8}deg) scale(1.015)`;
    eyePupils.forEach((pupil, index) => {
      const x = cx * (index === 0 ? 5.0 : 5.4);
      const y = cy * 3.8;
      pupil.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0)`;
    });
    orbits.forEach((orbit, index) => orbit.style.translate = `${cx * (index + 1) * 3}px ${cy * (index + 1) * 2}px`);
    skillPills.forEach((pill, index) => {
      const x = cx * (index % 2 ? -6 : 7);
      const y = cy * (index % 3 ? 4 : -4);
      pill.style.translate = `${x}px ${y}px`;
    });
    requestAnimationFrame(frame);
  };
  frame();
}

const assistantPanel = document.getElementById('assistantPanel');
const askOpen = document.getElementById('askOpen');
const askClose = document.getElementById('askClose');
const assistantForm = document.getElementById('assistantForm');
const assistantInput = document.getElementById('assistantInput');
const assistantMessages = document.getElementById('assistantMessages');

const greetingAnswer = 'Hi! Welcome to my portfolio. I can tell you about my experience, projects, skills, education, certifications, achievements or contact details.';

const answers = [
  { keys:['babaclick','fulfillment','shipstation','procurement'], answer:'At BabaClick, I built a data-driven fulfillment tool using the ShipStation API to split and optimize customer orders based on sourcing and delivery feasibility. I also built profitability, pricing and sourcing analytics dashboards.' },
  { keys:['vois','vodafone','ivr','inya'], answer:'At Vodafone Intelligent Solutions (VOIS), I analyzed real-world datasets using Python, Pandas and Excel. I also developed an AI-powered conversational IVR voice agent using Inya AI, LLM orchestration and TTS.' },
  { keys:['documentary','video','ffmpeg','n8n','gemini'], answer:'The AI-Powered Documentary Generator is an end-to-end pipeline using Gemini, n8n, Google Cloud TTS, FFmpeg and REST APIs. It automates script generation, multimodal scene creation, narration, 9:16 rendering, asynchronous media workflows and multi-scene concatenation.' },
  { keys:['veritas','kyc','gnani','supabase'], answer:'Veritas AI is an AI-powered KYC verification system using real-time voice interaction and LLM-based dialogue handling. It captures structured information and integrates it with a backend for reliable storage.' },
  { keys:['lane','opencv','hough','autonomous'], answer:'Lane Detection for Autonomous Driving is a real-time computer vision pipeline using Python, OpenCV and Hough Transform. It uses image preprocessing and ROI masking to improve lane detection accuracy.' },
  { keys:['netflix','eda','7000','excel'], answer:'Netflix Data Analysis is an EDA project on 7,000+ records. It reduced data redundancy by 60%, uncovered genre and regional trends, and used advanced Excel techniques to produce actionable visual reports.' },
  { keys:['skills','technical','stack','technology'], answer:'Core skills listed in my portfolio include Python, NumPy, Pandas, Seaborn, Matplotlib, Plotly, SQL, Java, C++, data cleaning and wrangling, EDA, Power BI, Advanced Excel, Machine Learning, LLMs, AI agent creation, GitHub and AWS Cloud.' },
  { keys:['education','college','degree','cgpa','vit'], answer:'I am pursuing a B.Tech in Computer Science Engineering (core) at VIT Bhopal University, with a CGPA of 8.78/10, for the 2023–2027 period.' },
  { keys:['certification','certifications','certificate'], answer:'My certifications include NPTEL Machine Learning, NPTEL Marketing Analytics, Meta Data Analyst Professional Certificate, Google IT Support Professional Certificate, Bits and Bytes of Computer Networking – Google, and Software Engineer Certificate – HackerRank.' },
  { keys:['achievement','achievements','medal','top 5'], answer:'My listed achievements include ranking in the Top 5% and receiving a Silver Medal in NPTEL Machine Learning, receiving a Gold Medal in NPTEL Marketing Analytics, and developing multiple data analytics projects using Python, SQL, Excel, Pandas, NumPy and Power BI.' },
  { keys:['contact','email','linkedin','github','phone'], answer:'You can reach me at siddhant.dhaka.official@gmail.com, on LinkedIn at linkedin.com/in/s1ddhant, or on GitHub at github.com/siddhant-dhaka. My resume lists Ghaziabad, Uttar Pradesh, India and +91 9625716815.' },
  { keys:['about','who are you','introduce'], answer:'I am Siddhant Dhaka, a B.Tech CSE student at VIT Bhopal University working across data, AI, analytics and automation.' }
];

function getAnswer(question) {
  const q = question.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  if (/^(hi|hello|hey|hiya|howdy|hola|namaste|good morning|good afternoon|good evening)$/.test(q)) return greetingAnswer;
  let best = null, bestScore = 0;
  answers.forEach((item) => {
    const score = item.keys.reduce((total, key) => {
      const needle = key.toLowerCase();
      const hit = needle.includes(' ') ? q.includes(needle) : new RegExp(`\\b${needle.replace(/[.*+?^\${}()|[\]\\\\]/g, '\\\\$&')}\\b`).test(q);
      return total + (hit ? 1 : 0);
    }, 0);
    if (score > bestScore) { bestScore = score; best = item.answer; }
  });
  return best || 'I do not have that information in my curated portfolio data. Try asking about my experience, projects, skills, education, certifications, achievements or contact details.';
}

function addMessage(text, type) {
  const bubble = document.createElement('div');
  bubble.className = `assistant-bubble ${type}`;
  bubble.textContent = text;
  assistantMessages.appendChild(bubble);
  requestAnimationFrame(() => bubble.classList.add('message-visible'));
  assistantMessages.scrollTop = assistantMessages.scrollHeight;
}
function showTyping() {
  const typing = document.createElement('div');
  typing.className = 'assistant-bubble assistant typing-indicator message-visible';
  typing.setAttribute('aria-label', 'Ask Siddhant is typing');
  typing.innerHTML = '<span></span><span></span><span></span>';
  assistantMessages.appendChild(typing);
  assistantMessages.scrollTop = assistantMessages.scrollHeight;
  return typing;
}
function askQuestion(question) {
  const trimmed = question.trim();
  if (!trimmed) return;
  addMessage(trimmed, 'user');
  const typing = showTyping();
  window.setTimeout(() => {
    typing.classList.add('typing-exit');
    window.setTimeout(() => { typing.remove(); addMessage(getAnswer(trimmed), 'assistant'); }, 180);
  }, 620);
}
function setAssistant(open) {
  assistantPanel.classList.toggle('open', open);
  assistantPanel.setAttribute('aria-hidden', String(!open));
  askOpen.setAttribute('aria-expanded', String(open));
  if (open) setTimeout(() => assistantInput.focus(), 100);
}
askOpen.addEventListener('click', () => setAssistant(!assistantPanel.classList.contains('open')));
askClose.addEventListener('click', () => setAssistant(false));
assistantForm.addEventListener('submit', (event) => { event.preventDefault(); askQuestion(assistantInput.value); assistantInput.value = ''; });
document.querySelectorAll('[data-question]').forEach((btn) => btn.addEventListener('click', () => askQuestion(btn.dataset.question)));

const projectData = {
  documentary:{ kicker:'AI / AUTOMATION', title:'AI-Powered Documentary Generator', summary:'An end-to-end AI video generation pipeline that automates content creation from script to final 9:16 video.', tags:['Gemini','n8n','Google Cloud TTS','FFmpeg','REST APIs'], details:['Engineered automated script generation, multimodal scene creation, narration and 9:16 video rendering.','Designed asynchronous media workflows with REST APIs, binary asset processing, scene-level transcoding and job polling.','Automated multi-scene video concatenation for fully automated short-form content generation.'] },
  veritas:{ kicker:'CONVERSATIONAL AI', title:'Veritas AI ( AI-Powered KYC Verification)', summary:'A conversational AI system for guiding users through KYC verification workflows using real-time voice interaction.', tags:['LLMs','Gnani AI','Supabase','Fast API'], details:['Used real-time voice interaction and LLM-based dialogue handling to guide the verification workflow.','Implemented structured data capture and backend integration to streamline verification.','Designed reliable storage of captured user information.'] },
  lane:{ kicker:'COMPUTER VISION', title:'Lane Detection for Autonomous Driving', summary:'A real-time computer vision pipeline for lane detection using image preprocessing, ROI masking and Hough Transform.', tags:['Python','OpenCV','Computer Vision','Hough Transform'], details:['Engineered a real-time lane detection pipeline with OpenCV.','Optimized image preprocessing and region-of-interest masking.','Used Hough Transform algorithms to support lane detection accuracy.'] },
  netflix:{ kicker:'DATA ANALYTICS', title:'Netflix Data Analysis', summary:'Comprehensive exploratory data analysis on 7,000+ records focused on redundancy reduction and trend discovery.', tags:['Python','Pandas','Excel'], details:['Performed EDA on 7,000+ records and reduced data redundancy by 60%.','Uncovered key genre and regional trends.','Used advanced Excel techniques and trend analysis to create visual reports for actionable insights and decision-making.'] }
};
const modal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const modalSummary = document.getElementById('modalSummary');
const modalKicker = document.getElementById('modalKicker');
const modalTags = document.getElementById('modalTags');
const modalDetails = document.getElementById('modalDetails');
function openProject(key) {
  const data = projectData[key];
  if (!data) return;
  modalKicker.textContent = data.kicker;
  modalTitle.textContent = data.title;
  modalSummary.textContent = data.summary;
  modalTags.innerHTML = data.tags.map(tag => `<span>${tag}</span>`).join('');
  modalDetails.innerHTML = data.details.map(item => `<p>${item}</p>`).join('');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
}
function closeProject() { modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
document.querySelectorAll('[data-project]').forEach(card => card.addEventListener('click', () => openProject(card.dataset.project)));
document.getElementById('modalClose').addEventListener('click', closeProject);
modal.addEventListener('click', (event) => { if (event.target === modal) closeProject(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeProject(); setAssistant(false); } });