<!-- Part of the localization-i18n AbsolutelySkilled skill. Load this file when
     working with translation pipelines, TMS integration, message catalogs, or CI extraction. -->

# Translation Workflows

A translation workflow connects developers writing code to translators producing
localized strings. A good workflow is automated, auditable, and prevents untranslated
strings from reaching production.

---

## The standard pipeline

```
1. Developer writes code with message keys and default messages
2. CI extracts translatable strings into message catalogs
3. Catalogs are sent to TMS (translation management system)
4. Translators translate strings in the TMS
5. Translated catalogs are pulled back into the codebase
6. App loads the correct locale bundle at runtime
7. Missing translations fall back to the default locale
```

---

## Message catalog formats

### JSON (most common for web)

Used by react-intl, i18next, vue-i18n, and most modern web frameworks.

**Flat structure (i18next default):**
```json
{
  "greeting": "Hello, {{name}}!",
  "cart.items": "You have {{count}} items",
  "cart.empty": "Your cart is empty"
}
```

**Nested structure (i18next with namespaces):**
```json
{
  "cart": {
    "items": "You have {{count}} items",
    "empty": "Your cart is empty"
  }
}
```

**ICU format (react-intl / FormatJS):**
```json
{
  "greeting": {
    "defaultMessage": "Hello, {name}!",
    "description": "Greeting shown on the home page"
  },
  "cart.items": {
    "defaultMessage": "{count, plural, one {# item} other {# items}}",
    "description": "Item count in shopping cart"
  }
}
```

### XLIFF (XML Localization Interchange File Format)

Industry standard for professional translation. Required by many TMS platforms.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xliff version="2.0" srcLang="en" trgLang="fr">
  <file id="messages">
    <unit id="greeting">
      <segment>
        <source>Hello, {name}!</source>
        <target>Bonjour, {name} !</target>
      </segment>
      <notes>
        <note category="description">Greeting shown on the home page</note>
      </notes>
    </unit>
  </file>
</xliff>
```

### PO/POT (Gettext)

Common in Python (Django), PHP, and C projects.

```po
#: src/components/Header.js:42
#. Greeting shown on the home page
msgid "Hello, {name}!"
msgstr "Bonjour, {name} !"

#: src/components/Cart.js:15
msgid "{count, plural, one {# item} other {# items}}"
msgstr "{count, plural, one {# article} other {# articles}}"
```

---

## String extraction

### FormatJS (react-intl)

```bash
# Extract from TypeScript/JavaScript source
npx formatjs extract 'src/**/*.{ts,tsx,js,jsx}' \
  --out-file lang/en.json \
  --id-interpolation-pattern '[sha512:contenthash:base64:6]'

# Compile extracted messages for production (flattens, strips descriptions)
npx formatjs compile lang/en.json --out-file compiled/en.json
npx formatjs compile lang/fr.json --out-file compiled/fr.json
```

### i18next-parser

```bash
npx i18next-parser --config i18next-parser.config.js
```

Config example:

```javascript
// i18next-parser.config.js
module.exports = {
  locales: ['en', 'fr', 'de', 'ja', 'ar'],
  output: 'public/locales/$LOCALE/$NAMESPACE.json',
  input: ['src/**/*.{js,jsx,ts,tsx}'],
  defaultNamespace: 'translation',
  keySeparator: '.',
  namespaceSeparator: ':',
};
```

### gettext (Python/Django)

```bash
# Extract strings
python manage.py makemessages -l fr -l de -l ar

# Compile after translation
python manage.py compilemessages
```

---

## Translation management systems (TMS)

| TMS | Strengths | Format support |
|---|---|---|
| Crowdin | Developer-friendly, GitHub/GitLab integration, OTA updates | JSON, XLIFF, PO, Android XML, iOS strings |
| Lokalise | Fast UI, API-first, CLI tool for CI | JSON, XLIFF, PO, ARB, YAML |
| Phrase (formerly PhraseApp) | Enterprise features, in-context editor | JSON, XLIFF, PO, YAML, properties |
| Transifex | Open-source friendly, large translator community | PO, JSON, XLIFF, YAML |
| Weblate | Self-hosted option, open source | PO, JSON, XLIFF, Android XML |

### Typical TMS integration

```yaml
# .crowdin.yml example
project_id: "123456"
api_token_env: CROWDIN_TOKEN
files:
  - source: /lang/en.json
    translation: /lang/%locale%.json
```

```bash
# Push source strings to TMS
crowdin upload sources

# Pull translations
crowdin download
```

---

## CI/CD integration

### Pre-merge checks

Add these to your CI pipeline:

```yaml
# GitHub Actions example
- name: Extract i18n strings
  run: npx formatjs extract 'src/**/*.{ts,tsx}' --out-file lang/en.json

- name: Check for untranslated strings
  run: |
    node scripts/check-translations.js
```

Translation completeness check script:

```javascript
// scripts/check-translations.js
const en = require('../lang/en.json');
const fr = require('../lang/fr.json');

const enKeys = Object.keys(en);
const frKeys = Object.keys(fr);
const missing = enKeys.filter(key => !frKeys.includes(key));

if (missing.length > 0) {
  console.error(`Missing French translations: ${missing.length}`);
  missing.forEach(key => console.error(`  - ${key}`));
  process.exit(1);
}
```

### Post-merge automation

After merging new strings to main:
1. CI extracts strings and pushes to TMS
2. TMS notifies translators of new strings
3. Translators complete translations
4. TMS opens a PR with new translations (or pushes directly)
5. CI validates completeness and merges

---

## Pseudolocalization

Pseudolocalization transforms English strings to simulate translation issues
without actual translation. It catches layout bugs, truncation, and hardcoded
strings early.

### What pseudolocalization does

| Transformation | Purpose | Example |
|---|---|---|
| Accented characters | Test encoding, font support | `Hello` -> `Hello` |
| Text expansion (~35%) | Test layout with longer text | `Save` -> `[Saavee____]` |
| Brackets/markers | Find untranslated strings | `Save` -> `[Save]` |
| Bidi markers | Test RTL readiness | Adds RLM/LRM characters |

### FormatJS pseudolocalization

```bash
npx formatjs compile lang/en.json \
  --out-file compiled/pseudo.json \
  --pseudo-locale en-XA
```

### i18next pseudolocalization

Use the `i18next-pseudo` plugin:

```javascript
import i18n from 'i18next';
import Pseudo from 'i18next-pseudo';

i18n.use(new Pseudo({ enabled: process.env.NODE_ENV === 'development' }));
```

---

## Best practices

1. **Extract strings in CI, not manually** - Manual extraction misses strings and drifts
2. **Use translator comments** - Add `description` fields explaining context
3. **Never machine-translate and ship** - Machine translation is a draft, not a final product
4. **Version your message catalogs** - Track which strings were added/changed per release
5. **Set up OTA (over-the-air) updates** - Update translations without a full app deploy
6. **Test with pseudolocalization** in development, real languages in staging
7. **Monitor translation coverage** per locale in your CI dashboard
