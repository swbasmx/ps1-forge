// =========================================
// PS1 FORGE - LÓGICA PRINCIPAL (APP.JS)
// =========================================

// =====================
// ESTADO GLOBAL (S)
// =====================
// S es la fuente única de la verdad (Single Source of Truth).
// Todo lo que el usuario modifica se guarda aquí, y la UI se pinta según este objeto.
let S = {
  frame: 'kali', 
  sym: 'λ', 
  sep: '㉿',
  cMain: '#00d7af', 
  cUser: '#aaaaaa', 
  cHost: '#aaaaaa', 
  cPath: '#ffffff',
  order: ['venv', 'node', 'date', 'time', 'user', 'path', 'dir', 'git', 'ip', 'os', 'jobs', 'exit'],
  active: { user: true, path: true, git: false, time: false, venv: false, jobs: false, exit: false, date: false, dir: false, node: false, os: false, ip: false },
  customTexts: {}, // Almacena el texto de los módulos personalizados (ej: cust_123: "Hola")
  tUser: '', // Usuario customizado, si lo hay
  tHost: ''  // Host customizado, si lo hay
};

// Historial para el Undo (Ctrl+Z)
let historyStack = [];
// Presets guardados por el usuario
let presets = {};

// =====================
// PERSISTENCIA
// =====================
// Guarda el estado actual en el historial y en localStorage
function saveState() {
  historyStack.push(JSON.parse(JSON.stringify(S)));
  if (historyStack.length > 50) historyStack.shift(); // Límite de 50 undos
  document.getElementById('undo-btn').disabled = false;
  localStorage.setItem('ps1forge_state', JSON.stringify(S));
}

// Deshace el último cambio
function undoState() {
  if (historyStack.length > 0) {
    S = historyStack.pop();
    localStorage.setItem('ps1forge_state', JSON.stringify(S));
    updateUIFromState(); // Actualiza los botones
    update(); // Genera el nuevo Bash
    if (historyStack.length === 0) document.getElementById('undo-btn').disabled = true;
  }
}

// Función wrapper (Envoltorio) para cualquier cambio de estado
// Guarda historial ANTES del cambio, ejecuta el cambio, y repinta TODO.
function mutate(fn) {
  saveState(); 
  fn(); 
  updateUIFromState(); 
  update();
  localStorage.setItem('ps1forge_state', JSON.stringify(S));
}

// =====================
// INICIALIZACIÓN (BOOT)
// =====================
function init() {
  // 1. Cargar preferencias visuales guardadas
  if(localStorage.getItem('ps1forge_theme') === 'light') document.body.classList.add('light');
  
  // 2. Cargar Presets
  presets = JSON.parse(localStorage.getItem('ps1forge_presets') || '{"Default": null}');
  
  // 3. Cargar el estado anterior si existe (Persistencia de recarga de página)
  try { 
    const saved = localStorage.getItem('ps1forge_state'); 
    if(saved) S = JSON.parse(saved); 
  } catch(e){}

  // 4. Inyectar botones HTML basados en la configuración de data.js
  const fOpts = document.getElementById('frame-opts');
  FRAMES.forEach(f => { fOpts.innerHTML += `<button class="pill" data-frame="${f.id}">${f.name}</button>`; });
  
  const sOpts = document.getElementById('sym-opts');
  SYMBOLS.forEach(s => { sOpts.innerHTML += `<button class="pill" data-sym="${s}">${s}</button>`; });

  const spOpts = document.getElementById('sep-opts');
  SEPARATORS.forEach(s => { spOpts.innerHTML += `<button class="pill" data-sep="${s}">${s}</button>`; });

  // Inyectar paletas de colores
  ['cMain','cUser','cHost','cPath'].forEach(key => {
    const el = document.getElementById('cp-' + key.replace('c','').toLowerCase());
    COLORS.forEach(c => {
      el.innerHTML += `<div class="c-dot" data-${key}="${c}" style="background:${c}"></div>`;
    });
  });

  // 5. Inicializar el Drag & Drop (Constructor EzPrompt)
  initDnD();
  updatePresetsUI();
  updateUIFromState();
}

// Repinta la lista de select del gestor de presets
function updatePresetsUI() {
  const sel = document.getElementById('preset-sel');
  sel.innerHTML = '';
  Object.keys(presets).forEach(k => {
    if(k !== 'Default') sel.innerHTML += `<option value="${k}">${k}</option>`;
  });
  if(sel.options.length === 0) sel.innerHTML = '<option value="">Sin presets guardados</option>';
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
    // Si es un módulo de texto personalizado
    if (id.startsWith('cust_')) {
      if(!S.active[id]) return; // Si está borrado, saltarlo
      const div = document.createElement('div');
      div.className = 'drag-pill active';
      div.draggable = true;
      div.innerHTML = `
        <input type="text" value="${esc(S.customTexts[id]||'')}" placeholder="Texto..." 
               style="background:transparent;border:none;color:inherit;width:80px;font-family:inherit;outline:none;" 
               onchange="mutate(()=>{S.customTexts['${id}']=this.value})" 
               onclick="event.stopPropagation()"/> 
        <span style="cursor:pointer;color:#ff5f5f;margin-left:4px" 
              onclick="mutate(()=>{delete S.active['${id}'];S.order=S.order.filter(x=>x!=='${id}')})">×</span>
      `;
      div.ondragstart = (e) => { e.dataTransfer.setData('text/plain', id); div.classList.add('dragging'); };
      div.ondragend = () => div.classList.remove('dragging');
      activeDiv.appendChild(div);
      return;
    }

    // Si es un módulo estándar (Venv, Path, Git, etc)
    const mod = ALL_MODULES.find(x => x.id === id);
    if (!mod) return;
    
    const div = document.createElement('div');
    div.className = 'drag-pill';
    div.textContent = mod.name;
    
    // Asignar al panel activo o inactivo según el estado
    if (S.active[id]) {
      div.draggable = true; 
      div.classList.add('active'); 
      div.title = "Clic para ocultar";
      div.onclick = () => mutate(() => S.active[id] = false);
      div.ondragstart = (e) => { e.dataTransfer.setData('text/plain', id); div.classList.add('dragging'); };
      div.ondragend = () => div.classList.remove('dragging');
      activeDiv.appendChild(div);
    } else {
      div.title = "Clic para añadir";
      div.onclick = () => mutate(() => S.active[id] = true);
      availDiv.appendChild(div);
    }
  });
}

// Inicializa los Eventos HTML5 Drag & Drop
function initDnD() {
  const activeDiv = document.getElementById('ez-active');
  
  activeDiv.addEventListener('dragover', e => {
    e.preventDefault(); // Permitir el Drop
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
    
    // Reconstruimos el array order leyendo el DOM
    activeDiv.childNodes.forEach(node => {
      if(node.querySelector('input')) { // Es un módulo Custom Text
        const val = node.querySelector('input').value;
        const id = Object.keys(S.customTexts).find(k => S.customTexts[k] === val && S.active[k]);
        if(id) finalOrder.push(id);
      } else { // Es un módulo estándar
        const mod = ALL_MODULES.find(m => m.name === node.textContent.trim());
        if(mod) finalOrder.push(mod.id);
      }
    });
    
    // Los inactivos los mandamos al final
    S.order.forEach(id => { 
      if(!finalOrder.includes(id) && !id.startsWith('cust_')) finalOrder.push(id); 
    });
    
    mutate(() => { S.order = finalOrder; });
  });
}

// Utilidad para calcular dónde soltar la píldora en Drag&Drop
function getDragAfterElement(container, x) {
  const draggableElements = [...container.querySelectorAll('.drag-pill.active:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = x - box.left - box.width / 2;
    if (offset < 0 && offset > closest.offset) return { offset: offset, element: child };
    else return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Repinta visualmente qué botones están seleccionados
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
  
  renderEzPrompt();
}

// =====================
// MOTOR DE GENERACIÓN (BUILDER)
// =====================

// Escapa inyecciones HTML en el Preview
function esc(s) { return s.replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// Toma la configuración actual (S) y devuelve o bien código HTML (para el preview) o código Bash/Zsh.
function build(mode) {
  const mC = S.cMain, uC = S.cUser, hC = S.cHost, pC = S.cPath;
  
  // Envoltorios de color dependiendo de a qué compilamos
  const span = (color, text) => `<span style="color:${color}">${esc(text)}</span>`;
  const bash = (color, text) => `\\[\\e[${ANSI_MAP[color]}m\\]${text}`;
  const zsh  = (color, text) => `%{\\e[${ANSI_MAP[color]}m%}${text}`;
  
  const c = (col, txt) => mode === 'bash' ? bash(col, txt) : (mode === 'zsh' ? zsh(col, txt) : span(col, txt));
  const def = mode === 'bash' ? '\\[\\e[0m\\]' : (mode === 'zsh' ? '%{\\e[0m%}' : '');
  
  // Mapeo de variables nativas dependiendo del sistema (BASH vs ZSH)
  let env = mode==='bash' ? `\\$([ -n "$VIRTUAL_ENV" ]&&echo "$(basename $VIRTUAL_ENV)")` : (mode==='zsh' ? `$(basename $VIRTUAL_ENV)` : `env`);
  let dt  = mode==='bash' ? `\\d` : (mode==='zsh' ? `%D` : `Tue May 08`);
  let tm  = mode==='bash' ? `\\A` : (mode==='zsh' ? `%*` : `14:30`);
  let us  = mode==='bash' ? `\\u` : (mode==='zsh' ? `%n` : (S.tUser || 'user'));
  let hs  = mode==='bash' ? `\\h` : (mode==='zsh' ? `%m` : (S.tHost || 'host'));
  let pt  = mode==='bash' ? `\\w` : (mode==='zsh' ? `%~` : `~/dev`);
  let di  = mode==='bash' ? `\\W` : (mode==='zsh' ? `%1~` : `dev`);
  
  let ndRaw = mode==='bash' || mode==='zsh' ? `\\$(node -v 2>/dev/null)` : `v20.0.0`;
  let osRaw = mode==='bash' || mode==='zsh' ? `\\$(uname -r)` : `6.1.0-kali`;
  let ipRaw = mode==='bash' || mode==='zsh' ? `\\$(hostname -I 2>/dev/null | awk '{print $1}')` : `192.168.1.100`;
  
  let envC = c(mC, env); let dtC = c(mC, dt); let tmC = c(mC, tm); 
  let usC = c(uC, us); let hsC = c(hC, hs); 
  let ptC = c(pC, pt); let diC = c(pC, di);
  let ndC = c(mC, ndRaw); let osC = c(mC, osRaw); let ipC = c(mC, ipRaw);
  
  // Unión de User y Host
  let userHostStr = usC + (S.sep === '@' || FRAMES.find(x=>x.id===S.frame).id === 'ubuntu' ? c(mC, S.sep) : c(mC, ' ' + S.sep + ' ')) + hsC;
  
  // Comandos más complejos
  let gtRaw = mode==='bash' ? `\\$(git branch 2>/dev/null|grep '^*'|colrm 1 2|xargs -I{} echo " git:({})")` : (mode==='zsh' ? `$(git branch 2>/dev/null | grep '^*' | colrm 1 2 | xargs -I{} echo " git:({})")` : ` git:(main)`);
  let jbRaw = mode==='bash' ? `\\$(j=$(jobs|wc -l);[ $j -gt 0 ]&&echo "[$j] ")` : (mode==='zsh' ? `%(1j.[%j] .)` : `[1] `);
  let exRaw = mode==='bash' ? `\\$([ $? = 0 ]&&echo "\\[\\e[38;5;83m\\]✓ "||echo "\\[\\e[38;5;203m\\]✗ ")` : (mode==='zsh' ? `%(?.%{\\e[38;5;83m%}✓ .%{\\e[38;5;203m%}✗ )` : `<span style="color:#5f5">✓ </span>`);
  
  let gtC = c(mC, gtRaw); let jbC = c(mC, jbRaw); let exStr = exRaw;
  let symC = c(mC, S.sym + ' ');
  
  // Array de bloques lógicos ordenados por el usuario
  let activeBlocks = [];
  let showJobs = S.active.jobs; 
  let showExit = S.active.exit;
  
  S.order.forEach(k => {
    if(!S.active[k]) return;
    if(k==='venv') activeBlocks.push({ id:'venv', str: envC });
    if(k==='node') activeBlocks.push({ id:'node', str: ndC });
    if(k==='date') activeBlocks.push({ id:'date', str: dtC });
    if(k==='time') activeBlocks.push({ id:'time', str: tmC });
    if(k==='user') activeBlocks.push({ id:'user', str: userHostStr });
    if(k==='path') activeBlocks.push({ id:'path', str: ptC });
    if(k==='dir')  activeBlocks.push({ id:'dir',  str: diC });
    if(k==='git')  activeBlocks.push({ id:'git',  str: gtC });
    if(k==='ip')   activeBlocks.push({ id:'ip',   str: ipC });
    if(k==='os')   activeBlocks.push({ id:'os',   str: osC });
    if(k.startsWith('cust_')) activeBlocks.push({ id:'custom', str: c(mC, S.customTexts[k]) });
  });

  const f = FRAMES.find(x => x.id === S.frame);
  let l1 = '', l2 = '';

  // 1. Marcos de TIPO LINEA (Usan los caracteres conectores de arriba a abajo)
  if (f.type === 'line') {
    let parts = activeBlocks.map(b => {
      if(b.id === 'git' || b.id === 'custom') return b.str;
      if(b.id === 'venv') return c(mC, '(') + b.str + c(mC, ')');
      if(b.id === 'time') return c(mC, '[') + b.str + c(mC, ']');
      if(b.id === 'path') return c(mC, '[') + b.str + c(mC, ']');
      if(b.id === 'user') return c(mC, f.u1||'(') + b.str + c(mC, f.u2||')');
      return b.str;
    });
    
    let joiner = c(mC, f.chars[1]);
    l1 = c(mC, f.chars[0]) + c(mC, f.chars[1]) + parts.join(joiner);
    
    if (f.chars[4] && parts.length > 0) l1 += joiner + c(mC, f.chars[4]);
    else if (parts.length === 0) l1 = c(mC, f.chars[0]) + c(mC, f.chars[1]);
    
    l2 = c(mC, f.chars[2]) + c(mC, f.chars[3]) + (showJobs?jbC:'') + (showExit?exStr:'') + symC;
    
  } 
  // 2. Marcos de TEXTO LIBRE (Ej: Matrices, csv, separar por un pipe)
  else if (f.type === 'free-text') {
    let joined = f.build(c, mC, activeBlocks.map(b=>b.str));
    let lines = joined.split('\\n');
    l1 = lines[0]; l2 = lines[1] || '';
    if (l2) l2 += (showJobs?jbC:'') + (showExit?exStr:'') + symC; else l1 += ' ' + (showJobs?jbC:'') + (showExit?exStr:'') + symC;
    
  } 
  // 3. Marcos ESTRICTOS/FIJOS (Tienen posiciones ya decididas, respeta su render original)
  else {
    let res = f.build(c, mC, S.active.venv?envC:'', S.active.time?tmC:'', S.active.user?userHostStr:'', S.active.path?ptC:'', S.active.git?gtC:'');
    let lines = res.split('\\n');
    l1 = lines[0]; l2 = lines[1] || '';
    if (l2) l2 += (showJobs?jbC:'') + (showExit?exStr:'') + symC; else l1 += ' ' + (showJobs?jbC:'') + (showExit?exStr:'') + symC;
  }
  
  // Retorna string si es terminal, u objeto si es UI
  if (mode !== 'html') {
    let finalStr = `${l1}${l2 ? '\\n'+l2 : ''}${def}`;
    return mode === 'bash' ? `PS1="${finalStr}"` : `PROMPT=$'${finalStr}'`;
  }
  return {l1, l2};
}

// Ejecuta Build de UI y Build de Terminal, e inyecta al DOM
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

// Tema Claro / Oscuro
document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('ps1forge_theme', document.body.classList.contains('light') ? 'light' : 'dark');
});

// Botón: Añadir Texto Personalizado
document.getElementById('btn-add-cust').addEventListener('click', () => {
  mutate(() => {
    const id = 'cust_' + Date.now();
    S.customTexts[id] = 'Texto';
    S.active[id] = true;
    S.order.push(id);
  });
});

// Botones de Preset
document.getElementById('btn-save-preset').addEventListener('click', () => {
  let name = prompt("Nombre del preset:");
  if(name) { 
    presets[name] = JSON.parse(JSON.stringify(S)); 
    localStorage.setItem('ps1forge_presets', JSON.stringify(presets)); 
    updatePresetsUI(); 
  }
});
document.getElementById('btn-load-preset').addEventListener('click', () => {
  let name = document.getElementById('preset-sel').value;
  if(name && presets[name]) mutate(() => { S = JSON.parse(JSON.stringify(presets[name])); });
});
document.getElementById('btn-del-preset').addEventListener('click', () => {
  let name = document.getElementById('preset-sel').value;
  if(name && presets[name] && confirm(`¿Borrar preset ${name}?`)) { 
    delete presets[name]; 
    localStorage.setItem('ps1forge_presets', JSON.stringify(presets)); 
    updatePresetsUI(); 
  }
});

// Toggle Bash / Zsh
document.getElementById('shell-mode').addEventListener('change', update);

// Inputs texto
document.getElementById('in-user').addEventListener('input', e => { S.tUser = e.target.value; update(); });
document.getElementById('in-user').addEventListener('change', e => { mutate(() => { S.tUser = e.target.value; }); });
document.getElementById('in-host').addEventListener('input', e => { S.tHost = e.target.value; update(); });
document.getElementById('in-host').addEventListener('change', e => { mutate(() => { S.tHost = e.target.value; }); });

// Botón Copiar Código
document.getElementById('copy-btn').addEventListener('click', () => {
  navigator.clipboard.writeText(document.getElementById('code-out').textContent).then(() => {
    const b = document.getElementById('copy-btn'); 
    b.textContent = '¡COPIADO!'; 
    setTimeout(() => b.textContent = 'COPIAR CÓDIGO', 2000);
  });
});

// Botón RAMDOMIZE
document.getElementById('random-btn').addEventListener('click', () => {
  mutate(() => {
    S.frame = FRAMES[Math.random()*FRAMES.length|0].id;
    S.sym = SYMBOLS[Math.random()*SYMBOLS.length|0];
    S.sep = SEPARATORS[Math.random()*SEPARATORS.length|0];
    S.cMain = COLORS[Math.random()*COLORS.length|0];
    S.cUser = COLORS[Math.random()*COLORS.length|0];
    S.cHost = COLORS[Math.random()*COLORS.length|0];
    S.cPath = COLORS[Math.random()*COLORS.length|0];
    ALL_MODULES.forEach(m => S.active[m.id] = Math.random() > 0.4);
    S.active.path = true; // El path siempre visible por sanity check
    S.order = [...ALL_MODULES.map(m=>m.id)].sort(() => Math.random() - 0.5);
  });
});

// Undo manual o con Ctrl+Z
document.getElementById('undo-btn').addEventListener('click', undoState);
document.addEventListener('keydown', (e) => { 
  if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undoState(); } 
});

// =====================
// ARRANQUE (BOOT)
// =====================
init();
bindPills('#frame-opts .pill', 'frame');
bindPills('#sym-opts .pill', 'sym');
bindPills('#sep-opts .pill', 'sep');
['cMain','cUser','cHost','cPath'].forEach(k => bindColors(k));
update();
