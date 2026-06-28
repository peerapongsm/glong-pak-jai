# กล่องพักใจ (Worry Window)

CBT "scheduled worry time" web app in Thai. Capture worries all day; the box
stays locked until your daily worry window; review them then. Shows an honest
"didn't happen %" stat.

- 100% client-side, on-device (`localStorage`). No login, no backend, no AI.
- Reminders via a generated recurring `.ics` you add to your own calendar.

## Develop
`npm install && npm run dev` → http://localhost:3000/glong-pak-jai
`npm test` runs the unit tests.

## Deploy
Static export to GitHub Pages via `.github/workflows/deploy.yml` (Settings →
Pages → Source: GitHub Actions). Live at
https://peerapongsm.github.io/glong-pak-jai/
