// =========================================
// PS1 FORGE - CONSTANTES Y DATOS
// Contiene las estructuras, iconos y colores disponibles.
// =========================================

const FRAMES = [
  { id: 'kali', name: 'Kali', type: 'line', chars: ['┌','─','└','─',''], u1:'(', u2:')' },
  { id: 'round', name: 'Round', type: 'line', chars: ['╭','─','╰','─',''], u1:'(', u2:')' },
  { id: 'double', name: 'Double', type: 'line', chars: ['╔','═','╚','═',''], u1:'(', u2:')' },
  { id: 'box', name: 'Box', type: 'line', chars: ['┌','─','└','─','┐'], u1:'[', u2:']' },
  { id: 'bubble', name: 'Bubble', type: 'line', chars: ['╭','·','╰','·','╮'], u1:'(', u2:')' },
  { id: 'fat', name: 'Fat Line', type: 'line', chars: ['┏','━','┗','━',''], u1:'(', u2:')' },
  { id: 'dots', name: 'Dots', type: 'line', chars: ['·','·','·','·',''], u1:'(', u2:')' },
  { id: 'dash', name: 'Dashed', type: 'line', chars: ['+','-','+','-',''], u1:'[', u2:']' },
  { id: 'corner', name: 'Corner', type: 'line', chars: ['⌞','─','↳','─',''], u1:'(', u2:')' },
  { id: 'waves2', name: 'Waves', type: 'line', chars: ['≈','≈','≈','≈',''], u1:'(', u2:')' },
  { id: 'crosses', name: 'Crosses', type: 'line', chars: ['+','+','+','+',''], u1:'[', u2:']' },
  { id: 'asterisks', name: 'Asterisks', type: 'line', chars: ['*','*','*','*',''], u1:'(', u2:')' },
  { id: 'fence', name: 'Fence', type: 'line', chars: ['|','═','|','═','|'], u1:'(', u2:')' },
  { id: 'nodes', name: 'Nodes', type: 'line', chars: ['⚬','─','⚬','─',''], u1:'(', u2:')' },
  { id: 'triangles', name: 'Triangles', type: 'line', chars: ['▼','─','▶','─',''], u1:'(', u2:')' },

  { id: 'chevron', name: 'Chevron', type: 'free-text', build: (c,m,arr) => arr.join(c(m, ' ► ')) },
  { id: 'brackets2', name: 'Japanese', type: 'free-text', build: (c,m,arr) => arr.map(x=>c(m,'【')+x+c(m,'】')).join('') },
  { id: 'slashes', name: 'Slashes', type: 'free-text', build: (c,m,arr) => arr.join(c(m, ' // ')) },
  { id: 'hash', name: 'Hash Block', type: 'free-text', build: (c,m,arr) => c(m,'# ') + arr.join(c(m, ' # ')) + c(m,' #') },
  { id: 'percent', name: 'Percent', type: 'free-text', build: (c,m,arr) => c(m,'% ') + arr.join(c(m, ' % ')) + c(m,' %') },
  { id: 'ampersand', name: 'Ampersand', type: 'free-text', build: (c,m,arr) => arr.join(c(m, ' & ')) },
  { id: 'zigzag', name: 'ZigZag', type: 'free-text', build: (c,m,arr) => c(m,'/\\/\\ ') + arr.join(c(m, ' /\\/\\ ')) + c(m,' /\\/\\') },
  { id: 'cyberpunk', name: 'Cyberpunk', type: 'free-text', build: (c,m,arr) => arr.map(x=>c(m,'[̲̅ ')+x+c(m,' ]̲̅')).join(c(m,' ▻ ')) },
  { id: 'matrix', name: 'Matrix', type: 'free-text', build: (c,m,arr) => c(m,'010 ') + arr.join(c(m, ' 101 ')) + c(m,' 010') },
  { id: 'csv', name: 'CSV', type: 'free-text', build: (c,m,arr) => arr.join(c(m, ',')) },
  { id: 'cards', name: 'Cards', type: 'free-text', build: (c,m,arr) => arr.map(x=>c(m,'[ ')+x+c(m,' ]')).join(' ') },
  { id: 'pill', name: 'Pill', type: 'free-text', build: (c,m,arr) => c(m,'(') + arr.join(c(m, ' | ')) + c(m,')') },
  { id: 'tag', name: 'XML Tag', type: 'free-text', build: (c,m,arr) => arr.map(x=>c(m,'<')+x+c(m,'>')).join(' ') },

  { id: 'arch', name: 'Arch', type: 'text', build: (c, m, v, t, uh, p, g) => `${v?v+' ':''}${t?t+' ':''}${c(m,'[')}${uh?uh+' ':''}${p}${c(m,']')}${g}` },
  { id: 'ubuntu', name: 'Ubuntu', type: 'text', build: (c, m, v, t, uh, p, g) => `${v?v+' ':''}${t?t+' ':''}${uh?uh+c(m,':'):''}${p}${g}` },
  { id: 'debian', name: 'Debian', type: 'text', build: (c, m, v, t, uh, p, g) => `${v?v+' ':''}${t?t+' ':''}${uh?c(m,'(')+uh+c(m,') '):''}${p}${g}` },
  { id: 'mac', name: 'macOS', type: 'text', build: (c, m, v, t, uh, p, g) => `${v?v+' ':''}${t?t+' ':''}${uh?c(m,S.tHost||'MacBook-Pro')+c(m,':'):''}${p}${uh?' '+c(m,S.tUser||'user'):''}${g}` },
  { id: 'pure', name: 'Pure', type: 'text', build: (c, m, v, t, uh, p, g) => `${v?v+' ':''}${t?t+' ':''}${p}${g}\\n` },
  { id: 'arrow', name: 'Arrow', type: 'text', build: (c, m, v, t, uh, p, g) => `${v?v+' ':''}${t?t+' ':''}${c(m,'──▶ ')}${uh?uh+' ':''}${p}${g}\\n    ` },
  { id: 'minimal2', name: 'Minimal 2L', type: 'text', build: (c, m, v, t, uh, p, g) => `${v?v+' ':''}${t?t+' ':''}${uh?uh+' ':''}${g}\\n${p} ` },
  { id: 'dos', name: 'DOS Retro', type: 'text', build: (c, m, v, t, uh, p, g) => `${v?v+' ':''}${t?t+' ':''}${c(m,'C:\\> ')}${p}${g}` },
  { id: 'blocky', name: 'Blocky', type: 'text', build: (c, m, v, t, uh, p, g) => `${v?v+' ':''}${t?t+' ':''}${c(m,'█▓▒░ ')}${uh?uh+' ':''}${c(m,'░▒▓█ ')}${p}${c(m,' █▓▒░')}${g}\\n${c(m,'█ ')}` },
  { id: 'slant', name: 'Slant', type: 'text', build: (c, m, v, t, uh, p, g) => `${v?v+' ':''}${t?t+' ':''}${c(m,'◢ ')}${uh?uh+c(m,' ◣ ◢ '):''}${p}${c(m,' ◣')}${g}\\n${c(m,'◥ ')}` },
  { id: 'bracket', name: 'Bracket', type: 'text', build: (c, m, v, t, uh, p, g) => `${v?v+' ':''}${t?t+' ':''}${c(m,'{')}${uh?uh+' ':''}${p}${c(m,'}')}${g}` },
  { id: 'terminal', name: 'Terminal', type: 'text', build: (c, m, v, t, uh, p, g) => `${v?v+' ':''}${t?t+' ':''}${c(m,'Terminal [')}${uh?uh+' ':''}${p}${c(m,']')}${g}\\n${c(m,'>_ ')}` },
  { id: 'starship', name: 'Semantic', type: 'text', build: (c, m, v, t, uh, p, g) => `${v?v+' ':''}${t?t+' ':''}${c(m,'in ')}${p}${uh?c(m,' as ')+uh:''}${g}` },
  { id: 'code', name: 'JS Code', type: 'text', build: (c, m, v, t, uh, p, g) => `${c(m,'const PS1 = {')}${uh?c(m,' user: "')+uh+c(m,'",'):''}${c(m,' path: "')}${p}${c(m,'" };')}${g}\\n` },
  { id: 'sql', name: 'SQL Query', type: 'text', build: (c, m, v, t, uh, p, g) => `${c(m,'SELECT ')}${p}${uh?c(m,' FROM ')+uh:''}${c(m,';')}${g}\\n` },
  { id: 'json', name: 'JSON', type: 'text', build: (c, m, v, t, uh, p, g) => `${c(m,'{')}${uh?c(m,'"user":"')+uh+c(m,'", '):''}${c(m,'"path":"')}${p}${c(m,'"}')}${g}\\n` },
  { id: 'url', name: 'SSH URL', type: 'text', build: (c, m, v, t, uh, p, g) => `${c(m,'ssh://')}${uh?uh+c(m,'@'):''}${c(m,'localhost')}${p}${g}` },
  { id: 'math', name: 'Math Func', type: 'text', build: (c, m, v, t, uh, p, g) => `${uh?uh:c(m,'f')}${c(m,'(')}${p}${c(m,') = ?')}${g}\\n` },
  { id: 'dict', name: 'Python Dict', type: 'text', build: (c, m, v, t, uh, p, g) => `${uh?uh:c(m,'env')}${c(m,'["')}${p}${c(m,'"]')}${c(m,':')}${g}\\n` },
  { id: 'markdown', name: 'Markdown', type: 'text', build: (c, m, v, t, uh, p, g) => `${v?c(m,'> ')+v+'\\n':''}${uh?c(m,'# ')+uh+'\\n':''}${c(m,'## ')}${p}${g}\\n` },
  { id: 'rust', name: 'Rust Macro', type: 'text', build: (c, m, v, t, uh, p, g) => `${c(m,'println!("')}${uh?uh+c(m,' at '):''}${p}${c(m,'");')}${g}\\n` },
  { id: 'go', name: 'Go Func', type: 'text', build: (c, m, v, t, uh, p, g) => `${c(m,'func ')}${uh?uh:c(m,'main')}${c(m,'() { // ')}${p}${g}\\n` },
  { id: 'stairs', name: 'Stairs', type: 'text', build: (c, m, v, t, uh, p, g) => `${v?c(m,'_ ')+v+'\\n':''}${t?c(m,'  _ ')+t+'\\n':''}${uh?c(m,'    _ ')+uh+'\\n':''}${c(m,'      _ ')}${p}${g}\\n` }
];

const COLORS = [
  '#ffffff', '#cccccc', '#aaaaaa', '#777777', '#555555',
  '#ff5f5f', '#d70000', '#af0000', '#ff8787', '#ff00af', '#d70087', '#ff5faf',
  '#5fff5f', '#00d700', '#00af00', '#005f00', '#87ff87', '#87ffaf',
  '#5fafff', '#005fdf', '#87d7ff', '#005f87', '#5f5fd7', '#5f5fff', '#00005f', '#87afff',
  '#ffff5f', '#ffff00', '#ffaf00', '#ff5f00', '#ff8700', '#ff875f', '#af8700', '#afaf00', '#d7af87',
  '#ff5fff', '#ff00ff', '#af5fff', '#af87ff', '#d7afff', '#d7d7ff', '#5fffff', '#00d7af'
];

const ANSI_MAP = {
  '#ffffff': '38;5;255', '#cccccc': '38;5;252', '#aaaaaa': '38;5;248', '#777777': '38;5;243', '#555555': '38;5;240',
  '#ff5f5f': '38;5;203', '#d70000': '38;5;160', '#af0000': '38;5;124', '#ff8787': '38;5;210', '#ff00af': '38;5;199', '#d70087': '38;5;162', '#ff5faf': '38;5;205',
  '#5fff5f': '38;5;83',  '#00d700': '38;5;40',  '#00af00': '38;5;34',  '#005f00': '38;5;22',  '#87ff87': '38;5;120', '#87ffaf': '38;5;121',
  '#5fafff': '38;5;75',  '#005fdf': '38;5;26',  '#87d7ff': '38;5;117', '#005f87': '38;5;24',  '#5f5fd7': '38;5;62',  '#5f5fff': '38;5;63',  '#00005f': '38;5;17', '#87afff': '38;5;111',
  '#ffff5f': '38;5;227', '#ffff00': '38;5;226', '#ffaf00': '38;5;214', '#ff5f00': '38;5;202', '#ff8700': '38;5;208', '#ff875f': '38;5;209', '#af8700': '38;5;136', '#afaf00': '38;5;142', '#d7af87': '38;5;180',
  '#ff5fff': '38;5;207', '#ff00ff': '38;5;201', '#af5fff': '38;5;135', '#af87ff': '38;5;141', '#d7afff': '38;5;183', '#d7d7ff': '38;5;189', '#5fffff': '38;5;87',  '#00d7af': '38;5;43'
};

const SYMBOLS = [
  'λ','❯','➜','⚡','◆','$','#','>','➤','»','▶','⇒','✓','♠','☮','⇛','▷','♔','☯','✦',
  '⬢','⬣','🤖','👾','🚀','🛸','🔥','👁','☢','☣','☠','⚙','⚔','⚜','⚑','⛩','⚓','⚖','⏳','💡',
  '░','▒','▓','█','▲','▼','◄','►','◈','◎','◉','◌','●','◖','◗','◢','◣','◤','◥','◿',
  '🐧','🍎','💻','🖥️','💾','🐍','🦀','🐳','🐱','🦊','🐉','🌙','⭐','☀️','🪐','☄️','✨','🔮','🧿','∑',
  '∆','Ω','∞','≡','≠','⊕','⊗','⇢','↵','⇌','✗','✘','✔','無','空','龍','鬼','神','†','‡'
];

const SEPARATORS = [
  '㉿','@','⨳','▸','⨯','·','|','/','-','∿','*','::','→','⇔','♦','⚡','🔪','💀','☢','⚙',
  '¦','‖','│','┃','║','┇','┋','\\','//','\\\\','•','○','◘','◙','&','+','=','^','v','≈',
  '','','','','','','','' 
];

const ALL_MODULES = [
  { id: 'venv', es_name: '🐍 Venv', en_name: '🐍 Venv' },
  { id: 'node', es_name: '🟩 Node', en_name: '🟩 Node' },
  { id: 'py',   es_name: '🐍 Python', en_name: '🐍 Python' },
  { id: 'date', es_name: '📅 Fecha', en_name: '📅 Date' },
  { id: 'time', es_name: '🕐 Hora', en_name: '🕐 Time' },
  { id: 'user', es_name: '👤 User/Host', en_name: '👤 User/Host' },
  { id: 'path', es_name: '📁 Ruta (Full)', en_name: '📁 Path (Full)' },
  { id: 'dir',  es_name: '📂 Carpeta', en_name: '📂 Folder' },
  { id: 'git',  es_name: '🌿 Git', en_name: '🌿 Git' },
  { id: 'ip',   es_name: '🌐 IP', en_name: '🌐 IP' },
  { id: 'os',   es_name: '💻 OS/Kernel', en_name: '💻 OS/Kernel' },
  { id: 'ram',  es_name: '🧠 RAM', en_name: '🧠 RAM' },
  { id: 'load', es_name: '🔥 CPU Load', en_name: '🔥 CPU Load' },
  { id: 'bat',  es_name: '🔋 Batería', en_name: '🔋 Battery' },
  { id: 'jobs', es_name: '⚙ Jobs', en_name: '⚙ Jobs' },
  { id: 'exit', es_name: '✓ Exit', en_name: '✓ Exit' }
];

const I18N = {
  es: {
    subtitle: "Zsh/Bash support, EzPrompt blocks, Light/Dark mode y persistencia local.",
    topo: "01. Estructura Topológica",
    symsep: "02. Símbolos & Separadores",
    colors: "03. Paletas de Color",
    cmain: "Principal",
    cpath: "Ruta",
    cuser: "Usuario",
    chost: "Host",
    builder: "04. Constructor Visual (Estilo EzPrompt)",
    activemods: "Módulos Activos (Arrastra para ordenar)",
    availmods: "Módulos Disponibles (Clic para añadir)",
    addtext: "+ Añadir Texto Personalizado",
    userph: "Custom User (dejar vacío para auto)",
    hostph: "Custom Host (dejar vacío para auto)",
    presets: "05. Gestor de Presets",
    save: "Guardar",
    load: "Cargar",
    prevtitle: "Preview Terminal",
    expbash: "Exportar a BASH",
    expzsh: "Exportar a ZSH",
    codeout: "Código Exportado",
    copy: "COPIAR CÓDIGO",
    copied: "¡COPIADO!",
    rand: "🎲 RANDOMIZE",
    footerr: '"El código trabaja mientras tú duermes."',
    nopresets: "Sin presets guardados",
    customText: "Texto...",
    styles: "ESTILOS",
    icons: "ICONOS",
    time12h: "Formato 12h (AM/PM)"
  },
  en: {
    subtitle: "Zsh/Bash support, EzPrompt blocks, Light/Dark mode and local persistence.",
    topo: "01. Topological Structure",
    symsep: "02. Symbols & Separators",
    colors: "03. Color Palettes",
    cmain: "Primary",
    cpath: "Path",
    cuser: "User",
    chost: "Host",
    builder: "04. Visual Builder (EzPrompt Style)",
    activemods: "Active Modules (Drag to reorder)",
    availmods: "Available Modules (Click to add)",
    addtext: "+ Add Custom Text",
    userph: "Custom User (leave empty for auto)",
    hostph: "Custom Host (leave empty for auto)",
    presets: "05. Preset Manager",
    save: "Save",
    load: "Load",
    prevtitle: "Terminal Preview",
    expbash: "Export to BASH",
    expzsh: "Export to ZSH",
    codeout: "Exported Code",
    copy: "COPY CODE",
    copied: "COPIED!",
    rand: "🎲 RANDOMIZE",
    footerr: '"Code works while you sleep."',
    nopresets: "No saved presets",
    customText: "Text...",
    styles: "STYLES",
    icons: "ICONS",
    time12h: "12h Format (AM/PM)"
  }
};
