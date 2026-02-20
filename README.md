# Sky Tech Website (Multi-page) ✅
Next.js + Tailwind + Framer Motion

## Pages
- /           Home (Landing)
- /services   Services (3 cards + 4 bullet points each)
- /offers     Offers (live from Google Sheets)
- /contact    Contact (call + whatsapp)
- /admin      Admin login + offers update

## Splash loader
Shows once per browser session (Sky Tech + 0-100%)

## Setup
1) npm install
2) copy .env.example -> .env.local
3) npm run dev


## Gallery (Worked Photos)

Add these env vars:

- NEXT_PUBLIC_GALLERY_API_URL = <Apps Script web app URL>?type=gallery
- GALLERY_API_URL = <Apps Script web app URL>
- GALLERY_API_SECRET = same SECRET in Code.gs

Optional (for file upload button in admin):
- NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
- NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

Google Sheet must have a tab named `Gallery` with headers:
`id | title | category | imageUrl | uploadedAt | active`
