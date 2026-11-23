# 🎯 Valorant Live Rank Overlay for OBS & Streamlabs

A modern, high-performance, and fully customizable **Valorant Live Rank Stream Overlay** powered by the **HenrikDev API (v3)** and designed to be hosted for free on **GitHub Pages**.

---

## ✨ Features

- 🎮 **Live Competitive Tracking**: Displays your current tier name, high-res rank badge, current RR, progress bar, and last match RR difference (+/- RR).
- 🏆 **High-Res Rank Badges**: Uses official Valorant competitive tier icons (Iron 1 up to Radiant) directly from the Valorant API CDN.
- 📊 **Stream Session Tracker**: Automatically tracks wins, losses, and net RR gain/loss during your current streaming session (e.g. `4W - 1L (+48 RR)`).
- 🥇 **Radiant & Immortal Leaderboard**: Shows live leaderboard rank placement badge (e.g. `#142`).
- 🌟 **Peak Rank Display**: Subtle badge showcasing your all-time peak rank and episode/act.
- 🎨 **4 Streamer Layouts**:
  - **Pill Bar**: Ultra-sleek compact horizontal bar (ideal next to webcam or minimap).
  - **Card HUD**: Clean rectangular info card with prominent rank badge and detailed stats.
  - **Minimal**: Subtle micro-badge with animated RR progress bar.
  - **Wide Banner**: Esports tournament-style horizontal banner.
- 🎭 **4 Visual Themes**:
  - **Tactical**: Official Valorant dark charcoal with crimson red accents and sharp tactical cuts.
  - **Cyber Neon**: Synthwave neon cyan & magenta glow.
  - **Frosted Glass**: Modern blurred glassmorphism (`backdrop-filter`).
  - **Pure Dark**: Minimalist stealth black.
- 🔊 **Web Audio Sound Effects**: Optional crisp audio chimes on match RR gain, loss, or rank-up celebration (synthesized via Web Audio API, zero audio asset downloads needed).
- 🎛️ **Interactive Setup Dashboard**: Includes a built-in visual configurator with live stream backdrop simulation and one-click OBS URL generator.
- 🧪 **Demo / Preview Mode**: Test and position your overlay in OBS before streaming, with simulation buttons (+22 RR Win, -17 RR Loss, Rank Up!).
- 🌐 **100% Client-Side & Free**: No Node.js server, database, or backend required. Runs entirely in the browser on GitHub Pages.

---

## 🚀 Quick Start Guide

### Step 1: Get a Free HenrikDev API Key
HenrikDev requires an API key to query Riot Valorant MMR data:
1. Join the [HenrikDev Discord](https://discord.gg/X3GaVkX2YN).
2. Complete Discord onboarding and go to the `#get-a-key` channel.
3. Select **VALORANT (Basic Key)** from the dropdown to instantly generate your key (starts with `HDEV-...`).
4. You can also view or manage your key on the [HenrikDev Dashboard](https://api.henrikdev.xyz/dashboard/).

---

### Step 2: Deploy to GitHub Pages (Free Hosting)

1. Create a repository on GitHub (e.g., `ValorantRanksystem`).
2. Push or upload these files to your `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Valorant live rank overlay"
   git branch -M main
   git remote add origin https://github.com/<your-username>/ValorantRanksystem.git
   git push -u origin main
   ```
3. In your GitHub repository:
   - Click on **Settings** &rarr; **Pages** (in the left sidebar).
   - Under **Build and deployment** &gt; **Source**, select **Deploy from a branch**.
   - Under **Branch**, select `main` and `/ (root)`, then click **Save**.
4. In 1–2 minutes, your overlay is live at:
   ```
   https://<your-username>.github.io/ValorantRanksystem/
   ```

---

### Step 3: Configure via the Setup Dashboard

1. Visit your GitHub Pages URL:
   ```
   https://<your-username>.github.io/ValorantRanksystem/
   ```
2. Enter your **Riot Game Name** (e.g. `TenZ`) and **Tagline** (e.g. `0001` or `NA1`).
3. Select your **Region** (`NA`, `EU`, `AP`, `KR`, `LATAM`, `BR`).
4. Paste your **HenrikDev API Key**.
5. Choose your desired **Layout**, **Theme**, and **Display Options**.
6. Click **Test HenrikDev API Connection** to verify your account.
7. Click **📋 Copy URL** under **Your OBS Browser Source URL**.

---

### Step 4: Add to OBS Studio or Streamlabs

1. In OBS Studio, click the **+** (Add Source) icon in the **Sources** dock.
2. Select **Browser**.
3. Name it `Valorant Rank Overlay`.
4. In the Browser Source Properties window:
   - **URL**: Paste the generated overlay URL.
   - **Width & Height**: Set according to your selected layout (see table below).
   - **Custom CSS**: Leave empty or set `body { background-color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; }`.
   - Check **"Shutdown source when not visible"**.
   - Check **"Refresh browser when scene becomes active"**.
5. Click **OK** and position the overlay anywhere on your stream!

---

## 📐 Recommended OBS Browser Source Dimensions

| Layout | Recommended Width | Recommended Height | Best Placed |
| :--- | :--- | :--- | :--- |
| **Pill Bar** | `520 px` | `95 px` | Under webcam or alongside radar |
| **Card HUD** | `380 px` | `160 px` | Top/bottom stream corner |
| **Minimal** | `300 px` | `75 px` | Directly above agent abilities |
| **Wide Banner** | `660 px` | `110 px` | Top or bottom center banner |

*Note: If you adjust the scale slider in the dashboard (e.g., to 120%), multiply the width and height accordingly.*

---

## ⚙️ URL Query Parameters (For Power Users)

You can customize the overlay directly via URL parameters on `overlay.html`:

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `name` | string | `""` | Player Riot ID Game Name |
| `tag` | string | `""` | Player Tagline (without `#`) |
| `region` | string | `na` | Server region: `na`, `eu`, `ap`, `kr`, `latam`, `br` |
| `key` | string | `""` | HenrikDev API key |
| `layout` | string | `pill` | Layout style: `pill`, `card`, `minimal`, `wide` |
| `theme` | string | `tactical` | Color theme: `tactical`, `neon`, `glass`, `dark` |
| `scale` | float | `1.0` | Size scaling multiplier (e.g. `0.9`, `1.2`) |
| `refresh` | integer | `60` | Polling interval in seconds (min: `30`) |
| `showName` | boolean | `true` | Show/hide Riot ID name tag (`true` / `false`) |
| `showRankName` | boolean | `true` | Show/hide text rank tier name (`true` / `false`) |
| `showDelta` | boolean | `true` | Show/hide last match RR diff (`true` / `false`) |
| `showPeak` | boolean | `true` | Show/hide peak rank badge (`true` / `false`) |
| `showSession` | boolean | `true` | Show/hide stream session W/L record (`true` / `false`) |
| `sound` | boolean | `false` | Enable Web Audio update chimes (`true` / `false`) |
| `demo` | boolean | `false` | Enable demo preview mode (`true` / `false`) |
| `demoTier` | integer | `19` | Demo tier index (0–27, e.g. 19 = Diamond 2) |
| `demoRr` | integer | `72` | Demo RR value (0–100) |
| `reset` | integer | `0` | Set `reset=1` to clear session stats |

### Example OBS URLs:
- **Live stream**:
  ```
  https://<username>.github.io/ValorantRanksystem/overlay.html?name=TenZ&tag=0001&region=na&key=HDEV-xxxx&layout=pill&theme=tactical&showSession=true
  ```
- **Demo / Preview test**:
  ```
  https://<username>.github.io/ValorantRanksystem/overlay.html?demo=true&demoTier=22&demoRr=84&layout=card&theme=neon
  ```

---

## 📁 Project Structure

```
ValorantRanksystem/
├── index.html        # Interactive setup dashboard, preview canvas & URL generator
├── overlay.html      # Transparent stream overlay for OBS Browser Source
├── css/
│   ├── dashboard.css # Styling for setup dashboard and preview tool
│   └── overlay.css   # OBS overlay themes, layouts, animations & typography
├── js/
│   ├── api.js        # HenrikDev API client (v3/v1) & Valorant-API tier maps
│   ├── audio.js      # Web Audio synthesizer for rank-up & RR chimes
│   ├── overlay.js    # Overlay controller, DOM renderer & session tracker
│   └── dashboard.js  # Dashboard reactive bindings & URL generator
├── .gitignore
├── LICENSE           # MIT License
└── README.md
```

---

## 🔒 Privacy & Stream Safety

- **Client-Side Only**: Your HenrikDev API key is stored locally in your browser's `localStorage` and passed in your private OBS Browser Source URL. It is never logged or transmitted to any third-party server.
- **OBS Safety**: In OBS, browser source URLs are hidden inside source properties and never visible on stream.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
Valorant and Riot Games are trademarks or registered trademarks of Riot Games, Inc. This project is an unofficial fan creation and is not endorsed by or affiliated with Riot Games.
API powered by the awesome [HenrikDev API](https://docs.henrikdev.xyz/).
