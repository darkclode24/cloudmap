# CloudMap Design System: Scribble & Hand-Drawn Sketchbook

Welcome to the **CloudMap** design system. This system is designed around a **scribble, hand-drawn, and sketchy sketchbook** aesthetic. It bridges technical cloud engineering concepts with the comfortable, creative, and immediate feel of a personal study notebook or high-school blackboard.

---

## 1. Overview & Creative North Star: "The Student's Lab Notebook"

Our Creative North Star is **"The Student's Lab Notebook."** 
It represents active, hands-on learning—messy margins, handwritten equations, pencil-sketched diagrams, and bright highlighter markings. It emphasizes progress, experimentation, and a "learning-by-doing" attitude.

### Essential Rules:
- **No Perfect Lines**: Straight borders are prohibited. Elements must feel drawn by hand. We achieve this with custom `border-radius` slashes, uneven borders, and SVGs.
- **Paper Textures**:
  - **Light Mode**: Warm, ivory sketchbook paper (`#FCFAF7`) with faint blue notebook lines or light-gray graph lines.
  - **Dark Mode**: Charcoal blackboard/slate paper (`#1E1F22`) with chalky grid lines.
- **Ink & Marker Highlights**: Solid, highly visible ink outlines (`2px` to `3px` width) and colorful highlighter fills (translucent yellow, green, cyan) representing active or hover states.
- **Pencil Shadows**: Avoid soft radial gradients for shadows. Instead, use hard, offset, solid block shadows (e.g. `4px 4px 0px var(--ink-color)`) that look like hand-shaded depth.

---

## 2. Color Palette: "Ink, Highlighter & Chalk"

We pair the natural colors of pencil, ink, and highlighting markers.

### Custom Variables

| Variable | Light Mode (Sketchbook) | Dark Mode (Blackboard) | Description |
|---|---|---|---|
| `--bg-paper` | `#FBF8F3` (warm ivory) | `#1A1B1E` (dark charcoal) | Main canvas background |
| `--border-color` | `#2D2F34` (ink black) | `#E2E8F0` (chalk white) | Main outlines and text |
| `--ink-pencil` | `#4B5563` (pencil gray) | `#94A3B8` (dusty slate) | Secondary text and notes |
| `--marker-yellow` | `rgba(253, 224, 71, 0.4)` (yellow highlighter) | `rgba(234, 179, 8, 0.2)` | Accent for tags, focus |
| `--marker-cyan` | `rgba(103, 232, 249, 0.4)` (cyan highlight) | `rgba(6, 182, 212, 0.2)` | Phase 1 & 2 accent |
| `--marker-green` | `rgba(134, 239, 172, 0.4)` (green highlight) | `rgba(34, 197, 94, 0.2)` | Phase 3 & 4 accent |
| `--marker-violet` | `rgba(216, 180, 254, 0.4)` (violet highlight) | `rgba(168, 85, 247, 0.2)` | Phase 5 accent |
| `--marker-red` | `rgba(252, 165, 165, 0.4)` (red pen bleed) | `rgba(239, 68, 68, 0.2)` | Errors, critical items |

---

## 3. Typography: "The Hand-Written Script"

We use Google Fonts to bring the notebook aesthetic to life:
- **Headings (Display, H1, H2, H3)**: Paired with **'Architects Daughter'** (a clean, sketchy script font) or **'Patrick Hand'** for an authentic hand-drawn feel.
- **Body & Labels**: **'Patrick Hand'** or a very clean, high-readability sans-serif like **'Inter'** to ensure readability for dense learning objectives, with sketchy details on small highlights. Let's use **'Patrick Hand'** for body text and headers, with **'Architects Daughter'** for primary display text, and **'JetBrains Mono'** for code blocks.
- **Code & Command Lines**: **'JetBrains Mono'** with a handwritten border wrapper.

---

## 4. Hand-Drawn Component Language

### Organic Borders
To make standard div containers look hand-drawn, use:
```css
border: 2px solid var(--border-color);
border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
```
This applies a organic, uneven curve that perfectly mimics a sketchy hand-drawn box.

### Solid Block Shadows
Shadows must look like solid ink block offsets:
```css
box-shadow: 4px 4px 0px var(--border-color);
transition: transform 0.1s ease, box-shadow 0.1s ease;
```
On hover, cards "press down":
```css
transform: translate(2px, 2px);
box-shadow: 2px 2px 0px var(--border-color);
```

### Hand-Drawn Checkboxes
Custom checkboxes will look like a hand-drawn square. Ticking a checkbox will animate a sketchy "X" drawing inside:
- Unchecked: `border: 2px solid var(--border-color)`
- Checked: Adds a dynamic SVG `X` stroke or path animation mimicking pen ink drawing.

### Highlight Effect
Text highlights use a CSS background gradient that mimics a real highlighter swipe:
```css
background: linear-gradient(104deg, rgba(253, 224, 71,0) 0.9%, rgba(253, 224, 71,1) 2.4%, rgba(253, 224, 71,0.3) 5.8%, rgba(253, 224, 71,0.1) 93%, rgba(253, 224, 71,0.7) 96%, rgba(253, 224, 71,0) 98%);
```

---

## 5. Layout & Navigation

### Page Layout
- **Grid Layout**: Grid lines (notebook paper or graph paper lines) act as the vertical and horizontal backing.
- **Multipage Setup**: A centralized Dashboard (`index.html`) with 5 separate HTML subpages representing the 5 phases.
- **Navigation Tabs**: Designed to look like paper sticky notes or index card divider tabs (`.index-tab`). Clicking them provides a paper flip transition.

---

## 6. Do's and Don'ts

### Do:
- **Use doodle accents**: Arrows, scribbles, underline swirls, and handwritten margin comments (styled in italic, `--ink-pencil` color).
- **Use textured SVGs**: Checkbox marks, star ratings, and progress lines should look like SVG path drawings.
- **Incorporate a Dark/Light Toggle**: The toggle should feel like turning a blackboard over (or switching from paper to chalkboard).

### Don't:
- **No smooth box-shadows**: Do not use `box-shadow: 0 4px 6px rgba(0,0,0,0.1)`.
- **No absolute symmetry**: Avoid exact uniform borders or pristine circles. Use rough paths for custom elements.
- **No corporate gradients**: Avoid blue-to-purple tech-startup gradients. Fills must look like marker pen highlights or crayon scribbles.
