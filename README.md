# ⚡ PS1 FORGE

> Un constructor visual de prompts de Bash (PS1) con estética brutalista, 50 marcos topológicos, coloreado independiente y motor interactivo de arrastrar y soltar.

[![GitHub license](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![Vanilla JS](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)

## 🎥 Project Demo
👉 **[Ver Demo en Vivo](https://ps1-forge.vercel.app/)**

## 📸 Demo Interactivo
<video src="https://raw.githubusercontent.com/swbasmx/ps1-forge/main/.assets/demo.webm" width="100%" autoplay loop muted controls></video>

## ✨ Features
- **50 Marcos Topológicos Absolutos:** Desde diseños clásicos de terminal (`Kali`, `Ubuntu`, `macOS`) hasta estilos creativos y semánticos (`JS Code`, `SQL Query`, `Cyberpunk`, `Matrix`).
- **Constructor Visual (EzPrompt Style):** Interfaz de Arrastrar y Soltar (Drag & Drop) para reordenar dinámicamente los módulos de tu prompt (`Hora`, `Ruta`, `Usuario`, `Git`, `Jobs`, `Venv`).
- **Paleta de Colores Curada:** 43 colores ANSI (Neones, pasteles, oscuros) con selectores independientes para el texto principal, la ruta, el host y el usuario.
- **Arsenal de Íconos:** Más de 100 símbolos (Kanji, abstractos, tech) y 40 separadores de bloque.
- **Máquina del Tiempo:** Pila de historial integrada con soporte para deshacer cambios (`Ctrl+Z` o botón `↶`).
- **Exportación en Tiempo Real:** Genera la secuencia exacta de escape ANSI lista para inyectarse en tu archivo `~/.bashrc`.
- **Sin Dependencias (Zero-Build):** Todo el motor de renderizado y la lógica viven en un único archivo `HTML` con Vanilla JS y CSS.

## 💻 Installation Steps

Al no requerir Node.js ni bases de datos, instalarlo es instantáneo:

1. Clona este repositorio:
   ```bash
   git clone https://github.com/swbasmx/ps1-forge.git
   cd ps1-forge
   ```
2. Abre el archivo `index.html` en cualquier navegador web moderno (Brave, Chrome, Firefox).
   ```bash
   xdg-open index.html
   ```
3. Construye tu prompt visualmente.
4. Copia el código `export PS1="..."` generado y pégalo al final de tu archivo `~/.bashrc`.
5. Ejecuta `source ~/.bashrc` en tu terminal para aplicar los cambios.

## 🛠 Technologies Used
- HTML5 Semántico
- CSS3 (Variables nativas, Grid, Animaciones y Filtros SVG para ruido fractal)
- Vanilla JavaScript (ES6+)
- Interfaz HTML5 Drag & Drop nativa

## 🤝 Contribution Guidelines
¡Las contribuciones son extremadamente bienvenidas! Si quieres añadir más símbolos, una nueva paleta de colores, o inventar un marco estructural nuevo:
1. Haz un Fork del proyecto.
2. Crea tu rama de características (`git checkout -b feature/NuevoMarco`).
3. Haz un commit de tus cambios (`git commit -m 'Añadido marco futurista'`).
4. Haz push a la rama (`git push origin feature/NuevoMarco`).
5. Abre un Pull Request describiendo tus cambios.

## 📄 License
Este proyecto está bajo la Licencia MIT. Eres libre de usarlo, modificarlo y distribuirlo.

## 💬 Support
> *"El código trabaja mientras tú duermes."* — MX

Si encuentras algún bug (sobre todo con el renderizado de caracteres de escape en Bash) o tienes una sugerencia de diseño, por favor abre un [Issue](https://github.com/swbasmx/ps1-forge/issues).