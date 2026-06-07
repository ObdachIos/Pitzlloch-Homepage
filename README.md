# Pitzlloch – Website

Vollständige, statische Website für die Hochzeits- und Eventlocation **Pitzlloch** in Grabenstätt, Chiemgau.

---

## Schnellstart

### 1. Seite lokal starten

Öffne VS Code im Projektordner und starte die Erweiterung **Live Server**:
- Rechtsklick auf `index.html` → **"Open with Live Server"**
- Oder: Klick auf "Go Live" in der Statusleiste unten rechts

> **Wichtig:** Immer mit Live Server öffnen, nie direkt als `file://` – sonst funktioniert das Laden von Header/Footer nicht.

---

## Was du anpassen musst

### 1. Web3Forms – Formulare einrichten (kostenlos)

Die Kontakt- und Preisanfrage-Formulare nutzen **Web3Forms** als Backend.

1. Gehe auf [web3forms.com](https://web3forms.com) und registriere dich kostenlos
2. Erstelle einen Access Key für deine E-Mail-Adresse
3. Suche in allen HTML-Dateien nach `YOUR_ACCESS_KEY` und ersetze es:
   ```html
   <input type="hidden" name="access_key" value="DEIN_ECHTER_KEY">
   ```
   Betroffen: `kontakt.html` und `preise.html`

### 2. Bilder einfügen

Alle Bildstellen sind als `<!-- REPLACE: ... -->` Kommentare markiert.

**So ersetzt du ein Bild:**
```html
<!-- Vorher (Platzhalter): -->
<div class="img-ph hero"></div>

<!-- Nachher (echtes Bild): -->
<img src="/images/hero-startseite.webp"
     alt="Pitzlloch – Hochzeitslocation Chiemgau"
     loading="eager">
```

**Empfohlene Bildformate:**
- Bilder als **WebP** (für beste Performance) oder JPG
- Hero-Bilder: mind. 1920×1080px
- Galerie-Bilder: mind. 800×600px
- Teamfotos: mind. 600×600px

**Wichtige Bildpfade:**
```
/images/hero-startseite.webp     → Startseite Hero
/images/hero-hochzeiten.webp     → Hochzeiten Hero
/images/hero-events.webp         → Events Hero
/images/hero-galerie.webp        → Galerie Hero
/images/hero-kontakt.webp        → Kontakt Hero
/images/og-image.jpg             → Open Graph Bild (für Social Media, 1200×630px)
/images/galerie/hochzeit-01.webp → Galerie Fotos
/images/galerie/...              → weitere Galerie-Fotos
```

### 3. Google Maps Karte einbetten

In `kontakt.html` findest du einen Platzhalter für die Karte.

**So holst du den Embed-Code:**
1. Öffne [Google Maps](https://maps.google.com)
2. Suche nach "Pitzlloch 1, 83355 Grabenstätt"
3. Klicke auf "Teilen" → "Karte einbetten"
4. Kopiere den `<iframe>`-Code
5. Ersetze den Platzhalter in `kontakt.html`

### 4. Domain und Canonical-URLs anpassen

Suche in allen Dateien nach `https://www.pitzlloch.de` und ersetze es durch deine echte Domain.

Betroffen in jeder HTML-Datei:
```html
<link rel="canonical" href="https://www.DEINE-DOMAIN.de/dateiname.html">
```

Auch die Sitemap anpassen: `sitemap.xml`

### 5. Google Bewertungslink

In `bewertungen.html` findest du Platzhalter für den Google-Bewertungslink.
Den korrekten Link findest du in deinem Google Business Profil.

### 6. Impressum & Datenschutz vervollständigen

**Impressum** (`impressum.html`):
- Vollständigen Namen des Inhabers eintragen
- Registernummer (falls vorhanden)
- Umsatzsteuer-ID (falls vorhanden)

**Datenschutz** (`datenschutz.html`):
- Für eine geprüfte Vorlage: [e-recht24.de Generator](https://www.e-recht24.de/muster-datenschutzerklaerung.html)
- E-Mail-Adresse eintragen
- Genutzte Dienste prüfen und ergänzen

---

## Website veröffentlichen

### Option 1: FTP / Webhosting

1. Miete ein Webhosting (z.B. bei All-Inkl, Strato, IONOS)
2. Verbinde dich per FTP-Programm (z.B. FileZilla)
3. Lade den gesamten Ordnerinhalt in das Stammverzeichnis (htdocs / public_html) hoch
4. Richte deine Domain auf den Hoster ein

### Option 2: Netlify (kostenlos, empfohlen)

1. Gehe auf [netlify.com](https://netlify.com) und registriere dich
2. Klicke auf "Add new site" → "Deploy manually"
3. Ziehe deinen gesamten Website-Ordner per Drag & Drop in das Netlify-Fenster
4. Netlify gibt dir sofort eine URL wie `random-name.netlify.app`
5. Unter "Domain settings" kannst du eine eigene Domain verknüpfen

### Option 3: Vercel (kostenlos)

1. Gehe auf [vercel.com](https://vercel.com) und registriere dich
2. Klicke auf "Add New" → "Project"
3. Verbinde dein GitHub-Repository oder lade direkt hoch
4. Vercel deployt automatisch – auch eigene Domains möglich

---

## Ordnerstruktur

```
/
├── index.html              Startseite
├── hochzeiten.html         Hochzeiten
├── feiern-events.html      Feiern & Events
├── raeumlichkeiten.html    Räumlichkeiten
├── galerie.html            Bildergalerie
├── kulinarik.html          Kulinarik & Catering
├── preise.html             Preise & Pakete
├── ueber-uns.html          Über uns
├── bewertungen.html        Google-Bewertungen
├── faq.html                Häufige Fragen
├── kontakt.html            Kontakt & Anfahrt
├── datenschutz.html        Datenschutzerklärung
├── impressum.html          Impressum
├── sitemap.xml             Sitemap für Google
├── robots.txt              Crawler-Steuerung
├── favicon.ico             Website-Icon (REPLACE: echtes Icon einfügen)
├── css/
│   └── style.css           Zentrales Stylesheet
├── js/
│   └── main.js             JavaScript
├── partials/
│   ├── header.html         Header (Navigation)
│   └── footer.html         Footer + Cookie-Banner
└── images/                 (Bilder hier ablegen)
    └── galerie/            (Galerie-Fotos)
```

---

## Favicon erstellen

Erstelle ein Favicon aus dem Pitzlloch-Logo:
1. Gehe auf [favicon.io](https://favicon.io) oder [realfavicongenerator.net](https://realfavicongenerator.net)
2. Lade dein Logo hoch und lade das `favicon.ico` herunter
3. Lege es im Stammverzeichnis ab (neben index.html)
