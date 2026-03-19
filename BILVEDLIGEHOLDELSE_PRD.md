# PRD — Bilvedligeholdelse Android App

**Version:** 1.0
**Dato:** 19. marts 2026
**Status:** Klar til udvikling

---

## 1. Formål og vision

En privat Android-app til at holde styr på egne biler — service, udgifter og økonomi — samlet ét sted. Appen henvender sig til privatpersoner, der ejer én eller flere biler og ønsker et enkelt overblik uden at skulle bruge regneark eller papir.

Udgangspunktet er en fungerende webapplikation (Nuxt 3 + NuxtHub) med samme funktionalitet. Android-appen skal føles native, arbejde offline og udnytte enhedens muligheder (kamera, notifikationer, nummerplade-scanning).

---

## 2. Målgruppe

| Segment | Beskrivelse |
|---|---|
| Primær | Privat bilejere, 25–60 år, én til tre biler |
| Sekundær | Familier med fælles biler, hobbyentusiaster |
| Ikke-målgruppe | Flådeadministration, erhvervskørsel, værksteder |

**Kernebehov:**
- Hurtigt logge en service eller udgift
- Aldrig miste overblikket over næste syn eller service
- Vide hvad en bil samlet har kostet

---

## 3. Funktionskrav

### 3.1 Biler

| # | Funktion | Prioritet |
|---|---|---|
| F-01 | Opret bil med navn, nummerplade, mærke, model, år, farve, km-stand | Must |
| F-02 | Rediger og slet bil | Must |
| F-03 | Vis liste over alle biler med km-stand og restgæld | Must |
| F-04 | Auto-udfyld bildata ved opslag på nummerplade (DMR/Synsbasen API) | Should |
| F-05 | Foto af bilen taget direkte fra kamera | Could |

**Datamodel — Bil:**
```
id            UUID
name          String          // brugerens kaldenavn, f.eks. "Familiens Passat"
licensePlate  String          // nummerplade, f.eks. "AB12345"
make          String?         // mærke, f.eks. "Volkswagen"
model         String?         // model, f.eks. "Passat"
year          Int?            // årgang
color         String?         // farve
mileage       Int             // nuværende km-stand
purchasePrice Double?         // købspris i DKK
loanRemaining Double?         // restgæld i DKK
notes         String?         // fritekst-noter
photoUri      String?         // lokal filsti til billede
createdAt     Long            // unix timestamp
updatedAt     Long
```

---

### 3.2 Servicehistorik

| # | Funktion | Prioritet |
|---|---|---|
| F-10 | Opret servicepost (dato, km, type, beskrivelse, pris, værksted) | Must |
| F-11 | Slet servicepost | Must |
| F-12 | Liste sorteret nyeste øverst | Must |
| F-13 | Samlet serviceudgift pr. bil vist øverst | Must |
| F-14 | Filtrer servicehistorik på type | Should |
| F-15 | Vedhæft foto af kvittering via kamera eller galleri | Could |

**Servicetyper:**
- `service` — Periodisk service
- `syn` — Bilsyn
- `olieskift` — Olieskift
- `daek` — Dæk (skift, sæsonopbevaring)
- `reparation` — Reparation
- `andet` — Andet

**Datamodel — Servicepost:**
```
id          UUID
carId       UUID (FK → Bil)
date        String          // ISO 8601, f.eks. "2026-03-19"
mileage     Int?            // km-stand på servicetidspunktet
type        String          // se servicetyper ovenfor
description String?         // fritekstbeskrivelse
cost        Double?         // pris i DKK
provider    String?         // værksted / leverandør
receiptUri  String?         // lokal filsti til kvitteringsfoto
createdAt   Long
```

---

### 3.3 Nummerplade-opslag

Når brugeren taster en nummerplade ved oprettelse af ny bil, tilbyder appen at slå bilen op via **Synsbasen API** eller **DMR (Motorregisteret)** og auto-udfylde:

- Mærke og model
- Årgang
- Farve
- Brændstoftype
- Næste syn-dato

**Flow:**
1. Bruger taster nummerplade
2. "Søg" knap trykkes (eller automatisk efter 7 tegn)
3. API-kald → spinner
4. Data præsenteres i en bundlade med "Brug disse data" / "Ignorer"
5. Formularfelter udfyldes ved accept

**API-muligheder (prioriteret):**
1. `https://api.synsbasen.dk/v1/vehicles/registration/{plate}` — gratis tier
2. DMR Open Data via `https://data.gov.dk/` (officielt, kræver API-nøgle)

---

### 3.4 Påmindelser og notifikationer

| # | Funktion | Prioritet |
|---|---|---|
| F-20 | Påmind X dage før næste syn-dato | Should |
| F-21 | Påmind ved X km til næste service (f.eks. hvert 15.000 km) | Should |
| F-22 | Ugentlig oversigt som notifikation (valgfri) | Could |

Notifikationer sendes via Android WorkManager (baggrundscheck) og lokale AlarmManager-notifikationer — ingen ekstern push-service nødvendig.

---

### 3.5 Økonomi og statistik

| # | Funktion | Prioritet |
|---|---|---|
| F-30 | Samlet udgift pr. bil (service + indkøbspris) | Must |
| F-31 | Restgæld vises tydeligt på bil-kort | Must |
| F-32 | Udgifter pr. år, bar-chart | Should |
| F-33 | Udgifter fordelt på type, pie-chart | Could |
| F-34 | Estimeret total ejeromkostning (TCO) | Could |

---

### 3.6 Data og synkronisering

| # | Funktion | Prioritet |
|---|---|---|
| F-40 | Fuld offline-funktion — appen virker uden internet | Must |
| F-41 | Lokal SQLite-database via Room | Must |
| F-42 | Eksport til JSON (backup) | Should |
| F-43 | Import fra JSON (gendannelse) | Should |
| F-44 | Eksport til PDF (servicehistorik pr. bil) | Could |
| F-45 | Google Drive auto-backup (valgfrit) | Could |

---

## 4. Ikke-funktionelle krav

| Kategori | Krav |
|---|---|
| Platform | Android 8.0 (API 26) og nyere |
| Sprog | Kotlin (Jetpack Compose UI) |
| Database | Room (SQLite wrapper) |
| Offline | Appen skal virke 100% offline |
| Ydelse | Listescroll ≥ 60 fps, app-start < 2s |
| Tilgængelighed | Tekststørrelser følger systemindstilling, contentDescription på ikoner |
| Mørk tilstand | Fuldt understøttet via Material You (Dynamic Color) |
| Sikkerhed | Ingen data sendes til tredjepart uden eksplicit samtykke |
| Størrelse | App-bundle < 20 MB |

---

## 5. UI og navigationsstruktur

```
App
├── BottomNavigation
│   ├── Biler (Home)         → BilListeSkærm
│   ├── Statistik            → StatistikSkærm
│   └── Indstillinger        → IndstillingerSkærm
│
├── BilListeSkærm
│   └── [tap på bil]         → BilDetaljeSkærm
│       ├── [Rediger]        → RedigerBilSkærm
│       ├── [Tilføj service] → TilføjServiceSkærm
│       └── [Slet]          → bekræftelsesdialog
│
└── FAB (+)                  → TilføjBilSkærm
    └── [Nummerplade søg]   → NummerpladeSøgBundlade
```

**Designprincipper:**
- Material Design 3 (Material You)
- Primærfarve: Blå (tilpasset systemets dynamic color)
- Typografi: Roboto / systemfont
- Ingen loginskærm — appen er privat og lokal
- Tom-tilstande med illustrationer og opfordring til handling

---

## 6. Teknisk stack

| Komponent | Teknologi |
|---|---|
| Sprog | Kotlin |
| UI-framework | Jetpack Compose |
| Navigation | Navigation Compose |
| Database | Room + SQLite |
| Async | Kotlin Coroutines + Flow |
| Dependency injection | Hilt |
| HTTP-kald (nummerpladesøgning) | Ktor Client eller Retrofit |
| Notifikationer | WorkManager + NotificationManager |
| Charts | Vico (Compose-native charting) |
| PDF-eksport | PdfDocument (Android built-in) |
| Kamera | CameraX + ML Kit (tekstgenkendelse til plade) |
| Test | JUnit 4/5, Compose Testing, Robolectric |

---

## 7. Datamigration fra web-appen

Webappens SQLite-database (NuxtHub / libSQL) eksporteres via JSON-endpoint og importeres i Android-appen ved første opstart. Felterne matcher 1:1 (se datamodeller i afsnit 3).

---

## 8. Scopes og afgrænsninger

**Inkluderet i v1.0:**
- Bil-CRUD
- Servicehistorik-CRUD
- Nummerplade-opslag
- Offline SQLite
- Påmindelser (syn og service)
- Statistik (udgifter pr. år)
- JSON backup/restore

**Udeladt fra v1.0:**
- Brugerkonti / cloud sync
- Flådestyring / deling med andre
- Brændstoflog og tankning
- OBD2 / Bluetooth integration
- Apple App Store (iOS)

---

## 9. Acceptkriterier for v1.0

- [ ] Bruger kan oprette, redigere og slette biler
- [ ] Bruger kan logge en servicepost på under 30 sekunder
- [ ] Nummerplade-opslag returnerer korrekte data for dansk indregistrerede biler
- [ ] App starter på < 2 sekunder på en 3 år gammel midrange-enhed
- [ ] Alle data bevares efter app-genstart og enhedsrestart
- [ ] Notifikation udsendes korrekt X dage før syn-dato
- [ ] JSON-backup kan importeres og gendanner alle data korrekt
- [ ] Appen virker uden internetforbindelse (undtagen nummerpladesøgning)

---

## 10. Roadmap

| Fase | Indhold | Estimat |
|---|---|---|
| v1.0 | Kerneapp (biler, service, offline, notifikationer) | 6–8 uger |
| v1.1 | Nummerplade-scanning via kamera + ML Kit | 2 uger |
| v1.2 | Statistik + charts, PDF-eksport | 2 uger |
| v1.3 | Google Drive backup, TCO-beregner | 2 uger |
| v2.0 | Valgfri cloud sync + web-app integration | TBD |
