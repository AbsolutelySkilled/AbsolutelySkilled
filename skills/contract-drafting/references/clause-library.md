<!-- Part of the contract-drafting AbsolutelySkilled skill. Load this file when
     the user needs specific clause language, plain-language explanations of
     contract provisions, or negotiation guidance on a particular clause. -->

# Clause Library

A reference of common commercial contract clauses with plain-language explanations,
market-standard positions, and negotiation notes. All language is a starting point -
have qualified legal counsel review before use.

---

## Definitions

### Confidential Information

**Market-standard mutual NDA language:**
```
"Confidential Information" means any information disclosed by one party (the
"Disclosing Party") to the other party (the "Receiving Party"), either directly
or indirectly, in writing, orally, or by inspection of tangible objects, that is
designated as confidential or that reasonably should be understood to be
confidential given the nature of the information and the circumstances of
disclosure.
```

**Standard exclusions (always include):**
```
Confidential Information does not include information that: (a) is or becomes
generally known to the public other than through the Receiving Party's breach of
this Agreement; (b) was rightfully known to the Receiving Party before receipt
from the Disclosing Party; (c) is received from a third party without restriction
on disclosure; or (d) was independently developed by the Receiving Party without
use of the Disclosing Party's Confidential Information.
```

**Plain-language explanation:** "Confidential Information" covers anything sensitive
shared between the parties that isn't already public. The four exclusions are
standard and non-negotiable - they prevent absurd outcomes like treating publicly
available information as confidential.

**Negotiation note:** Vendors often try to narrow the definition to only written
materials marked "CONFIDENTIAL." Resist this - oral disclosures in demos and
technical discussions are highly sensitive and should be covered.

---

## Indemnification

### IP Indemnification (vendor protects customer)

**Market-standard language:**
```
Vendor shall defend, indemnify, and hold harmless Customer and its officers,
directors, employees, and agents from and against any claims, damages, losses,
and expenses (including reasonable attorneys' fees) arising out of or relating
to any third-party claim that the Service, as delivered by Vendor, infringes
or misappropriates any patent, copyright, trademark, or trade secret of a
third party. Vendor's obligations under this section are conditioned upon:
(a) Customer providing prompt written notice of the claim; (b) Customer granting
Vendor sole control of the defense and settlement; and (c) Customer providing
reasonable cooperation. Vendor shall have no obligation for claims arising from:
(i) Customer's modification of the Service; (ii) use of the Service in combination
with products not provided by Vendor; or (iii) Customer's failure to use an updated
version of the Service that would have avoided the claim.
```

**Plain-language explanation:** If someone sues the customer claiming the vendor's
software steals their IP, the vendor pays to defend that lawsuit. The three carve-outs
are standard - the vendor isn't responsible if the customer caused the infringement.

**Negotiation note:** Customers should insist on an IP indemnity uncapped from the
liability cap. Vendors should insist on sole control of the defense. Both positions
are standard.

---

## Limitation of Liability

### Mutual liability cap

**Market-standard SaaS language:**
```
IN NO EVENT SHALL EITHER PARTY'S AGGREGATE LIABILITY ARISING OUT OF OR RELATED
TO THIS AGREEMENT EXCEED THE TOTAL AMOUNTS PAID OR PAYABLE BY CUSTOMER TO VENDOR
IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM.
```

**Standard carve-outs (must be explicitly listed):**
```
The foregoing limitation of liability shall not apply to: (a) either party's
indemnification obligations under Section [X] (Intellectual Property Indemnity);
(b) either party's confidentiality obligations under Section [X]; (c) damages
arising from a party's gross negligence or willful misconduct; (d) damages
arising from death or personal injury caused by a party's negligence; or
(e) any liability that cannot be excluded or limited by applicable law.
```

**Plain-language explanation:** No matter how bad the breach, the most either party
can recover is one year's fees. The carve-outs prevent this cap from shielding truly
egregious behavior - IP theft, confidentiality breaches, and personal injury claims
remain uncapped.

**Negotiation note:** Customers push for higher caps (24 months) or uncapped for
data breaches. Vendors resist. A reasonable compromise for high-sensitivity data:
uncapped for data breaches involving regulated data (health, financial).

---

### Mutual consequential damages exclusion

**Market-standard language:**
```
IN NO EVENT SHALL EITHER PARTY BE LIABLE TO THE OTHER FOR ANY INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED
TO LOSS OF PROFITS, LOSS OF REVENUE, LOSS OF DATA, LOSS OF GOODWILL, BUSINESS
INTERRUPTION, OR COST OF SUBSTITUTE GOODS OR SERVICES, HOWEVER CAUSED AND UNDER
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT
LIABILITY, OR OTHERWISE, EVEN IF SUCH PARTY HAS BEEN ADVISED OF THE POSSIBILITY
OF SUCH DAMAGES.
```

**Carve-outs** - same as for the liability cap; add indemnification obligations.

**Plain-language explanation:** Neither party can sue the other for lost profits,
lost customers, or other downstream harms - only direct losses. This prevents a
scenario where a $10,000 contract creates unlimited liability for a business that
lost a $10M deal due to downtime.

---

## Confidentiality Obligations

### Receiving party obligations

**Market-standard language:**
```
The Receiving Party shall: (a) use the Confidential Information of the Disclosing
Party only to evaluate or pursue the business relationship contemplated between the
parties (the "Purpose"); (b) protect the Confidential Information of the Disclosing
Party using at least the same degree of care that the Receiving Party uses for its
own Confidential Information of similar nature, but in no event less than reasonable
care; (c) not disclose the Confidential Information of the Disclosing Party to any
third party without the Disclosing Party's prior written consent; and (d) limit
disclosure to those employees and contractors who have a need to know for the
Purpose and who are bound by confidentiality obligations at least as protective
as those in this Agreement.
```

**Negotiation note - residuals clause (RED FLAG):** Vendors sometimes insert:

> "Notwithstanding the foregoing, the Receiving Party may use Residual Knowledge
> for any purpose. 'Residual Knowledge' means information retained in the
> unaided memories of the Receiving Party's personnel who have had access to
> the Confidential Information."

This clause effectively allows employees who saw confidential information to use
it for any purpose after they remember it. It is a significant weakening of
confidentiality. Strike it entirely or narrow to specifically identified categories
that genuinely cannot be controlled (e.g., general skills and know-how, not
product roadmaps or customer lists).

---

## Term and Termination

### Termination for cause

**Market-standard language:**
```
Either party may terminate this Agreement upon written notice if the other party
materially breaches this Agreement and fails to cure such breach within thirty (30)
days after receipt of written notice specifying the breach in reasonable detail.
```

**Plain-language explanation:** Either party can exit if the other seriously
violates the contract - but only after giving 30 days to fix it. The 30-day cure
period prevents termination over minor or unintentional violations.

**Negotiation note:** For certain breaches (payment failure, IP infringement, data
breach), the breaching party should not receive a cure period or it should be
shortened to 10 days. Add carve-outs for incurable breaches.

### Termination for convenience

**Market-standard SaaS language:**
```
Either party may terminate this Agreement for any reason or no reason upon
sixty (60) days' prior written notice to the other party.
```

**Negotiation note:** Vendors sometimes resist termination-for-convenience entirely
(particularly in annual contracts). Customers should insist on a T4C right,
even if the notice period is longer (90 days) or a fee applies (one month's fees).

### Effect of termination

**Key provisions to include:**
```
Upon expiration or termination: (a) all licenses granted hereunder shall
immediately terminate; (b) each party shall return or certify destruction of
the other party's Confidential Information within thirty (30) days; (c) Vendor
shall make Customer Data available for export in machine-readable format for
sixty (60) days, after which Vendor may delete all Customer Data; and (d) all
payment obligations accrued prior to termination shall survive.
```

---

## Service Level Agreement (SLA)

### Uptime commitment

**Market-standard SaaS language:**
```
Vendor will use commercially reasonable efforts to make the Service available with
a Monthly Uptime Percentage of at least 99.9% ("Uptime Commitment"). "Monthly
Uptime Percentage" means the total number of minutes in a calendar month minus
the number of minutes of Downtime during that month, divided by the total number
of minutes in that calendar month.

"Downtime" means a period of more than five (5) consecutive minutes during which
the Service is unavailable, excluding: (a) scheduled maintenance windows communicated
at least 48 hours in advance; (b) customer-caused outages; (c) force majeure events;
and (d) third-party service provider outages outside Vendor's reasonable control.
```

**SLA credit schedule (standard):**
```
Monthly Uptime   |  Credit
< 99.9%          |  10% of monthly fees
< 99.0%          |  25% of monthly fees
< 95.0%          |  50% of monthly fees
```

**Plain-language explanation:** 99.9% uptime means no more than ~44 minutes of
downtime per month. Credits are the sole remedy for SLA failures - customers
cannot sue for damages from downtime if the SLA credit structure applies.

**Negotiation note:** Customers with mission-critical workflows should push for
SLA credits as a floor, not a ceiling, or negotiate a right to terminate for
repeated SLA failures (e.g., three months below 99.9% in a 12-month period).

---

## Governing Law and Dispute Resolution

### Governing law

**Market-standard language:**
```
This Agreement shall be governed by and construed in accordance with the laws of
the State of [Delaware/New York/California], without regard to its conflict of
laws provisions.
```

**Negotiation note:** Delaware is neutral and favored for corporate matters. New York
is favored for financial agreements. Each party will push for their home jurisdiction.
Delaware or New York are usually acceptable compromises for U.S. parties.

### Dispute resolution - arbitration clause

**Market-standard commercial arbitration language:**
```
Any dispute, controversy, or claim arising out of or relating to this Agreement,
including the formation, interpretation, breach, or termination thereof, shall be
resolved by binding arbitration administered by JAMS in accordance with its
Comprehensive Arbitration Rules. The arbitration shall be conducted by a single
arbitrator in [City, State]. The arbitrator's award shall be final and binding and
may be entered as a judgment in any court of competent jurisdiction. Either party
may seek emergency equitable relief in a court of competent jurisdiction to prevent
irreparable harm pending the appointment of an arbitrator.
```

**Plain-language explanation:** Instead of going to court, disputes go to a private
arbitrator (JAMS is a major provider). Arbitration is faster and more confidential
than litigation. The carve-out for emergency injunctions is important - you don't
want to wait for arbitrator appointment to stop a confidentiality breach.

---

## Assignment

### Standard anti-assignment with M&A carve-out

**Market-standard language:**
```
Neither party may assign or transfer this Agreement, or any rights or obligations
hereunder, without the prior written consent of the other party, which shall not
be unreasonably withheld, conditioned, or delayed; provided, however, that either
party may assign this Agreement without consent in connection with a merger,
acquisition, reorganization, or sale of all or substantially all of its assets,
so long as the assignee agrees in writing to be bound by the terms of this
Agreement. Any purported assignment in violation of this section shall be null
and void.
```

**Negotiation note:** Customers should add a right to terminate if assigned to a
direct competitor. Vendors should ensure the acquirer is not restricted from using
the product after an M&A event.

---

## Data Protection

### Controller-processor relationship (GDPR Article 28 summary clause)

**Key language for a DPA or SaaS agreement:**
```
To the extent Vendor processes Personal Data on behalf of Customer in connection
with the Services, the parties agree that: (a) Customer is the controller and
Vendor is the processor of such Personal Data; (b) Vendor shall process Personal
Data only in accordance with Customer's documented instructions; (c) Vendor shall
implement appropriate technical and organizational measures to protect Personal Data
against unauthorized access, disclosure, alteration, or destruction; (d) Vendor
shall notify Customer without undue delay, and in any event within seventy-two (72)
hours, upon becoming aware of a Personal Data Breach; (e) Vendor shall assist
Customer in responding to Data Subject rights requests; and (f) upon termination,
Vendor shall delete or return all Personal Data as directed by Customer.
```

**Plain-language explanation:** The customer owns and controls the data; the vendor
only processes it as instructed. The 72-hour breach notification aligns with GDPR's
mandatory notification window for controllers to notify their supervisory authority.

---

## Force Majeure

### Standard force majeure clause

**Market-standard language:**
```
Neither party shall be liable to the other for any delay or failure to perform
its obligations under this Agreement (except payment obligations) if such delay
or failure is caused by circumstances beyond its reasonable control, including
acts of God, natural disasters, pandemic, government action, war, terrorism,
labor disputes, or failures of third-party internet providers, provided that:
(a) the affected party gives prompt written notice of the force majeure event;
(b) the affected party uses commercially reasonable efforts to resume performance;
and (c) if the force majeure event continues for more than ninety (90) days,
either party may terminate the Agreement upon written notice.
```

**Plain-language explanation:** If an earthquake or pandemic prevents performance,
neither party is in breach. Payment obligations are explicitly excluded - a vendor
cannot claim force majeure to avoid paying invoices. The 90-day termination right
prevents indefinite suspension of the contract.
