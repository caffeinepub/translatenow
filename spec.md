# WorldsTranslator

## Current State
Full translation website. Backend has translate, getRecentTranslations, getSupportedLanguages.

## Requested Changes (Diff)

### Add
- Backend: visitCount stable var, trackVisit() update, getVisitCount() query
- Frontend: call trackVisit on mount, show visitor count in footer

### Modify
- Footer badge to show live visit count

### Remove
- Nothing

## Implementation Plan
1. Add stable visitCount to main.mo
2. Add trackVisit and getVisitCount functions
3. Update frontend to call trackVisit on load and display count
