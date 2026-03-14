<!-- Part of the ultimate-ui AbsolutelySkilled skill. Load this file when
     working with UI text, button labels, error messages, empty states, or any user-facing copy. -->

# Microcopy and UX Writing

## Core principles
1. Be specific, not vague ("Save changes" not "Submit")
2. Be concise (every word must earn its place)
3. Use the user's language, not technical jargon
4. Lead with the action or benefit
5. Be consistent (same action = same word everywhere)

## Button labels
- Use verb + noun: "Create project", "Delete account", "Send message"
- Primary actions: specific verb ("Save changes" not "OK")
- Cancel: always "Cancel", never "No" or "Abort"
- Destructive: name the thing being destroyed ("Delete project" not "Delete")
- Loading state: "Saving..." / "Sending..." (present participle)
- Success state: "Saved" / "Sent" (past tense, brief)

Good/bad examples table:
| Bad | Good | Why |
|---|---|---|
| Submit | Save changes | Specific action |
| Click here | Learn more | Describes destination |
| OK | Confirm payment | Names the consequence |
| Yes/No | Keep draft / Delete draft | No ambiguity |
| Send | Send invitation | Names what's being sent |

## Error messages
Formula: What happened + Why + What to do next

Good examples:
- "Email address is already in use. Try signing in instead."
- "Password must be at least 8 characters."
- "Connection lost. Check your internet and try again."
- "File too large. Maximum size is 10MB."

Bad examples:
- "Error" (what error?)
- "Invalid input" (what's invalid?)
- "Something went wrong" (with no next step)
- "Error code: 422" (meaningless to users)

Rules:
- Never blame the user ("You entered an invalid email" -> "Please enter a valid email")
- Use plain language, not error codes
- Always provide a next step or recovery action
- Be specific about constraints ("8 characters" not "too short")

## Empty states
Formula: What this area is for + Why it's empty + How to fill it

Templates by type:
1. First use: "[Thing] you create will appear here. [CTA to create first one]"
2. No results: "No [things] match your search. Try different keywords or [clear filters]."
3. All done: "You're all caught up! No new [things] to review."
4. Error: "Couldn't load [things]. [Retry button]"

Good examples:
- "No projects yet. Create your first project to get started." + [Create project] button
- "No messages match 'design review'. Try a different search."
- "All tasks complete! Enjoy your day."

## Form labels and help text
- Label: noun or short noun phrase ("Email address", "Password")
- Help text: below the field, gray, explains constraints or format
  - "Must be at least 8 characters with one number"
  - "We'll send a confirmation to this address"
- Placeholder: example value only, never as a label
  - Good placeholder: "jane@example.com"
  - Bad placeholder: "Enter your email" (that's a label)

## Confirmation dialogs
Title: Action + object ("Delete this project?")
Body: Explain consequence ("This will permanently delete the project and all its data. This action cannot be undone.")
Actions: [Cancel] [Delete project] (destructive button names the action)

Never: "Are you sure?" as the title. Be specific about what's happening.

## Success messages
- Brief: "Project created" / "Changes saved" / "Invitation sent"
- Include next step if relevant: "Project created. Invite your team to get started."
- Toast for routine actions, full page for milestones (account created, onboarding complete)

## Loading text
- Name what's loading: "Loading messages..." not "Loading..."
- For long operations: show progress ("Importing 42 of 128 contacts...")
- Skeleton screens don't need text (the layout itself communicates)

## Onboarding copy
- Welcome: "Welcome to [Product]! Let's get you set up." (warm, brief)
- Step descriptions: one sentence per step explaining value, not mechanics
- Skip option: "Skip for now" (implies they can come back)
- Completion: "You're all set! Here's your [dashboard/workspace]."

## Tooltip text
- One sentence max, no period
- Explain what the element does, not what it is
- Good: "Copy link to clipboard"
- Bad: "This is the copy button"

## Dates and times
- Relative for recent: "Just now", "5 min ago", "2 hours ago", "Yesterday"
- Absolute for older: "Jan 15, 2024" or "Jan 15, 2024 at 3:30 PM"
- Switch from relative to absolute at ~1 week
- Always show full date on hover/tooltip

## Numbers and data
- Use commas: 1,234 not 1234
- Abbreviate large numbers: 1.2M, 450K
- Currency: $49.99 (always 2 decimal places)
- Percentages: 42% (no decimal) or 42.5% (one decimal max)
- "0 results" not "no results" when showing counts

## Tone guide
- Neutral and helpful for most UI
- Celebratory for achievements/milestones (but not excessive)
- Calm and direct for errors (never alarming)
- Never sarcastic, never cute at the expense of clarity
- Avoid exclamation marks (max 1 per page, for genuine celebration)

## Common microcopy mistakes
- Generic button labels ("Submit", "OK", "Click here")
- Error messages without recovery steps
- Empty states with just "No data"
- Placeholder text as the only label
- "Are you sure?" confirmations
- Tech jargon in user-facing text ("null", "404", "invalid parameter")
- Inconsistent terminology (saying "delete" in one place, "remove" in another for the same action)
- All-caps for emphasis (use bold or color instead)
