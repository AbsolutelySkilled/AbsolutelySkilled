<!-- Part of the second-brain AbsolutelySkilled skill. Load this file when performing
     memory maintenance - splitting oversized files, pruning stale entries,
     rebuilding the index, or reorganizing the ~/.memory/ structure. -->

# Memory Maintenance

## File splitting protocol

**Trigger**: A memory file exceeds 100 lines (including frontmatter).

**Process:**

1. **Identify sub-topics** - Read the file and find 2-4 natural groupings
   based on the ## headers or thematic clusters

2. **Propose the split** - Show the user the proposed structure:
   ```
   coding/react.md (120 lines) ->
     coding/react/index.md    (overview + links)
     coding/react/hooks.md    (hooks patterns, 35 lines)
     coding/react/patterns.md (component patterns, 40 lines)
     coding/react/testing.md  (React testing, 30 lines)
   ```

3. **Create subdirectory** - Name it after the original file without extension:
   `coding/react.md` becomes `coding/react/`

4. **Write sub-files** - Each sub-file gets:
   - Its own YAML frontmatter with appropriate tags
   - The content from its section of the original file
   - Wiki-links back to the parent index.md and sibling files

5. **Create index.md** - Replace the original file's content with an index
   that links to all sub-files:
   ```markdown
   ---
   tags: [react, frontend]
   created: "<original-created-date>"
   updated: "<today>"
   links:
     - "[[coding/react/hooks.md]]"
     - "[[coding/react/patterns.md]]"
     - "[[coding/react/testing.md]]"
   ---

   # React Memory

   ## Topics
   - [[coding/react/hooks.md]] - Hook patterns and preferences
   - [[coding/react/patterns.md]] - Component architecture
   - [[coding/react/testing.md]] - Testing React components
   ```

6. **Update wiki-links** - Search all other memory files for `[[coding/react.md]]`
   and update to `[[coding/react/index.md]]`

7. **Update index.yaml** - Remove the old file entry, add entries for each
   new sub-file with their tags, line counts, and timestamps

---

## Pruning stale memories

**When to prune:**
- Memory hasn't been accessed or updated in 6+ months
- Information is clearly outdated (deprecated tool, abandoned project)
- User explicitly says a memory is no longer relevant

**Process:**

1. **Identify candidates** - Scan `index.yaml` for files where `updated`
   is older than 6 months from today

2. **Present to user** - List stale files with their last-updated date and
   a brief content summary:
   ```
   Stale memories (not updated in 6+ months):
   - coding/webpack.md (updated 2025-08-12) - Webpack 4 config patterns
   - marketing/facebook-ads.md (updated 2025-06-03) - FB ad targeting rules
   ```

3. **User decides** - For each file, user can:
   - Keep (update timestamp to mark as still-relevant)
   - Prune (delete the file)
   - Update (revise the content then keep)

4. **Clean up** - For pruned files:
   - Delete the file
   - Remove from index.yaml (tags, files, category topics)
   - Search for and remove any wiki-links pointing to the deleted file
   - If a category becomes empty, remove the category directory

---

## Relevance matching algorithm

Used at conversation start to determine which memories to load.

### Step 1: Extract context keywords

Build a keyword set from the current context:
- **Working directory name** - e.g., "my-react-app" yields `react`, `app`
- **File types being edited** - `.tsx` yields `react`, `typescript`; `.py` yields `python`
- **Tool names in context** - imports, configs, package.json dependencies
- **User's explicit topic** - if they state what they're working on
- **Project-level files** - CLAUDE.md, package.json, pyproject.toml metadata

### Step 2: Match against index.yaml tags

For each keyword, look up matching tags in `index.yaml.tags`:
- **Exact match**: keyword equals a tag exactly -> 3 points per file
- **Substring match**: keyword is contained in a tag or vice versa -> 1 point

### Step 3: Score and rank files

Sum points per file across all keyword matches. Example:
```
Context keywords: [react, typescript, hooks, testing]

coding/react.md:     react(3) + hooks(3) + testing(3) = 9 points
coding/typescript.md: typescript(3) = 3 points
coding/testing.md:   testing(3) = 3 points
marketing/seo.md:    (no match) = 0 points
```

### Step 4: Load top files

- Load the top 3-5 scoring files (configurable, default 5)
- Always load `profile.md` as baseline context
- If no files score above 0, load only `profile.md`
- Never load more than 5 files to avoid context bloat

### Step 5: Explicit query fallback

When the user explicitly asks "what do you know about X":
1. First try the tag-based matching above
2. If no tag matches: do a full-text search across all memory file bodies
3. Present results with file paths for verification

---

## Index rebuild

If `index.yaml` gets corrupted, out of sync, or deleted:

1. Walk the entire `~/.memory/` directory tree
2. For each `.md` file found, read its YAML frontmatter
3. Extract tags, created/updated dates, and wiki-links
4. Count lines per file
5. Rebuild the categories list from directory names
6. Rebuild the tags map from all files' tag lists
7. Rebuild the files map with metadata
8. Write the new `index.yaml`

This is a safe operation - it only reads existing files and writes the index.

---

## Handling domain sprawl

**Too many categories (10+):**
- Review categories for overlap (e.g., "frontend" and "ui-design" might merge)
- Propose consolidation to the user
- Move files from deprecated category to the merged one
- Update all wiki-links and index.yaml

**Too many topic files in a category (15+):**
- Propose hierarchical restructuring
- Group related topics into subdirectories
- e.g., `coding/` with 20 files becomes `coding/frontend/`, `coding/backend/`,
  `coding/devops/` with topic files distributed appropriately

---

## Cross-reference maintenance

### On file creation
- After creating a new memory file, scan existing files for matching tags
- If strong overlap found (3+ shared tags), suggest adding wiki-links
  between the new file and existing files

### On file deletion or move
- Search all memory files for wiki-links pointing to the old path
- Update or remove stale links
- Update index.yaml to reflect the change

### On file update
- If tags were added or removed, update index.yaml tag mappings
- If content now contradicts a linked file, flag for user review

### Periodic review
- When performing any maintenance, check for broken wiki-links
  (links pointing to files that no longer exist)
- Report broken links to user and suggest fixes
