// =========================================
// PS1 FORGE - LÓGICA PRINCIPAL (APP.JS)
// =========================================

// =====================
// ESTADO GLOBAL (S)
// =====================
let S = {
  lang: 'es', // Idioma por defecto
  frame: 'kali', 
  sym: 'λ', 
  sep: '㉿',
  cMain: '#00d7af', 
  cUser: '#aaaaaa', 
  cHost: '#aaaaaa', 
  cPath: '#ffffff',
  order: ['venv', 'node', 'py', 'date', 'time', 'user', 'path', 'dir', 'git', 'ip', 'os', 'ram', 'load', 'bat', 'jobs', 'exit'],
  active: { user: true, path: true, git: false, time: false, venv: false, jobs: false, exit: false, date: false, dir: false, node: false, os: false, ip: false, py: false, ram: false, load: false, bat: false },
  is12h: false,
  moduleColors: {},
  customTexts: {},
  tUser: '', 
  tHost: ''
};

let historyStack = [];
let presets = {};

// Obtiene el color ANSI más cercano a un HEX cualquiera
function getNearestAnsiColor(hex) {
  const hexToRgb = h => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
  let target = hexToRgb(hex.padEnd(7, '0'));
  let best = COLORS[0], minD = Infinity;
  for(let c of COLORS) {
    let d = target.reduce((acc, val, i) => acc + Math.pow(val - hexToRgb(c)[i], 2), 0);
    if(d < minD) { minD = d; best = c; }
  }
  return best;
}

// =====================
// PERSISTENCIA
// =====================
function saveState() {
  historyStack.push(JSON.parse(JSON.stringify(S)));
  if (historyStack.length > 50) historyStack.shift();
  document.getElementById('undo-btn').disabled = false;
  localStorage.setItem('ps1forge_state', JSON.stringify(S));
}

function undoState() {
  if (historyStack.length > 0) {
    S = historyStack.pop();
    localStorage.setItem('ps1forge_state', JSON.stringify(S));
    updateUIFromState();
    update();
    if (historyStack.length === 0) document.getElementById('undo-btn').disabled = true;
  }
}

function mutate(fn) {
  saveState(); 
  fn(); 
  updateUIFromState(); 
  update();
  localStorage.setItem('ps1forge_state', JSON.stringify(S));
}

// =====================
// INTERNACIONALIZACIÓN (I18N)
// =====================
function applyLang() {
  document.getElementById('lang-toggle').textContent = S.lang === 'es' ? 'EN' : 'ES';
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if(I18N[S.lang][key]) el.innerHTML = I18N[S.lang][key];
  });
  
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if(I18N[S.lang][key]) el.placeholder = I18N[S.lang][key];
  });
  
  updatePresetsUI();
  renderEzPrompt();
}

// =====================
// INICIALIZACIÓN (BOOT)
// =====================
function init() {
  if(localStorage.getItem('ps1forge_theme') === 'light') document.body.classList.add('light');
  if(localStorage.getItem('ps1forge_lang') === 'en') S.lang = 'en';
  
  presets = JSON.parse(localStorage.getItem('ps1forge_presets') || '{"Default": null}');
  
  try { 
    const saved = localStorage.getItem('ps1forge_state'); 
    if(saved) {
      const parsed = JSON.parse(saved);
      const currLang = S.lang;
      S = { ...S, ...parsed }; // Merge to ensure new properties like moduleColors exist
      if(!S.moduleColors) S.moduleColors = {};
      S.lang = currLang; 
    }
  } catch(e){}

  const fOpts = document.getElementById('frame-opts');
  FRAMES.forEach(f => { fOpts.innerHTML += `<button class="pill" data-frame="${f.id}">${f.name}</button>`; });
  
  const sOpts = document.getElementById('sym-opts');
  SYMBOLS.forEach(s => { sOpts.innerHTML += `<button class="pill" data-sym="${s}">${s}</button>`; });

  const spOpts = document.getElementById('sep-opts');
  SEPARATORS.forEach(s => { spOpts.innerHTML += `<button class="pill" data-sep="${s}">${s}</button>`; });

  ['cMain','cUser','cHost','cPath'].forEach(key => {
    const el = document.getElementById('cp-' + key.replace('c','').toLowerCase());
    COLORS.forEach(c => {
      el.innerHTML += `<div class="c-dot" data-${key}="${c}" style="background:${c}"></div>`;
    });
  });

  initDnD();
  applyLang();
  updateUIFromState();
}

function updatePresetsUI() {
  const sel = document.getElementById('preset-sel');
  sel.innerHTML = '';
  Object.keys(presets).forEach(k => {
    if(k !== 'Default') sel.innerHTML += `<option value="${k}">${k}</option>`;
  });
  if(sel.options.length === 0) sel.innerHTML = `<option value="">${I18N[S.lang].nopresets}</option>`;
}

// =====================
// CONSTRUCTOR VISUAL (EZPROMPT)
// =====================
function renderEzPrompt() {
  const activeDiv = document.getElementById('ez-active');
  const availDiv = document.getElementById('ez-available');
  activeDiv.innerHTML = ''; 
  availDiv.innerHTML = '';

  S.order.forEach(id => {
    if (id.startsWith('cust_')) {
      if(!S.active[id]) return;
      const div = document.createElement('div');
      div.className = 'drag-pill active';
      div.draggable = true;
      const colorVal = S.moduleColors[id] || S.cMain;
      div.dataset.id = id;
      div.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
          <input type="color" value="${colorVal}" 
                 onchange="mutate(()=>{ S.moduleColors['${id}'] = getNearestAnsiColor(this.value); })"
                 onclick="event.stopPropagation()"
                 style="width:16px; height:16px; padding:0; border:none; cursor:pointer; background:none;" title="Color del módulo" />
          <input type="text" value="${esc(S.customTexts[id]||'')}" placeholder="${I18N[S.lang].customText}" 
                 style="background:transparent;border:none;color:inherit;width:80px;font-family:inherit;outline:none;" 
                 onchange="mutate(()=>{S.customTexts['${id}']=this.value})" 
                 onclick="event.stopPropagation()"/> 
          <span style="cursor:pointer;color:#ff5f5f;margin-left:4px" 
                onclick="mutate(()=>{delete S.active['${id}'];S.order=S.order.filter(x=>x!=='${id}')})">×</span>
        </div>
      `;
      div.ondragstart = (e) => { e.dataTransfer.setData('text/plain', id); div.classList.add('dragging'); };
      div.ondragend = () => div.classList.remove('dragging');
      activeDiv.appendChild(div);
      return;
    }

    const mod = ALL_MODULES.find(x => x.id === id);
    if (!mod) return;
    
    const div = document.createElement('div');
    div.className = 'drag-pill';
    div.dataset.id = id;
    
    if (S.active[id]) {
      div.draggable = true; 
      div.classList.add('active'); 
      const colorVal = S.moduleColors[id] || (id==='path'||id==='dir' ? S.cPath : (id==='user' ? S.cUser : S.cMain));
      div.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
          <input type="color" value="${colorVal}" 
                 onchange="mutate(()=>{ S.moduleColors['${id}'] = getNearestAnsiColor(this.value); })"
                 onclick="event.stopPropagation()"
                 style="width:16px; height:16px; padding:0; border:none; cursor:pointer; background:none;" title="Color del módulo" />
          <span style="flex:1" onclick="mutate(()=>{S.active['${id}']=false})">${mod[`${S.lang}_name`]}</span>
        </div>
      `;
      div.ondragstart = (e) => { e.dataTransfer.setData('text/plain', id); div.classList.add('dragging'); };
      div.ondragend = () => div.classList.remove('dragging');
      activeDiv.appendChild(div);
    } else {
      div.textContent = mod[`${S.lang}_name`];
      div.onclick = () => mutate(() => S.active[id] = true);
      availDiv.appendChild(div);
    }
  });
}

function initDnD() {
  const activeDiv = document.getElementById('ez-active');
  activeDiv.addEventListener('dragover', e => {
    e.preventDefault();
    const afterElement = getDragAfterElement(activeDiv, e.clientX);
    const draggable = document.querySelector('.dragging');
    if (draggable) {
      if (afterElement == null) activeDiv.appendChild(draggable);
      else activeDiv.insertBefore(draggable, afterElement);
    }
  });
  
  activeDiv.addEventListener('drop', e => {
    e.preventDefault();
    const finalOrder = [];
    activeDiv.childNodes.forEach(node => {
      if(node.dataset && node.dataset.id) {
        finalOrder.push(node.dataset.id);
      }
    });
    S.order.forEach(id => { 
      if(!finalOrder.includes(id) && !id.startsWith('cust_')) finalOrder.push(id); 
    });
    mutate(() => { S.order = finalOrder; });
  });
}

function getDragAfterElement(container, x) {
  const draggableElements = [...container.querySelectorAll('.drag-pill.active:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = x - box.left - box.width / 2;
    if (offset < 0 && offset > closest.offset) return { offset: offset, element: child };
    else return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateUIFromState() {
  ['frame','sym','sep'].forEach(k => {
    document.querySelectorAll(`[data-${k}]`).forEach(b=>b.classList.remove('active'));
    let el = document.querySelector(`[data-${k}="${S[k]}"]`);
    if(el) el.classList.add('active');
  });
  
  ['cMain','cUser','cHost','cPath'].forEach(k => {
    document.querySelectorAll(`[data-${k}]`).forEach(b=>b.classList.remove('active'));
    let el = document.querySelector(`[data-${k}="${S[k]}"]`);
    if(el) el.classList.add('active');
  });
  
  document.getElementById('in-user').value = S.tUser;
  document.getElementById('in-host').value = S.tHost;
  document.getElementById('chk-12h').checked = !!S.is12h;
  
  renderEzPrompt();
}

// =====================
// MOTOR DE GENERACIÓN (BUILDER)
// =====================
function esc(s) { return s.replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function build(mode) {
  const mC = S.cMain, uC = S.cUser, hC = S.cHost, pC = S.cPath;
  const getColor = (id, def) => S.moduleColors[id] || def;
  
  const span = (color, text) => `<span style="color:${color}">${esc(text)}</span>`;
  const bash = (color, text) => `\\[\\e[${ANSI_MAP[color]}m\\]${text}`;
  const zsh  = (color, text) => `%{\\e[${ANSI_MAP[color]}m%}${text}`;
  
  const c = (col, txt) => mode === 'bash' ? bash(col, txt) : (mode === 'zsh' ? zsh(col, txt) : span(col, txt));
  const def = mode === 'bash' ? '\\[\\e[0m\\]' : (mode === 'zsh' ? '%{\\e[0m%}' : '');
  
  let env = mode==='bash' ? `$([ -n "$VIRTUAL_ENV" ]&&echo "$(basename $VIRTUAL_ENV)")` : (mode==='zsh' ? `$(basename $VIRTUAL_ENV)` : `env`);
  let dt  = mode==='bash' ? `\\d` : (mode==='zsh' ? `%D` : `Tue May 08`);
  
  let tmBash = S.is12h ? `\\@` : `\\A`;
  let tmZsh = S.is12h ? `%t` : `%*`;
  let tmHtml = S.is12h ? `02:30 PM` : `14:30`;
  let tm  = mode==='bash' ? tmBash : (mode==='zsh' ? tmZsh : tmHtml);
  
  let us  = mode==='bash' ? `\\u` : (mode==='zsh' ? `%n` : (S.tUser || 'user'));
  let hs  = mode==='bash' ? `\\h` : (mode==='zsh' ? `%m` : (S.tHost || 'host'));
  let pt  = mode==='bash' ? `\\w` : (mode==='zsh' ? `%~` : `~/dev`);
  let di  = mode==='bash' ? `\\W` : (mode==='zsh' ? `%1~` : `dev`);
  
  let ndRaw = mode==='bash' || mode==='zsh' ? `$(node -v 2>/dev/null)` : `v20.0.0`;
  let pyRaw = mode==='bash' || mode==='zsh' ? `$(python3 -V 2>&1 | awk '{print $2}')` : `3.10.12`;
  let osRaw = mode==='bash' || mode==='zsh' ? `$(uname -r)` : `6.1.0-kali`;
  let ipRaw = mode==='bash' || mode==='zsh' ? `$(hostname -I 2>/dev/null | awk '{print $1}')` : `192.168.1.100`;
  let ramRaw = mode==='bash' || mode==='zsh' ? `$(free -h 2>/dev/null | awk '/^Mem:/ {print $3}')` : `4.2G`;
  let loadRaw = mode==='bash' || mode==='zsh' ? `$(cat /proc/loadavg 2>/dev/null | awk '{print $1" "$2}')` : `0.15 0.08`;
  let batRaw = mode==='bash' || mode==='zsh' ? `$(cat /sys/class/power_supply/BAT*/capacity 2>/dev/null | head -1)%` : `87%`;
  
  let envC = c(getColor('venv', mC), env); let dtC = c(getColor('date', mC), dt); let tmC = c(getColor('time', mC), tm); 
  let usC = c(getColor('user', uC), us); let hsC = c(getColor('user', hC), hs); 
  let ptC = c(getColor('path', pC), pt); let diC = c(getColor('dir', pC), di);
  let ndC = c(getColor('node', mC), ndRaw); let osC = c(getColor('os', mC), osRaw); let ipC = c(getColor('ip', mC), ipRaw);
  let pyC = c(getColor('py', mC), pyRaw); let ramC = c(getColor('ram', mC), ramRaw); let loadC = c(getColor('load', mC), loadRaw); let batC = c(getColor('bat', mC), batRaw);
  
  let userHostStr = usC + (S.sep === '@' || FRAMES.find(x=>x.id===S.frame).id === 'ubuntu' ? c(mC, S.sep) : c(mC, ' ' + S.sep + ' ')) + hsC;
  
  let gtRaw = mode==='bash' ? `$(git branch 2>/dev/null|grep '^*'|colrm 1 2|xargs -I{} echo " git:({})")` : (mode==='zsh' ? `$(git branch 2>/dev/null | grep '^*' | colrm 1 2 | xargs -I{} echo " git:({})")` : ` git:(main)`);
  let jbRaw = mode==='bash' ? `$(j=$(jobs|wc -l);[ $j -gt 0 ]&&echo "[$j] ")` : (mode==='zsh' ? `%(1j.[%j] .)` : `[1] `);
  let exRaw = mode==='bash' ? `$([ $? = 0 ]&&echo "\\[\\e[38;5;83m\\]✓ "||echo "\\[\\e[38;5;203m\\]✗ ")` : (mode==='zsh' ? `%(?.%{\\e[38;5;83m%}✓ .%{\\e[38;5;203m%}✗ )` : `<span style="color:#5f5">✓ </span>`);
  
  let gtC = c(getColor('git', mC), gtRaw); let jbC = c(getColor('jobs', mC), jbRaw); let exStr = exRaw;
  let symC = c(mC, S.sym + ' ');
  
  let activeBlocks = [];
  let showJobs = S.active.jobs; 
  let showExit = S.active.exit;
  
  S.order.forEach(k => {
    if(!S.active[k]) return;
    if(k==='venv') activeBlocks.push({ id:'venv', str: envC });
    if(k==='node') activeBlocks.push({ id:'node', str: ndC });
    if(k==='py')   activeBlocks.push({ id:'py',   str: pyC });
    if(k==='date') activeBlocks.push({ id:'date', str: dtC });
    if(k==='time') activeBlocks.push({ id:'time', str: tmC });
    if(k==='user') activeBlocks.push({ id:'user', str: userHostStr });
    if(k==='path') activeBlocks.push({ id:'path', str: ptC });
    if(k==='dir')  activeBlocks.push({ id:'dir',  str: diC });
    if(k==='git')  activeBlocks.push({ id:'git',  str: gtC });
    if(k==='ip')   activeBlocks.push({ id:'ip',   str: ipC });
    if(k==='os')   activeBlocks.push({ id:'os',   str: osC });
    if(k==='ram')  activeBlocks.push({ id:'ram',  str: ramC });
    if(k==='load') activeBlocks.push({ id:'load', str: loadC });
    if(k==='bat')  activeBlocks.push({ id:'bat',  str: batC });
    if(k.startsWith('cust_')) activeBlocks.push({ id:'custom', str: c(getColor(k, mC), S.customTexts[k]) });
  });

  const f = FRAMES.find(x => x.id === S.frame);
  let l1 = '', l2 = '';

  if (f.type === 'line') {
    let parts = activeBlocks.map(b => {
      if(b.id === 'git' || b.id === 'custom') return b.str;
      if(b.id === 'venv') return c(mC, '(') + b.str + c(mC, ')');
      if(b.id === 'time' || b.id === 'date') return c(mC, '[') + b.str + c(mC, ']');
      if(b.id === 'path' || b.id === 'dir') return c(mC, '[') + b.str + c(mC, ']');
      if(b.id === 'user') return c(mC, f.u1||'(') + b.str + c(mC, f.u2||')');
      return b.str;
    });
    
    let joiner = c(mC, f.chars[1]);
    l1 = c(mC, f.chars[0]) + c(mC, f.chars[1]) + parts.join(joiner);
    
    if (f.chars[4] && parts.length > 0) l1 += joiner + c(mC, f.chars[4]);
    else if (parts.length === 0) l1 = c(mC, f.chars[0]) + c(mC, f.chars[1]);
    
    l2 = c(mC, f.chars[2]) + c(mC, f.chars[3]) + (showJobs?jbC:'') + (showExit?exStr:'') + symC;
    
  } else if (f.type === 'free-text') {
    let joined = f.build(c, mC, activeBlocks.map(b=>b.str));
    let lines = joined.split('\\n');
    l1 = lines[0]; l2 = lines[1] || '';
    if (l2) l2 += (showJobs?jbC:'') + (showExit?exStr:'') + symC; else l1 += ' ' + (showJobs?jbC:'') + (showExit?exStr:'') + symC;
    
  } else {
    let res = f.build(c, mC, S.active.venv?envC:'', S.active.time?tmC:'', S.active.user?userHostStr:'', S.active.path?ptC:'', S.active.git?gtC:'');
    let lines = res.split('\\n');
    l1 = lines[0]; l2 = lines[1] || '';
    if (l2) l2 += (showJobs?jbC:'') + (showExit?exStr:'') + symC; else l1 += ' ' + (showJobs?jbC:'') + (showExit?exStr:'') + symC;
  }
  
  if (mode !== 'html') {
    let finalStr = `${l1}${l2 ? '\\n'+l2 : ''}${def}`;
    if (mode === 'bash') {
      // Usar single quotes en bash para evitar ejecución prematura de $(...)
      let escaped = finalStr.replace(/'/g, "'\\''");
      return `PS1='${escaped}'`;
    } else {
      let escaped = finalStr.replace(/'/g, "\\'");
      return `PROMPT=$'${escaped}'`;
    }
  }
  return {l1, l2};
}

function update() {
  const html = build('html');
  document.getElementById('line1').innerHTML = html.l1;
  document.getElementById('line2').innerHTML = html.l2;
  document.getElementById('line2').style.display = html.l2 ? 'block' : 'none';
  
  let shell = document.getElementById('shell-mode').value;
  let code = build(shell);
  document.getElementById('code-out').textContent = code + (shell === 'bash' ? "\nexport PS1" : "");
}

// =====================
// BINDINGS Y EVENTOS
// =====================
function bindPills(sel, key) {
  document.querySelectorAll(sel).forEach(b => b.addEventListener('click', () => mutate(() => { S[key] = b.dataset[key]; })));
}

function bindColors(key) {
  document.querySelectorAll(`[data-${key}]`).forEach(d => d.addEventListener('click', () => mutate(() => { S[key] = d.getAttribute(`data-${key}`); })));
}

document.getElementById('lang-toggle').addEventListener('click', () => {
  S.lang = S.lang === 'es' ? 'en' : 'es';
  localStorage.setItem('ps1forge_lang', S.lang);
  applyLang();
});

document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('ps1forge_theme', document.body.classList.contains('light') ? 'light' : 'dark');
});

document.getElementById('btn-add-cust').addEventListener('click', () => {
  mutate(() => {
    const id = 'cust_' + Date.now();
    S.customTexts[id] = 'Texto';
    S.active[id] = true;
    S.order.push(id);
  });
});

document.getElementById('btn-save-preset').addEventListener('click', () => {
  let name = prompt("Nombre del preset / Preset name:");
  if(name) { 
    presets[name] = JSON.parse(JSON.stringify(S)); 
    localStorage.setItem('ps1forge_presets', JSON.stringify(presets)); 
    updatePresetsUI(); 
  }
});
document.getElementById('btn-load-preset').addEventListener('click', () => {
  let name = document.getElementById('preset-sel').value;
  if(name && presets[name]) mutate(() => { 
    const currLang = S.lang;
    S = JSON.parse(JSON.stringify(presets[name])); 
    S.lang = currLang;
    if(!S.moduleColors) S.moduleColors = {};
  });
});
document.getElementById('btn-del-preset').addEventListener('click', () => {
  let name = document.getElementById('preset-sel').value;
  if(name && presets[name]) { 
    delete presets[name]; 
    localStorage.setItem('ps1forge_presets', JSON.stringify(presets)); 
    updatePresetsUI(); 
  }
});

document.getElementById('shell-mode').addEventListener('change', update);

document.getElementById('in-user').addEventListener('input', e => { S.tUser = e.target.value; update(); });
document.getElementById('in-user').addEventListener('change', e => { mutate(() => { S.tUser = e.target.value; }); });
document.getElementById('in-host').addEventListener('input', e => { S.tHost = e.target.value; update(); });
document.getElementById('in-host').addEventListener('change', e => { mutate(() => { S.tHost = e.target.value; }); });
document.getElementById('chk-12h').addEventListener('change', e => { mutate(() => { S.is12h = e.target.checked; }); });

document.getElementById('copy-btn').addEventListener('click', () => {
  navigator.clipboard.writeText(document.getElementById('code-out').textContent).then(() => {
    const b = document.getElementById('copy-btn'); 
    b.textContent = I18N[S.lang].copied; 
    setTimeout(() => b.textContent = I18N[S.lang].copy, 2000);
  });
});

document.getElementById('random-btn').addEventListener('click', () => {
  mutate(() => {
    S.frame = FRAMES[Math.random()*FRAMES.length|0].id;
    S.sym = SYMBOLS[Math.random()*SYMBOLS.length|0];
    S.sep = SEPARATORS[Math.random()*SEPARATORS.length|0];
    
    S.moduleColors = {};
    const isMonochrome = Math.random() > 0.5;
    const mainCol = COLORS[Math.random()*COLORS.length|0];
    const neutralCol = ['#ffffff', '#cccccc', '#aaaaaa', '#777777'][Math.random()*4|0];
    
    S.cMain = mainCol;
    S.cUser = isMonochrome ? mainCol : neutralCol;
    S.cHost = isMonochrome ? mainCol : neutralCol;
    S.cPath = isMonochrome ? mainCol : neutralCol;
    
    ALL_MODULES.forEach(m => S.active[m.id] = false);
    S.active.path = true;
    S.active.user = Math.random() > 0.3;
    
    const extras = ['git', 'time', 'venv', 'jobs', 'node', 'py', 'os', 'ip', 'date', 'dir', 'ram', 'load', 'bat'];
    const extraCount = Math.floor(Math.random() * 2) + 1; 
    for(let i=0; i<extraCount; i++) {
      let randExtra = extras[Math.random()*extras.length|0];
      S.active[randExtra] = true;
    }
    
    S.order = ['venv', 'node', 'py', 'date', 'time', 'user', 'os', 'ip', 'ram', 'load', 'bat', 'path', 'dir', 'git', 'jobs', 'exit'];
  });
});

document.getElementById('undo-btn').addEventListener('click', undoState);
document.addEventListener('keydown', (e) => { 
  if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undoState(); } 
});

// Boot
init();
bindPills('#frame-opts .pill', 'frame');
bindPills('#sym-opts .pill', 'sym');
bindPills('#sep-opts .pill', 'sep');
['cMain','cUser','cHost','cPath'].forEach(k => bindColors(k));
update();
