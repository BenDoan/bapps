# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the `bapps` repository - a collection of simple browser-based utility apps built with vanilla HTML, CSS, and JavaScript.

## Apps

- `index.html` - Landing page with app directory
- `stopwatch.html` - Simple stopwatch timer
- `timer.html` - Countdown timer with customizable duration
- `gauntlet-tracker.html` - Performance metrics tracker with charts

## Development Conventions

### Favicon

All pages must include the hammer favicon. Add this line in the `<head>` section after the `<title>` tag:

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
```

The favicon is located at `favicon.svg` in the project root.

### Navigation

All apps must include a back button in the top-left corner that links to the home page (`/`). Use this standard implementation:

**CSS:**
```css
.back-btn {
    position: fixed;
    top: 1rem;
    left: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    text-decoration: none;
    transition: all 0.2s ease;
}

.back-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(-2px);
}

.back-btn svg {
    width: 20px;
    height: 20px;
    color: white;
}
```

**HTML:**
```html
<a href="/" class="back-btn" title="Back to apps">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
</a>
```

### Architecture

- Each app is a standalone HTML file with embedded CSS and JavaScript
- No build system or external dependencies required
- Apps should work offline after initial load
