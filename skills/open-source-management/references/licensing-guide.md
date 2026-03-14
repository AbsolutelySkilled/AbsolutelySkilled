# Licensing Guide

This reference covers open source license selection, compatibility, and strategy in
depth. Load this file only when the user needs detailed licensing guidance beyond the
quick comparison table in the main SKILL.md.

---

## License families

Open source licenses fall into two broad families:

### Permissive licenses

Permissive licenses allow users to do almost anything with the code, including using
it in proprietary software, as long as they include the original copyright notice.

**MIT License**
- The most popular open source license
- Short (about 170 words), easy to understand
- Requires: copyright notice in copies
- Allows: commercial use, modification, distribution, private use
- Does NOT require: sharing modifications, patent grant
- Best for: libraries, tools, and projects seeking maximum adoption

**Apache License 2.0**
- Permissive like MIT but with explicit patent protections
- Requires: copyright notice, state changes, include license text
- Includes: explicit patent grant from contributors
- Includes: patent retaliation clause (if you sue for patent infringement, you lose your license)
- Best for: projects where patent concerns matter (enterprise, cloud, hardware-adjacent)

**BSD 2-Clause and 3-Clause**
- Functionally similar to MIT
- 3-Clause adds a "no endorsement" clause (can't use project name to promote derivatives)
- Less common than MIT for new projects but still widely used

**ISC License**
- Functionally equivalent to MIT but even shorter
- Preferred by some projects (e.g., OpenBSD ecosystem) for its brevity

### Copyleft licenses

Copyleft licenses require that derivative works also be distributed under the same
(or compatible) license. This ensures modifications stay open source.

**GNU General Public License v3 (GPL-3.0)**
- Strong copyleft: any software that includes GPL code must also be GPL
- "Linking" GPL code into a program makes the whole program GPL
- Includes patent grant and anti-Tivoization provisions
- Best for: projects that want to ensure all derivatives remain open source
- Caution: many companies have policies against using GPL dependencies

**GNU Lesser General Public License v3 (LGPL-3.0)**
- Weak copyleft: modifications to the LGPL library must be shared, but programs
  that merely link to it (use it as a dependency) do not need to be LGPL
- Best for: libraries that want copyleft for the library code but permissive linking
- Common in: C/C++ libraries (glibc, Qt)

**GNU Affero General Public License v3 (AGPL-3.0)**
- Like GPL but closes the "SaaS loophole" - if you run modified AGPL software as a
  network service, you must make the source available to users of that service
- Best for: server-side software that you want to keep open (databases, web apps)
- Used by: MongoDB (before SSPL), Mastodon, Nextcloud

**Mozilla Public License 2.0 (MPL-2.0)**
- File-level copyleft: modifications to MPL files must be shared, but new files
  in the same project can use any license
- A middle ground between permissive and strong copyleft
- Best for: projects wanting copyleft with less friction than GPL

---

## License compatibility matrix

When combining code from different licenses, compatibility determines what the
combined work's license must be:

| License A | License B | Compatible? | Combined license |
|---|---|---|---|
| MIT | MIT | Yes | MIT |
| MIT | Apache 2.0 | Yes | Apache 2.0 |
| MIT | GPL 3.0 | Yes | GPL 3.0 (copyleft absorbs permissive) |
| Apache 2.0 | GPL 3.0 | Yes | GPL 3.0 |
| Apache 2.0 | GPL 2.0 only | No | Incompatible (patent clause conflict) |
| GPL 3.0 | AGPL 3.0 | Yes | AGPL 3.0 |
| GPL 2.0 | GPL 3.0 | Only if "or later" | GPL 3.0 (if "GPL 2.0 or later") |
| MIT | LGPL 3.0 | Yes | LGPL 3.0 for the library, MIT for the rest |
| MPL 2.0 | GPL 3.0 | Yes | GPL 3.0 |
| MPL 2.0 | Apache 2.0 | Yes | Either at file level |

**Key rule**: Permissive licenses are compatible with everything. Copyleft licenses
absorb permissive ones. Two different copyleft licenses are usually incompatible
unless one explicitly allows it.

---

## Dual licensing strategies

Dual licensing means releasing the same code under two licenses simultaneously.
Users choose which license to accept.

### Open core / Commercial dual license
- Release under AGPL (or GPL) for open source use
- Sell a commercial license for companies that don't want copyleft obligations
- Examples: MySQL (GPL + commercial), MongoDB (originally AGPL + commercial)
- Requires: owning all copyright (CLA needed from contributors)

### Permissive + Copyleft dual license
- Release under both MIT and GPL
- Users who want permissive terms use MIT; users who want copyleft protections use GPL
- Less common; mainly used for ecosystem flexibility

### CLA requirements for dual licensing
- If you plan to dual license, you MUST have a Contributor License Agreement (CLA)
  or copyright assignment from all contributors
- Without CLA: each contributor owns their copyright and you cannot relicense their work
- Tools: CLA Assistant (GitHub App), DCO (Developer Certificate of Origin) as lighter alternative

---

## Common licensing decisions

### "I want maximum adoption"
Use **MIT**. It's the most recognized, shortest to read, and has no conditions that
scare away corporate legal teams.

### "I want patent protection"
Use **Apache 2.0**. The explicit patent grant protects both you and your users.

### "I want to prevent proprietary forks"
Use **GPL-3.0** for applications or **LGPL-3.0** for libraries. Code modifications
must be shared under the same terms.

### "I'm building a SaaS product and want to stay open"
Use **AGPL-3.0**. It requires source distribution even when the software is only
offered as a service, not distributed as a binary.

### "I want copyleft but without the GPL stigma"
Use **MPL-2.0**. File-level copyleft is less invasive and better understood by
corporate legal teams than GPL.

### "I want to place code in the public domain"
Use **Unlicense** or **CC0**. Note that "public domain" is not a legal concept in
all jurisdictions, so these licenses provide a fallback permissive grant.

---

## Server Side Public License (SSPL) and similar

The SSPL (created by MongoDB) is NOT considered open source by the OSI. It requires
that anyone offering the software as a service must open source their entire service
stack. This goes beyond AGPL's requirements.

Other non-OSI licenses to be aware of:
- **Business Source License (BSL/BUSL)** - Source available, converts to open source after a time delay
- **Elastic License 2.0** - Permissive-like but prohibits offering as a managed service
- **Commons Clause** - Addon that restricts selling the software

These are "source available" licenses, not open source licenses. Do not describe them
as open source when advising users.

---

## Changing licenses

Changing an established project's license is one of the most complex operations in OSS:

1. You must have copyright over ALL code - either through CLA or by being the sole author
2. Contributions without a CLA are owned by their contributors - you cannot relicense them
3. Options when you don't own all copyright:
   - Get written consent from every contributor
   - Rewrite the contributed code from scratch
   - Fork from a point before the contribution you can't relicense
4. Always announce license changes well in advance and explain the reasoning
5. Previous versions remain under the old license - you can only change going forward
