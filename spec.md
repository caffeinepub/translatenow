# TranslateNow

## Current State
New project. Empty backend actor and default frontend scaffold.

## Requested Changes (Diff)

### Add
- Full translation website with landing page + functional translation widget
- Backend: store translation history per session, support language pairs
- Frontend: hero section, translation widget (input/output cards with language selectors), supported languages section, key features section, footer
- HTTP outcall to a free translation API (MyMemory) for actual translation
- Copy to clipboard, swap languages, character counter

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan
1. Backend: HTTP outcall to MyMemory translation API, store recent translations
2. Frontend: Full landing page matching design preview - nav, hero, translator widget, features, footer
