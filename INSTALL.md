# 1. Installationshinweise
Die folgende Hinweise sind für die Nutzung unter Windows:
## 1.1 Tools
Folgende Tools gilt es zu installieren

[NodeJS 4 Win x64](http://nodejs.org/dist/v0.12.2/x64/node-v0.12.2-x64.msi)


[Ruby-Installer 4 WIn x64](http://dl.bintray.com/oneclick/rubyinstaller/rubyinstaller-2.2.1-x64.exe)

**Jetzt den Rechner neustarten!**

### 1.1.1 Plugins Chrome
Zusätzlich noch das Plugin im Browser der Wahl:
[Livereload 4 Chrome](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)
**Achtung**, Einstellungen müssen noch angepasst werden: 

![LivereloadConfig](/docs/livereload.png)


### 1.1.2 Plugins Firefox
[Livereload 4 FF](http://download.livereload.com/2.1.0/LiveReload-2.1.0.xpi)
Mehr Informationen zu finden unter: http://livereload.com/extensions/

## 1.2 Globale Module
Einige Module müssen global installiert werden

```bash
npm install -g browserify gulp babel karma-cli
```
## 1.3 Gems
Wir sollten compass verwenden um einfacher mit Sprites umzugehen

```bash
gem install compass sass
```

## 1.4 lokale NPM-Module

```bash
npm install
```
...dürfte wohl klar gewesen sein, dass das kommt :D

# 2. Verzeichnis-struktur

- **build** die erzeugten JS-Dateien für den Client
- **css** Name ist Programm
- **docs** Präsentation, Doku, etc
- **font** Schrift-dateien für den Client
- **img** Bild-Dateien für den Client
- **sass** Scss-Dateien/Compass
- **server_lib** Module für die Server-Instanz
- **src** Module für den Client
- **vendors** Drittanbieter

# 3. Zusammen arbeiten

Ich möchte darum bitten, dass wir klare definierte Grenzen haben, wer welche Datei bearbeitet!
Idealerweise arbeitet jeder in seinem Modul!
Wie wir alle wissen, haben wir so weniger Frust ;)

**Wichtig**: ES6 wird durch babelify unterstützt!

## 3.1 Notwendige Befehle

Generell braucht ich nur einen einzigen Befehl:

```bash
gulp watch
```

Damit startet ihr den Server auf Port 3000, überwacht änderungen an html, scss und JS-Dateien für den Client,
stoßt bei Änderungen browserify nochmal an, der Browser wird automatisch neu geladen.

## 3.2 Weitere Befehle

"Gulp watch" macht also alles für euch, wenn es spezieller sein soll, bzw. Fehler auftreten, könnt ihr mit folgenden
 Befehlen arbeiten:
 
```bash
compass compile
```

Übersetzt alle Sass/Scss-Dateien in css
 
```bash
compass watch
```

Überwacht Änderungen an Sass-Dateien und übersetzt bei Bedarf 

```bash
node app.js
```

Startet den Server
  
```bash
gulp browserify
```

Fügt Dateien zusammen

