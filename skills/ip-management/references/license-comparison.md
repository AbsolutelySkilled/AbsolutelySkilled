<!-- Part of the ip-management AbsolutelySkilled skill. Load this file when
     comparing open-source licenses, selecting a license, or assessing
     license compatibility for a project or dependency. -->

# Open-Source License Comparison

> **Disclaimer:** This document provides general educational information. It is not
> legal advice. Consult a qualified IP attorney for decisions with legal consequences.

---

## License overview

| License | SPDX ID | Type | Patent grant | Copyleft scope | Commercial use | Attribution required |
|---|---|---|---|---|---|---|
| MIT | MIT | Permissive | No | None | Yes | Yes (copyright notice) |
| Apache 2.0 | Apache-2.0 | Permissive | Yes | None | Yes | Yes (copyright + NOTICE file) |
| GPL v2 | GPL-2.0-only | Strong copyleft | No | Same license for modifications and combined works | Yes | Yes |
| GPL v3 | GPL-3.0-only | Strong copyleft | Yes | Same license for modifications and combined works | Yes | Yes |
| LGPL v2.1 | LGPL-2.1-only | Weak copyleft | No | Library modifications only; linking exempted | Yes | Yes |
| LGPL v3 | LGPL-3.0-only | Weak copyleft | Yes | Library modifications only; linking exempted | Yes | Yes |
| AGPL v3 | AGPL-3.0-only | Network copyleft | Yes | Same license + network use triggers disclosure | Yes | Yes |
| BSL 1.1 | BUSL-1.1 | Source available | No | Non-production use only until change date | Restricted (see notes) | Yes |

---

## Detailed profiles

### MIT

The simplest and most permissive widely-used license. Grants permission to use,
copy, modify, merge, publish, distribute, sublicense, and sell with minimal strings
attached.

**Obligations:**
- Retain the copyright notice and license text in all copies or substantial portions.

**What is allowed:**
- Use in proprietary commercial software without disclosing source.
- Relicense under a different license (including proprietary).
- Sublicense to end users under different terms.

**What is NOT required:**
- Patent grant (no explicit grant; contributors cannot sue for patent infringement
  but there is no formal protection).
- Contributing back modifications.

**Ideal for:** Libraries, developer tools, utilities intended for maximum adoption.

**Watch out for:** No patent protection. If a contributor holds a patent on the
licensed code, MIT gives no defense against a patent infringement claim.

---

### Apache 2.0

Functionally similar to MIT but adds an explicit patent grant and a patent
retaliation clause, making it the preferred license for corporate contributors.

**Obligations:**
- Retain copyright notices, license text, and NOTICE file (if present).
- State significant changes made to the original files.
- Include a copy of the Apache 2.0 license in distributions.

**Patent grant:** Explicitly grants a royalty-free license to any patents held
by contributors that are necessarily infringed by the contribution.

**Patent retaliation clause:** If you initiate patent litigation against any party
alleging the software infringes your patent, your patent license from all
contributors terminates automatically.

**Ideal for:** Corporate open-source projects, SDKs, frameworks intended for
enterprise use where patent clarity matters.

**Compatibility with GPL:**
- Apache 2.0 is compatible with GPL-3.0 (can be combined into a GPL-3.0 work).
- Apache 2.0 is NOT compatible with GPL-2.0 due to the additional patent retaliation
  restrictions, which GPL-2.0 does not permit.

---

### GPL v2

The original strong copyleft license from the GNU Project. Any work that includes
GPL-2.0 code or is a derivative work must be distributed under GPL-2.0 with source.

**Obligations:**
- Distribute source code when distributing binaries.
- License the entire combined work under GPL-2.0.
- Retain copyright notices and license texts.

**The "viral" effect:** If you link GPL-2.0 code into your application (not just
call it as a separate process), the combined work must be released under GPL-2.0.

**Ideal for:** Projects where the author wants to ensure all modifications and
derivative works remain open.

**Watch out for:**
- "GPL-2.0-only" means the code cannot be upgraded to GPL-3.0.
- "GPL-2.0-or-later" (also written GPL-2.0+) allows upgrading to GPL-3.0.
- Linux kernel uses GPL-2.0-only; this is why Android cannot statically link
  kernel code into user-space applications.

---

### GPL v3

Updates GPL-2.0 with explicit patent grants, Tivoization protections (requires
giving users the right to install modified software on hardware), and additional
anti-DRM provisions.

**Additions over GPL-2.0:**
- Explicit patent grant from contributors.
- Anti-Tivoization: cannot lock down hardware so users cannot run modified software.
- Compatible with Apache-2.0 (GPL-2.0 is not).

**Obligations:** Same as GPL-2.0 plus the above.

**Ideal for:** Modern copyleft projects that want patent protection and hardware
freedom guarantees.

---

### LGPL v2.1 and v3

The "Lesser" (or "Library") GPL was designed to allow proprietary applications to
use open-source libraries without triggering the full copyleft requirement.

**Key distinction from GPL:**
- Modifications to the LGPL library itself must be released under LGPL.
- An application that merely links to (uses) the LGPL library does NOT need to be
  released under LGPL - it can remain proprietary.

**Linking rules:**
- Static linking: You must allow users to relink with a modified version of the
  library. This often means distributing object files or making relinking easy.
- Dynamic linking: Generally safe for proprietary applications.

**LGPL v3 vs v2.1:**
- LGPL-3.0 is built on top of GPL-3.0 and inherits its patent grant and
  anti-Tivoization provisions.
- LGPL-2.1 is more common in practice (Qt, GNU C Library use LGPL-2.1).

**Ideal for:** Libraries that should be freely usable by both open-source and
proprietary applications (e.g., GUI toolkits, language bindings, utility libraries).

**Watch out for:** "Merely using" the library through its public API is generally
safe, but embedding or modifying the library internals triggers copyleft obligations.
Consult legal counsel for static linking scenarios.

---

### AGPL v3

Extends GPL-3.0 to close the "SaaS loophole." Under GPL, if you run software on
a server and let users interact with it over the network, you do not have to
distribute source because you are not "distributing" the software. AGPL removes
this exemption.

**Key addition over GPL-3.0:**
- If you run AGPL software on a server and users interact with it over a network,
  you must make the complete corresponding source code available to those users.

**Implications for SaaS:**
- Running an AGPL application as a SaaS product requires you to provide users with
  the source code of the entire modified application.
- This is intentional: AGPL is used by projects that want to prevent cloud providers
  from offering the software as a hosted service without contributing back.

**Examples of AGPL projects:** MongoDB (before relicensing to SSPL), Mastodon,
many GNU projects.

**Ideal for:** Infrastructure software where the author wants to prevent commercial
hosting without contribution. NOT suitable for use in proprietary SaaS products
without a commercial license.

**Commercial dual-licensing:** Many AGPL projects offer a commercial license for
companies that cannot comply with AGPL (e.g., MongoDB, Grafana). This is a common
open-core business model.

---

### BSL 1.1 (Business Source License)

A source-available license, not a traditional open-source license. Created by
MariaDB, now used by HashiCorp (Terraform), Couchbase, and others.

**Core mechanism:**
- The code is available to read and use under specified conditions.
- Commercial production use is restricted (the "Additional Use Grant" defines exactly
  what is allowed, e.g., internal non-production use).
- After a defined **Change Date** (typically 4 years from release), the license
  converts to a specified open-source license (usually GPL-2.0, GPL-3.0, or Apache-2.0).

**Key fields in a BSL license:**
- **Licensor:** The copyright holder.
- **Licensed Work:** The specific version of the software.
- **Additional Use Grant:** What non-production or limited commercial use is permitted.
- **Change Date:** When the license converts.
- **Change License:** The open-source license it converts to.

**What is allowed:**
- Reading, modifying, and contributing to the code.
- Non-production use (testing, development, evaluation).
- Whatever the "Additional Use Grant" explicitly permits.

**What is NOT allowed (without a commercial license):**
- Using the software in a production service that competes with the licensor's
  commercial offering.
- Offering the software as a managed service (hosting for others) if the licensor
  restricts this.

**Ideal for:** Commercial open-core companies that want transparency of source code
while protecting against direct competition from SaaS providers.

**NOT an OSI-approved open-source license.** Do not include BSL dependencies in
projects that require OSI-compliant open-source licenses.

---

## Compatibility matrix

Can code under License A be combined into a project distributed under License B?

| | MIT | Apache-2.0 | GPL-2.0 | GPL-3.0 | LGPL-2.1 | LGPL-3.0 | AGPL-3.0 |
|---|---|---|---|---|---|---|---|
| **MIT** | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Apache-2.0** | Yes | Yes | No | Yes | No | Yes | Yes |
| **GPL-2.0** | Yes | No | Yes | No | Yes | No | No |
| **GPL-3.0** | Yes | Yes | No | Yes | Yes | Yes | Yes |
| **LGPL-2.1** | Yes | No | Yes | Yes | Yes | Yes | Yes |
| **LGPL-3.0** | Yes | Yes | No | Yes | Yes | Yes | Yes |
| **AGPL-3.0** | Yes | Yes | No | Yes | Yes | Yes | Yes |

"Yes" = A can be included in a project distributed as B (A is compatible as input to B).

**Key incompatibilities to remember:**
- Apache-2.0 cannot be combined into GPL-2.0 (patent retaliation clause is an
  additional restriction that GPL-2.0 prohibits).
- GPL-2.0 and GPL-3.0 are not directly compatible with each other. A project cannot
  be distributed under both simultaneously unless all code is "GPL-2.0-or-later."

---

## Quick-reference: choosing a license

| Goal | Recommended license |
|---|---|
| Maximum adoption, minimal friction | MIT |
| Corporate-friendly with patent protection | Apache-2.0 |
| Ensure all modifications stay open-source | GPL-3.0 |
| Library usable in proprietary apps but modifications must be shared | LGPL-2.1 or LGPL-3.0 |
| Prevent SaaS providers from hosting without contributing back | AGPL-3.0 |
| Commercial open-core: protect business for a period, then open-source | BSL 1.1 with 4-year change date |
| Dual-license: open-source community + commercial enterprise | MIT or GPL-3.0 + commercial license |
