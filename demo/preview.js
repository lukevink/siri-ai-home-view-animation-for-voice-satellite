let timers = [];
let audioTimer;
let activeState = 'idle';
const levelInput = document.getElementById('level');
const chat = document.querySelector('.vs-chat-container');
function setState(state) {
  activeState = state;
  const bar = document.querySelector('.vs-rainbow-bar');
  bar.className = `vs-rainbow-bar ${state === 'idle' ? '' : 'visible ' + state} ${['speaking','listening'].includes(state) ? 'reactive' : ''}`;
  document.querySelector('.vs-blur-overlay').classList.toggle('visible', state !== 'idle');
  chat.classList.toggle('visible', state === 'speaking' || state === 'processing');
  chat.querySelector('.assistant').textContent = state === 'processing' ? 'One moment…' : 'The living room lights are on.';
  document.querySelectorAll('[data-state]').forEach(b => b.classList.toggle('active', b.dataset.state === state));
  clearInterval(audioTimer);
  if (['speaking', 'listening'].includes(state)) {
    audioTimer = setInterval(() => {
      const envelope = .45 + .55 * Math.abs(Math.sin(performance.now() / 330) * Math.sin(performance.now() / 790));
      bar.style.setProperty('--vs-audio-level', (Number(levelInput.value) * envelope).toFixed(3));
    }, 33);
  } else bar.style.setProperty('--vs-audio-level', '0');
}
function cancelSequence() { timers.forEach(clearTimeout); timers = []; }
document.querySelectorAll('[data-state]').forEach(b => b.addEventListener('click', () => { cancelSequence(); setState(b.dataset.state); }));
document.getElementById('sequence').addEventListener('click', () => {
  cancelSequence(); setState('listening');
  for (const [delay, state] of [[4500,'processing'], [7000,'speaking'], [12500,'idle']]) timers.push(setTimeout(() => setState(state), delay));
});
levelInput.addEventListener('input', () => document.getElementById('level-output').textContent = `${Math.round(Number(levelInput.value) * 100)}%`);
function appearance() {
  document.getElementById('voice-satellite-custom-css').textContent = `#voice-satellite-ui {
    --siri-island-enabled: ${Number(document.getElementById('enabled').checked)};
    --siri-island-width: 260px;
    --siri-island-shape: ${document.getElementById('shape').value};
    --siri-island-glass-opacity: ${document.getElementById('opacity').value};
  }`;
}
for (const id of ['enabled', 'shape', 'opacity']) document.getElementById(id).addEventListener('input', appearance);
document.getElementById('light-backdrop').addEventListener('change', e => document.body.classList.toggle('light-backdrop', e.target.checked));
document.getElementById('drop-preview').addEventListener('click', () => {
  cancelSequence(); setState('idle'); timers.push(setTimeout(() => setState('listening'), 650));
});
document.querySelectorAll('.toggle').forEach(b => b.addEventListener('click', () => { const on=b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(on)); b.classList.toggle('off', !on); }));
document.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => { document.querySelector('nav a.selected')?.classList.remove('selected'); a.classList.add('selected'); }));
// Only the demo has a test/preview controller. The shipped module has none.
window.demo = { setState, get state() { return activeState; } };
