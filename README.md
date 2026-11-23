# 🎯 Valorant Live Rank Stream Overlay

> **🌐 Live Web App**: [steushio.github.io/ValorantRanksystem](https://steushio.github.io/ValorantRanksystem/)  
> Free to use directly in your browser — no hosting or installation required!

A sleek, modern Valorant live rank overlay for **OBS Studio** and **Streamlabs** powered by the **HenrikDev API v3**. 

---

## 🚀 Quick Setup (3 Steps)

1. **Open the Web App**:  
   Go to [https://steushio.github.io/ValorantRanksystem/](https://steushio.github.io/ValorantRanksystem/)

2. **Enter your Account Details**:  
   - Enter your **Riot Game Name** and **Tagline** (e.g., `mouse#12`).
   - Select your **Region** (`NA`, `EU`, `AP`, `KR`, `LATAM`, `BR`).
   - Paste your free **HenrikDev API Key** *(Get yours instantly in the [HenrikDev Discord](https://discord.gg/X3GaVkX2YN) `#get-a-key` channel)*.
   - Choose your layout (**Pill Bar**, **Card HUD**, **Minimal**, or **Wide Banner**) and color theme.

3. **Add to OBS Studio / Streamlabs**:  
   - Click **📋 Copy URL**.
   - In OBS Studio, add a new **Browser** source.
   - Paste the copied link and set the resolution according to your selected layout.

---

## 📐 Recommended OBS Browser Source Dimensions

| Layout | Width | Height | Recommended Placement |
| :--- | :--- | :--- | :--- |
| **Pill Bar** | `520 px` | `95 px` | Under webcam or next to minimap |
| **Card HUD** | `380 px` | `160 px` | Top/bottom stream corner |
| **Minimal** | `300 px` | `75 px` | Directly above abilities HUD |
| **Wide Banner** | `660 px` | `110 px` | Top or bottom center |

*Recommended OBS Settings:*
- Check **"Shutdown source when not visible"**
- Check **"Refresh browser when scene becomes active"**

---

## 💡 Name-Change Proof (Permanent PUUID)

Riot assigns every account a permanent **PUUID**. When you click **"Test Connection"** on the website, your PUUID is automatically retrieved and embedded into your OBS link.

Once linked with your PUUID, you can change your Riot ID (e.g., from `mouse#12` to `Mouse Player#12`) and your overlay will continue tracking your rank without ever editing OBS again!
