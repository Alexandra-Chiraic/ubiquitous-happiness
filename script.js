const startBtn = document.getElementById('startBtn');
const howBtn = document.getElementById('howBtn');
const settingsBtn = document.getElementById('settingsBtn');
const gamePanel = document.getElementById('gamePanel');
const settingsPanel = document.getElementById('settingsPanel');
const howPanel = document.getElementById('howPanel');
const patientName = document.getElementById('patientName');
const patientCondition = document.getElementById('patientCondition');
const patientAge = document.getElementById('patientAge');
const patientIssue = document.getElementById('patientIssue');
const patientStory = document.getElementById('patientStory');
const stepNumber = document.getElementById('stepNumber');
const stepTotal = document.getElementById('stepTotal');
const toolsWrapper = document.getElementById('tools');
const patientCard = document.getElementById('patientCard');
const patientList = document.getElementById('patientList');
const nextBtn = document.getElementById('nextBtn');
const retryBtn = document.getElementById('retryBtn');
const scoreField = document.getElementById('score');
const explanationField = document.getElementById('explanation');
const muteBtn = document.getElementById('muteBtn');
const brightnessRange = document.getElementById('brightnessRange');
const brightnessValue = document.getElementById('brightnessValue');

let currentPatient = 0;
let currentStep = 0;
let score = 0;
let locked = false;
let audioCtx = null;
let musicGain = null;
let musicOsc1 = null;
let musicOsc2 = null;
let musicPlaying = true;

const tools = [
  { id: 'forceps', label: 'Pensiță', icon: '🩹' },
  { id: 'disinfectant', label: 'Dezinfectant', icon: '🧴' },
  { id: 'cream', label: 'Cremă cicatrizantă', icon: '🧴' },
  { id: 'bandage', label: 'Bandaj', icon: '🩹' },
  { id: 'syringe', label: 'Seringă', icon: '💉' },
  { id: 'splint', label: 'Atelă', icon: '🦾' },
  { id: 'scalpel', label: 'Bisturiu', icon: '🔪' },
  { id: 'stethoscope', label: 'Stetoscop', icon: '🩺' },
  { id: 'gaze', label: 'Gaze sterile', icon: '🧻' },
  { id: 'tape', label: 'Leucoplast', icon: '🩹' },
];

const patients = [
  {
    name: 'Maria',
    age: 14,
    condition: 'Blocaj în gât',
    issue: 'Corp străin blocat în faringe',
    story: 'Maria are dificultăți la înghițire și trebuie să îndepărtezi obiectul blocat înainte să dezinfectezi și să aplici un tratament calmant.',
    steps: [
      { prompt: 'Extrage obiectul blocat cu grijă.', correct: 'forceps', hint: 'Pensița te ajută să scoți corpul străin fără să rănești țesutul.' },
      { prompt: 'Dezinfectează zona afectată.', correct: 'disinfectant', hint: 'Curățarea previne infecțiile după extragere.' },
      { prompt: 'Aplică o cremă calmantă.', correct: 'cream', hint: 'Cremă cicatrizantă reduce disconfortul și cicatrizează pielea.' },
    ],
  },
  {
    name: 'Andrei',
    age: 16,
    condition: 'Tăietură adâncă',
    issue: 'Tăietură pe antebraț',
    story: 'Andrei s-a tăiat cu un obiect ascuțit și trebuie tratat rapid.',
    steps: [
      { prompt: 'Curăță rana cu antiseptic.', correct: 'disinfectant', hint: 'Spală bine pentru a elimina bacteriile.' },
      { prompt: 'Acoperă rana cu o gază sterilă.', correct: 'gaze', hint: 'Gaza absoarbe sângele și protejează rana.' },
      { prompt: 'Fixează cu leucoplast.', correct: 'tape', hint: 'Leucoplastul menține gaza pe loc și protejează în continuare.' },
    ],
  },
  {
    name: 'Elena',
    age: 15,
    condition: 'Luxație de umăr',
    issue: 'Umăr dislocat în timpul sportului',
    story: 'Elena are dureri puternice și umărul ei are nevoie de fixare corectă.',
    steps: [
      { prompt: 'Aplică o atelă pentru fixare.', correct: 'splint', hint: 'Atela ajută la menținerea umărului în poziție stabilă.' },
      { prompt: 'Verifică starea cu un stetoscop.', correct: 'stethoscope', hint: 'Stetoscopul nu vindecă, dar te ajută să verifici pulsul și respirația.' },
      { prompt: 'Îndepărtează tensiunea cu o cremă calmantă.', correct: 'cream', hint: 'Cremă reduce inflamația și durerea locală.' },
    ],
  },
  {
    name: 'Mihai',
    age: 17,
    condition: 'Durere dentară',
    issue: 'Durere și inflamație după o lovitură',
    story: 'Mihai acuză sensibilitate și inflamație la dinte.',
    steps: [
      { prompt: 'Verifică ritmul cardiac cu stetoscopul.', correct: 'stethoscope', hint: 'Instrumentul e util pentru monitorizarea stării generale.' },
      { prompt: 'Aplică antiseptic pe zona iritată.', correct: 'disinfectant', hint: 'Curăță și reduce riscul de infecție.' },
      { prompt: 'Folosește o compresă sterilă.', correct: 'gaze', hint: 'Gaza protejează zona și absoarbe lichidele.' },
    ],
  },
  {
    name: 'Ana',
    age: 13,
    condition: 'Eczemă iritată',
    issue: 'Zone roșii pe braț',
    story: 'Ana are o zonă iritată care trebuie curățată și protejată.',
    steps: [
      { prompt: 'Dezinfectează zona iritată.', correct: 'disinfectant', hint: 'Curățarea blândă ajută la prevenirea creșterii bacteriilor.' },
      { prompt: 'Aplică cremă calmantă.', correct: 'cream', hint: 'Cremă reduce roșeața și protejează pielea.' },
      { prompt: 'Protejează cu un bandaj ușor.', correct: 'bandage', hint: 'Bandajul menține tratamentul în loc și împiedică frecarea.' },
    ],
  },
  {
    name: 'Bianca',
    age: 18,
    condition: 'Respirație dificilă',
    issue: 'Respirație greoaie după efort',
    story: 'Bianca are dificultăți la respirație și trebuie verificată corect.',
    steps: [
      { prompt: 'Ascultă pieptul cu stetoscopul.', correct: 'stethoscope', hint: 'Stetoscopul te ajută să identifici problemele respiratorii.' },
      { prompt: 'Aplică o compresă sterilă ușoară.', correct: 'gaze', hint: 'Gaza poate ajuta la calmarea zonei dacă există iritație.' },
      { prompt: 'Folosește un dezinfectant după examinare.', correct: 'disinfectant', hint: 'Curățarea previne contaminarea instrumentelor.' },
    ],
  },
  {
    name: 'Robert',
    age: 16,
    condition: 'Vaccinare',
    issue: 'Injecție programată',
    story: 'Robert are nevoie de o injecție rapidă și igienă completă.',
    steps: [
      { prompt: 'Curăță locul cu dezinfectant.', correct: 'disinfectant', hint: 'Zona trebuie sterilizată înainte de injecție.' },
      { prompt: 'Administrează injecția cu seringă.', correct: 'syringe', hint: 'Seringa este instrumentul corect pentru acest pas.' },
      { prompt: 'Aplică un plasture sau leucoplast.', correct: 'tape', hint: 'Leucoplastul acoperă zona și previne sângerarea.' },
    ],
  },
  {
    name: 'Irina',
    age: 15,
    condition: 'Rana infectată',
    issue: 'Supurație la genunchi',
    story: 'Irina are o rană care trebuie curățată, dezinfectată și protejată.',
    steps: [
      { prompt: 'Curăță cu antiseptic.', correct: 'disinfectant', hint: 'Curățarea reduce bacteriile înainte de pansare.' },
      { prompt: 'Acoperă cu gaze sterile.', correct: 'gaze', hint: 'Gaza menține rana curată și uscată.' },
      { prompt: 'Fixează cu bandaj.', correct: 'bandage', hint: 'Bandajul păstrează totul la locul potrivit.' },
    ],
  },
  {
    name: 'Dan',
    age: 17,
    condition: 'Arsură mică',
    issue: 'Arsură superficială la mână',
    story: 'Dan are o arsură care trebuie tratată blând și protejată.',
    steps: [
      { prompt: 'Dezinfectează zona arsă.', correct: 'disinfectant', hint: 'Antisepticul reduce riscul de infecție.' },
      { prompt: 'Aplică cremă regenerantă.', correct: 'cream', hint: 'Cremă ajută pielea să se refacă mai repede.' },
      { prompt: 'Protejează cu un bandaj moale.', correct: 'bandage', hint: 'Bandajul acoperă arsură și împiedică iritarea.' },
    ],
  },
  {
    name: 'Clara',
    age: 14,
    condition: 'Iritație oculară',
    issue: 'Ochi roșii după fum',
    story: 'Clara are ochii iritați și trebuie examinată cu grijă.',
    steps: [
      { prompt: 'Ascultă semnele vitale cu stetoscopul.', correct: 'stethoscope', hint: 'Astfel verifici dacă starea generală este stabilă.' },
      { prompt: 'Curăță mediul cu antiseptic.', correct: 'disinfectant', hint: 'Ochiul trebuie păstrat curat și protejat.' },
      { prompt: 'Aplică gaze sterile pentru protecție.', correct: 'gaze', hint: 'Gaza sterilă ajută la menținerea igienei zonei.' },
    ],
  },
];

function shuffle(array) {
  return array.slice().sort(() => Math.random() - 0.5);
}

function initMusic() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  musicGain = audioCtx.createGain();
  musicGain.gain.value = 0.08;
  musicGain.connect(audioCtx.destination);

  musicOsc1 = audioCtx.createOscillator();
  musicOsc1.type = 'triangle';
  musicOsc1.frequency.value = 110;
  musicOsc1.connect(musicGain);

  musicOsc2 = audioCtx.createOscillator();
  musicOsc2.type = 'sine';
  musicOsc2.frequency.value = 165;
  musicOsc2.connect(musicGain);

  musicOsc1.start();
  musicOsc2.start();
}

function setMusicEnabled(enabled) {
  musicPlaying = enabled;
  if (!audioCtx) initMusic();
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  musicGain.gain.setTargetAtTime(enabled ? 0.08 : 0, audioCtx.currentTime, 0.01);
  muteBtn.textContent = enabled ? 'Muzică: Pornit' : 'Muzică: Oprit';
}

function updateBrightness(value) {
  document.body.style.filter = `brightness(${value})`;
  brightnessValue.textContent = `${Math.round(value * 100)}%`;
}

function toggleSettings() {
  settingsPanel.classList.toggle('hidden');
  if (!settingsPanel.classList.contains('hidden')) {
    settingsPanel.scrollIntoView({ behavior: 'smooth' });
  }
}

function showHowPanel() {
  howPanel.classList.toggle('hidden');
  if (!howPanel.classList.contains('hidden')) {
    howPanel.scrollIntoView({ behavior: 'smooth' });
  }
}

function setupDragDrop() {
  if (!patientCard) return;
  patientCard.addEventListener('dragover', (event) => {
    event.preventDefault();
    patientCard.classList.add('drag-over');
  });
  patientCard.addEventListener('dragleave', () => {
    patientCard.classList.remove('drag-over');
  });
  patientCard.addEventListener('drop', (event) => {
    event.preventDefault();
    patientCard.classList.remove('drag-over');
    const toolId = event.dataTransfer.getData('text/plain');
    const tool = getToolById(toolId);
    if (tool) {
      handleToolChoice(tool, patients[currentPatient].steps[currentStep]);
    }
  });
}

function getToolById(id) {
  return tools.find((tool) => tool.id === id);
}

function renderPatientList() {
  patientList.innerHTML = '';
  patients.forEach((patient, index) => {
    const avatar = document.createElement('button');
    avatar.type = 'button';
    avatar.className = 'patient-avatar' + (index === currentPatient ? ' active' : '');
    avatar.textContent = patient.name;
    avatar.title = `${patient.name}, ${patient.age} ani`;
    avatar.addEventListener('click', () => {
      currentPatient = index;
      currentStep = 0;
      showPatient();
    });
    patientList.appendChild(avatar);
  });
}

function showPatient() {
  const patient = patients[currentPatient];
  patientName.textContent = patient.name;
  patientCondition.textContent = patient.condition;
  patientAge.textContent = `${patient.age} ani`;
  patientIssue.textContent = patient.issue;
  patientStory.textContent = patient.story;
  stepNumber.textContent = currentStep + 1;
  stepTotal.textContent = patient.steps.length;
  renderTools(patient.steps[currentStep]);
  renderPatientList();
  explanationField.textContent = patient.steps[currentStep].prompt;
}

function renderTools(step) {
  const correctTool = getToolById(step.correct);
  const wrongTools = shuffle(tools.filter((tool) => tool.id !== step.correct)).slice(0, 3);
  const options = shuffle([correctTool, ...wrongTools]);
  toolsWrapper.innerHTML = '';

  options.forEach((tool) => {
    const button = document.createElement('button');
    button.className = 'tool-btn';
    button.type = 'button';
    button.draggable = true;
    button.innerHTML = `<span>${tool.icon}</span><span>${tool.label}</span>`;
    button.dataset.toolId = tool.id;
    button.addEventListener('click', () => handleToolChoice(tool, step));
    button.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text/plain', tool.id);
      event.dataTransfer.effectAllowed = 'copy';
    });
    toolsWrapper.appendChild(button);
  });
}

function handleToolChoice(tool, step) {
  if (locked) return;
  locked = true;
  const buttons = Array.from(document.querySelectorAll('.tool-btn'));
  const correctButton = buttons.find((btn) => btn.dataset.toolId === step.correct);
  const selectedButton = buttons.find((btn) => btn.dataset.toolId === tool.id);

  if (tool.id === step.correct) {
    score += 10;
    scoreField.textContent = score;
    selectedButton.classList.add('correct');
    explanationField.textContent = `Corect! ${step.hint}`;
  } else {
    selectedButton.classList.add('wrong');
    if (correctButton) correctButton.classList.add('correct');
    explanationField.textContent = `Greșit. Instrumentul corect este ${getToolById(step.correct).label}. ${step.hint}`;
  }

  buttons.forEach((button) => (button.disabled = true));
  nextBtn.classList.remove('hidden');
  retryBtn.classList.remove('hidden');
}

function nextStage() {
  locked = false;
  nextBtn.classList.add('hidden');
  retryBtn.classList.add('hidden');
  currentStep += 1;

  if (currentStep >= patients[currentPatient].steps.length) {
    currentPatient += 1;
    currentStep = 0;
  }

  if (currentPatient >= patients.length) {
    showEndScreen();
    return;
  }

  showPatient();
}

function showEndScreen() {
  patientName.textContent = 'Felicitări!';
  patientCondition.textContent = 'Ai tratat toți pacienții.';
  patientAge.textContent = '';
  patientIssue.textContent = 'MediVille este funcțional și toți pacienții sunt în siguranță.';
  patientStory.textContent = `Scor final: ${score}. Înapoi la început pentru o nouă sesiune de intervenții.`;
  stepNumber.textContent = '—';
  stepTotal.textContent = '—';
  toolsWrapper.innerHTML = '';
  explanationField.textContent = 'Apasă Reia pentru a practica din nou cu alți pacienți.';
  nextBtn.classList.add('hidden');
  retryBtn.classList.remove('hidden');
}

function startGame() {
  gamePanel.classList.remove('hidden');
  settingsPanel.classList.add('hidden');
  howPanel.classList.add('hidden');
  currentPatient = 0;
  currentStep = 0;
  score = 0;
  scoreField.textContent = score;
  initMusic();
  setMusicEnabled(musicPlaying);
  updateBrightness(brightnessRange.value);
  setupDragDrop();
  showPatient();
  gamePanel.scrollIntoView({ behavior: 'smooth' });
}

startBtn.addEventListener('click', startGame);
howBtn.addEventListener('click', showHowPanel);
settingsBtn.addEventListener('click', toggleSettings);
nextBtn.addEventListener('click', nextStage);
retryBtn.addEventListener('click', startGame);
muteBtn.addEventListener('click', () => setMusicEnabled(!musicPlaying));
brightnessRange.addEventListener('input', (event) => updateBrightness(event.target.value));
