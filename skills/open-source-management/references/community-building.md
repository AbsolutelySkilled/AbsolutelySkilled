# Community Building

This reference covers strategies for growing and sustaining an open source community.
Load this file only when the user needs detailed guidance on contributor growth,
communication channels, events, or sponsorship.

---

## The contributor funnel

Every open source project has an implicit funnel that people move through:

```
Users (thousands)
  -> Issue reporters (hundreds)
    -> First-time contributors (dozens)
      -> Repeat contributors (handful)
        -> Core maintainers (2-5)
```

Your job as a maintainer is to reduce friction at every stage of this funnel.

### Stage 1: User to reporter

- Make it easy to report issues with good templates
- Don't require extensive triage from reporters (they're volunteering their time)
- Respond quickly, even if just to acknowledge the report
- Never be dismissive - "that's not a bug" without explanation drives people away

### Stage 2: Reporter to first-time contributor

This is the highest-leverage transition to optimize:

- **Label issues `good first issue`** - New contributors search for this label specifically
- **Write detailed issue descriptions** - Include what needs to change, where the code lives, and links to relevant docs
- **Have a working CONTRIBUTING.md** - If the dev setup takes more than 5 minutes, you'll lose most newcomers
- **Pre-review before PR** - Offer to discuss approach in the issue before they write code
- **Be patient with PRs** - First-time contributors may not know your code style, git workflow, or CI process

### Stage 3: First-time to repeat contributor

- Thank contributors publicly (in release notes, README, or a dedicated page)
- Give constructive, encouraging code review - teach, don't criticize
- Follow up after their PR merges: "Thanks for this! Here are similar issues if you're interested..."
- Invite them to discussions about project direction

### Stage 4: Repeat contributor to core maintainer

- Gradually increase trust: review rights, then triage rights, then commit rights
- Document the path to maintainership in GOVERNANCE.md
- Have an explicit "invitation" moment - don't assume they know they're welcome
- Set clear expectations about time commitment and responsibilities

---

## Communication channels

### GitHub Discussions

Best for: project-specific questions, feature proposals, showcases

- Enable GitHub Discussions in repository settings
- Create categories: Q&A, Ideas, Show and Tell, General
- Pin important threads (roadmap, FAQ, getting started)
- Convert actionable discussions to issues

### Discord / Slack

Best for: real-time community interaction, quick questions, social bonding

- Create channels: #general, #help, #development, #announcements
- Set up a welcome message with links to docs and contribution guide
- Moderate actively - one toxic interaction can drive away many quiet contributors
- Discord is preferred over Slack for OSS (no message history limits on free tier)

### Mailing lists

Best for: formal announcements, governance decisions, large established projects

- Lower barrier than chat (no account needed beyond email)
- Archived and searchable
- Better for async communication across time zones
- Tools: Google Groups, Mailman, Discourse

### Blog / Newsletter

Best for: release announcements, tutorials, project updates, community spotlights

- Publish release blog posts for major versions
- Write contributor spotlights to recognize community members
- Share the project roadmap quarterly
- Tools: Dev.to, Hashnode, GitHub Pages, Substack

---

## First-time contributor programs

### Hacktoberfest

- Annual event in October encouraging open source contributions
- Add the `hacktoberfest` topic to your repository
- Label issues with `hacktoberfest` to make them discoverable
- Expect higher volume but lower quality contributions - plan accordingly
- Have extra maintainer capacity available during October

### Google Summer of Code (GSoC)

- Paid program for students to work on open source projects
- Apply as an organization in January/February
- Write project ideas with clear scope and mentors
- Students work May-August with mentorship from your team
- Great for larger features that need sustained effort

### GitHub's "Up for Grabs" / Good First Issues

- Curate a list of beginner-friendly issues
- Use the `good first issue` label consistently
- Sites like up-for-grabs.net and goodfirstissue.dev aggregate these

---

## Recognition and retention

### All Contributors specification

Use the All Contributors bot to recognize all types of contributions, not just code:

- Code, Documentation, Design, Bug reports, Ideas, Reviews, Tests
- Adds a contributors table to your README automatically
- Install via: `.all-contributorsrc` config and GitHub bot

### Release note credits

Mention contributors in release notes:

```markdown
## Contributors

Thanks to @alice, @bob, and @charlie for their contributions to this release!
```

### Contributor ladder

Define explicit levels of involvement:

| Level | Criteria | Privileges |
|---|---|---|
| Contributor | Has merged at least one PR | Listed in Contributors |
| Reviewer | Sustained quality contributions over 3+ months | Can approve PRs |
| Committer | Deep knowledge of a subsystem, trusted judgment | Direct push access to their area |
| Maintainer | Holistic project understanding, community leadership | Full repository access, release authority |

---

## Sponsorship and sustainability

### GitHub Sponsors

- Enable GitHub Sponsors on your profile or organization
- Create tiers with clear benefits (logo on README, priority support, etc.)
- Write a compelling FUNDING.yml and sponsor page
- Publicly thank sponsors in release notes

### Open Collective

- Transparent funding - all expenses and income are public
- Good for projects with multiple maintainers sharing funds
- Supports recurring and one-time donations
- Fiscal hosts handle taxes and legal structure

### Corporate sponsorship

- Reach out to companies that depend on your project
- Offer sponsorship tiers: logo placement, priority issues, consulting hours
- Consider joining a foundation (Linux Foundation, CNCF, Apache) for larger projects
- Some companies fund OSS through programs like the FOSS Contributor Fund

### Grants

- NLNet Foundation - European funding for open internet projects
- Sovereign Tech Fund - German government funding for critical OSS infrastructure
- Mozilla MOSS - Grants for projects aligned with Mozilla's mission
- GitHub Accelerator - Annual program with funding and mentorship

---

## Avoiding burnout

Maintainer burnout is the number one threat to open source project health.

### Set boundaries

- Document your availability (e.g., "I review PRs on weekends, response within 7 days")
- Use GitHub's status feature to indicate when you're away
- It's okay to close your DMs - direct all questions to public channels

### Share the load

- Actively recruit co-maintainers - don't wait until you're burned out
- Delegate triage to trusted contributors
- Use bots for repetitive tasks (stale issues, CLA checks, welcome messages)
- Rotate on-call responsibilities among maintainers

### Say no gracefully

Templates for common situations:

**Feature request you won't implement:**
"Thanks for the suggestion! This doesn't align with the project's current direction,
but you're welcome to maintain it as a plugin/fork."

**PR you won't merge:**
"I appreciate the effort! Unfortunately, this approach doesn't fit our architecture.
I'd suggest [alternative approach]. Happy to discuss further in an issue."

**Demands for faster response:**
"This project is maintained by volunteers in our free time. We'll get to this as
soon as we can. If this is urgent for your business, consider sponsoring the project."
