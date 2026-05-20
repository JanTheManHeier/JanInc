# Eventappen — Produktbeskrivelse

> *Arbeidsnavn. Andre kandidater: **Krets**, **Hyllest**, **Toastly**, **Saml**, **Fjell**, **Festivo**.*

## TL;DR

En SaaS-plattform der **vertskap** (privatpersoner eller arrangører) kan lage en **dedikert mini-app for ett event** (50-årsdag, bryllup, utdrikningslag, jubileum, konferanse-middag). Plattformen genererer en personlig PWA på `dittevent.eventappen.no/<event-slug>` som gjestene kan installere på telefonen.

Inspirert av og bygget videre fra **Thomas50** (janinc.no/Thomas50/) — som har bevist at hele konseptet fungerer på en ekte fest med 92 gjester.

---

## Visjon

> *"WeddingWire og The Knot pluss Mentimeter pluss Spotify-stemmegivning, men for hvilken som helst fest, og uten å føle seg som en bedrift."*

En vertskap-app som tar bort all stress fra koordinering før festen og skaper interaktiv energi *under* festen. Erstatter Excel-ark, FB-event-tråder, Google Forms, e-poster og lapper på bordet — alt i én lett, vakker, mobilvennlig app.

---

## Markedsmuligheter

| Segment | Volum (Norge/år, estimat) | Pris-villighet |
|---|---|---|
| Bryllup | ~25 000 | 1500–3000 kr per event |
| Runde bursdager (40/50/60) | ~50 000 | 500–1500 kr |
| Utdrikningslag | ~30 000 | 300–800 kr |
| Konfirmasjon | ~50 000 | 300–800 kr |
| Jubileum/firmafest | tusenvis | 2000–10 000 kr |
| **Total adresserbar Norge** | **~150 000+ events/år** | |

Nordisk → europeisk → globalt. Klassisk lang hale: mange events, hver kunde betaler én gang, men kompenseres med add-ons (premium-templates, integrasjoner).

---

## Kjernekonsept

**Vertskap:**
1. Logger inn (Google/Microsoft/Apple)
2. Lager et event (velger type, dato, sted, anslått antall gjester)
3. Velger **moduler** å aktivere (drag-and-drop, eller forhåndsvalgte templates per event-type)
4. Fyller inn innhold (program, gjester, meny, bilder, fun facts)
5. Får en URL + QR-kode å dele
6. Får admin-dashboard for å se aktivitet under planlegging og festen

**Gjester:**
1. Åpner URL eller scanner QR
2. Installerer som PWA (popup hjelper dem)
3. Skriver navnet sitt (huskes)
4. Bruker app før, under og etter festen
5. Får varsler om viktige milepæler (dagen før, frister, programendringer)

---

## Modul-katalog (på/av per event)

Hver modul er en uavhengig "feature" med egen on/off-knapp og innstillinger.

### 📅 Pre-event-moduler (planlegging)
| Modul | Hva det gjør | Allerede bygget i Thomas50? |
|---|---|---|
| **Program & meny** | Tidslinje, kart, retter, vin-pairing, lenker til steder | ✅ |
| **Gjesteliste** | Bilder, bios, jobb, relasjon, filter (toastmaster, allergier, +1) | ✅ |
| **Bordplassering** | Visuell layout, sete-nummer, søk på navn | ✅ |
| **Hilsen-vegg** | Gjester skriver hilsen på forhånd, vises offentlig | ✅ |
| **Taleforespørsel** | Skjema → varsler toastmaster | ✅ |
| **Musikkønske** | Skjema → varsler DJ med frist | ✅ |
| **RSVP / påmelding** | Bekreft, +1, allergier, transport-hjelp | 🆕 |
| **Innkalling/invitasjon** | Designet "save-the-date" som kan deles | 🆕 |
| **Gaveliste / ønske-tre** | Gjester kan reservere gaver, splitting på flere | 🆕 |
| **Transport-koordinering** | Carpool, taxi-bestilling, samkjøring | 🆕 |
| **Overnatting** | Hotell-anbefalinger, samkjørt booking-kode | 🆕 |
| **Dresscode** | Bilder/forklaring, "hva passer" | 🆕 |

### 🎉 Under-festen-moduler
| Modul | Hva det gjør | Allerede bygget? |
|---|---|---|
| **Egen bursdagssang** | Tekst + audio (Suno-generert) | ✅ |
| **Quiz om verten** | Spørsmål med scoring og topp 10 | ✅ |
| **Diskusjon-spørsmål** | "Bord-spørsmål" som starter samtaler | ✅ |
| **Drikkeregler/spill** | Bordgame-regler | ✅ |
| **Custom mini-spill** | Runner-spill med vertens karakter | ✅ (Thomas til Festen) |
| **Bestevenn-orakel (AI)** | Match gjester for mingling | ✅ |
| **Allianser/lag** | Grupper gjester i morsomme team | ✅ |
| **Minnebok** | Bildeopplasting fra gjester (felles album) | ✅ |
| **Live polls / avstemninger** | Mentimeter-stil under festen | 🆕 |
| **Live musikkønsker** | Real-time forespørsel til DJ (kø-system) | 🆕 |
| **Quiz Kahoot-stil** | Multiplayer i sanntid på storskjerm | 🆕 |
| **Selfie-vegg** | Polaroid-rammet selfies som vises på skjerm | 🆕 |
| **Tale-tracker** | Toastmaster-app som rangerer talene live | 🆕 |
| **Dans-leaderboard** | Bluetooth-detektor for tilstedeværelse på dansegulvet | 🚀 (futurisk) |

### 📨 Post-event-moduler
| Modul | Hva det gjør | Allerede bygget? |
|---|---|---|
| **Takk-melding** | Auto-generert via AI til hver gjest | 🆕 |
| **Bilde-feed** | Aggregert album fra alle gjester | ✅ delvis |
| **Minnebok-PDF** | Generert som fysisk-trykbar bok | 🆕 |
| **Statistikk** | Hva fungerte, hvem var aktive | ✅ (admin) |
| **Reaksjons-stream** | Beste øyeblikk basert på reaksjoner | 🆕 |

### 🛠️ Admin/system-moduler
- Multi-bruker admin-tilgang (vertskap + medhjelpere)
- Rolledefinisjoner: vert / toastmaster / DJ / fotograf
- White-label option (egen branding på custom domene)
- Eksport: bordkart, gjesteliste, hilsen-bok til Word/PDF

---

## Event-templates (forhåndsvalgte modul-sett)

| Template | Inkluderte moduler |
|---|---|
| **🎂 Runde bursdager (50/60)** | Alle Thomas50-moduler — det er den verifiserte arketypen |
| **💍 Bryllup** | RSVP, Program, Gjester, Bordplassering, Taler, Musikkønske, Gavelistering, Talegjest-konkurranse, Minnebok |
| **🍻 Utdrikningslag** | Program (hemmelig for brud/brudgom), Gjester, Mini-spill, Bingo, Bilde-jakt, Quiz om jubilanten |
| **🎓 Konfirmasjon** | Program, Gjester, Taler, Sang, Minnebok |
| **🏢 Firmajubileum** | Program, Quiz om bedriften, Speakers, Live polls, Foto-stream |
| **🎪 Festival/sammenkomst** | Program (multi-track), Kart, Snakkergjester, Quiz, Live polls |

Vertskap kan starte med en template og deretter skru av/på enkeltmoduler.

---

## Teknisk arkitektur (high level)

### Frontend
- **PWA** (samme som Thomas50) — vanilla JS eller migrer til **SvelteKit/Astro** for bedre DX og maintainability
- **iOS- og Android-install** via standard PWA-flow
- **Tema-system** — hver event har egen primærfarge, font, hero-bilde
- **Offline-first** for kritiske ting under fest (program, gjester, bord)

### Backend
- **Multi-tenant SaaS** — alle events i én DB, isolert via `event_id`-kolonne
- **Database:** PostgreSQL (mer skalerbar enn Azure SQL for multi-tenant)
- **API:** Node.js/TS (NestJS eller Hono), evt. Bun
- **File storage:** S3-kompatibel (Cloudflare R2 = billig)
- **Auth:** Auth0 / Clerk / Supabase Auth (BankID som premium-add-on for norske bryllup)
- **E-post:** Resend eller Postmark (skalering vs Gmail SMTP fra Thomas50)
- **AI:** OpenAI/Anthropic for Bestevenn-orakel, takk-meldinger, content-genering
- **Push:** Web Push for in-app notifs, evt. WhatsApp Business API

### Hosting
- **Vercel/Cloudflare Pages** for frontend
- **Render/Railway/Fly.io** for backend
- **Cloudflare** for CDN + DDoS + Workers
- Multi-region: Europa først (Norge/EU compliance)

### Skalering
- Hver event har typisk 10-200 gjester. Konkurrent-trafikk forventet er moderat (typisk peak under selve festen, maks 200 samtidige brukere).
- 10 000 events/år = 2 milliarder requests/år? Nei — typisk 50-100 sessions per event = 1 million sessions/år. Lite.
- DB-størrelse: 100 KB per event * 10 000 = 1 GB. Lite.

---

## Monetisering

### Modeller
1. **Per-event-engangsbetaling** (anbefalt for B2C)
   - Basic (kun pre-event-moduler): 299 kr
   - Standard (alle moduler, opp til 50 gjester): 699 kr
   - Premium (ubegrenset, custom branding, AI-features): 1499 kr
2. **Abonnement** for arrangører (catering, wedding planners): 199–999 kr/mnd
3. **White-label** for bryllups-arrangører: 4999 kr/år + 100 kr per event
4. **Add-ons:**
   - Custom domene (`dittbryllup.no`): 299 kr
   - Premium templates: 199 kr stk
   - AI-genererte taler: 99 kr per
   - Trykket minnebok (post-fest): 599 kr
   - SMS-varsel til gjester: 1 kr per

### Conversion-strategi
- **Gratis tier** for små eventer (≤15 gjester, 1 modul)
- **"Try before you buy"** — bygg hele appen, betal kun for å publisere
- **Bryllup-paket** — kombinert med vendor-marketplace (DJ, fotograf, lokaler)

---

## MVP-scope (10 ukers løp)

### Sprint 1-2: Infrastruktur
- Auth + multi-tenant DB
- Event-CRUD
- Modul-toggle-system
- Public PWA-template

### Sprint 3-4: Core-moduler (Thomas50-port)
- Program & meny
- Gjesteliste + bilder
- Bordplassering
- Hilsen-vegg
- Tale-/musikkønske

### Sprint 5-6: Under-festen-moduler
- Quiz-bygger
- Bestevenn-orakel (AI)
- Minnebok

### Sprint 7-8: Vertskap-dashboard
- Stats
- Innholds-editor
- Modul-templates per event-type
- Eksport

### Sprint 9-10: Polish + launch
- Onboarding-flow
- Betaling (Stripe)
- Landingsside (eventappen.no)
- 5-10 beta-events fra venner og familie

---

## Differensiering

Det finnes konkurrenter (WedSites, Joy, RSVPify, Hupla), men de er stort sett:
- ❌ Amerikanske/engelske
- ❌ Bryllup-fokuserte (mangler birthday, utdrikningslag)
- ❌ Statiske (få sanntids-features)
- ❌ Mangler det "morsomme" — Bestevenn-orakel, mini-spill, AI-genererte taler

**Vår vinkel:**
1. **Norsk-først** (BankID, MS-konto-auth, Vipps-betaling, Vinmonopolet-integrasjon for menyer)
2. **Modulær** — start enkelt, vokse til fullt orkester
3. **Personlig & varm** — bursdag/familietreff-vinkel, ikke bare formell bryllup
4. **Lekent** — quiz, AI-orakel, spill — *gjester husker fester med interaktiv app*
5. **PWA** — ingen app-store-install-friksjon

---

## Risikoer & mitigeringer

| Risiko | Mitigering |
|---|---|
| Lavt frekvent kjøp (1x per liv per kunde) | Bygg agency-segmentet (bryllups-planleggere, catering) som har repeat-business |
| AI-kostnader skalerer | Per-event-cap; cache aggressiv; Haiku/4o-mini i stedet for Sonnet/4o |
| GDPR (gjeste-data) | Auto-slett 6 mnd etter event; vertskap eier sin egen data; tydelig samtykke |
| WhatsApp/SMS-utfordringer | Start uten dem; tilby Web Push og lenke-deling |
| Konkurranse fra Facebook Events | Vi tilbyr ting FB ikke gjør (bordkart, AI, spill, branding) |
| Sesongvariasjon | Bryllup peaker mai-sept; bursdager fordeles jevnt; firma-events høst |

---

## Hva Thomas50 har gitt oss av kjent kunnskap

✅ PWA-installasjon fungerer på iPhone Safari/Chrome
✅ Azure SQL Basic er nok for et event
✅ SMTP via Gmail er pålitelig (etter Outlook-fadese)
✅ Rate limiting er nødvendig fra dag 1
✅ Sub-tabs > flate menyer
✅ Søkbar dropdown > flat liste
✅ AI-generert bestevenn-match er populært
✅ Gjester elsker fjell-tema-bord (lokalkoloritt fungerer)
✅ "Last til hjem-skjerm"-popup øker installs
✅ Toastmasters/DJ vil ha e-postvarsel, ikke å logge inn på admin
✅ Auto-pause på free-tier DB er ikke akseptabelt — pay for it

## Hva vi *ikke* har testet
❌ Skalering ut over 200 brukere samtidig
❌ Betaling / Stripe-flow
❌ Multi-event-isolasjon
❌ Vertskap-onboarding (Thomas50 har én vert, deg)
❌ Salgs-funnel / SEO
❌ Support-prosess

---

## Neste skritt (når dette plukkes opp igjen)

1. **Validér med 3-5 venner** som har bursdag/bryllup i sikte. Hva ville de betale for?
2. **Sjekk konkurrenter** grundigere — RSVPify, Joy, Hupla, WedSites, lokale norske alternativ
3. **Tegne low-fi mockups** av vertskap-dashboard
4. **Velg tech-stack** (anbefaler: Next.js + Supabase + Stripe = MVP i 4 uker)
5. **Reservér domene** — `eventappen.no`, `krets.no`, `hyllest.no` osv.
6. **Lag landingsside** med "be om tidlig tilgang" — mål 100 emails før dev starter

---

*Sist oppdatert: 20. mai 2026. Bygget videre fra erfaringer med Thomas50 (janinc.no/Thomas50/).*
