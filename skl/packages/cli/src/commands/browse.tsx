import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Text, Box, useInput, useApp } from 'ink';
import { z } from 'zod';
import { defaultClient } from '@skl/shared';
import type { RegistryEntry, CategoryInfo, SkillCategory } from '@skl/shared';
import { SkillCard } from '../ui/SkillCard.js';

export const options = z.object({
  category: z.string().optional().describe('Start in a specific category'),
});

type Props = { options: z.infer<typeof options> };
type Pane = 'categories' | 'skills';
const ALL_CAT: CategoryInfo = { name: 'All', count: 0, topSkills: [] };
const MAX_ROWS = 15;

export default function Browse({ options: opts }: Props) {
  const { exit } = useApp();
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [skills, setSkills] = useState<RegistryEntry[]>([]);
  const [selCat, setSelCat] = useState(0);
  const [selSkill, setSelSkill] = useState(0);
  const [pane, setPane] = useState<Pane>('categories');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [filtering, setFiltering] = useState(false);
  const [installing, setInstalling] = useState('');

  const loadSkills = useCallback(async (catName: string) => {
    setLoading(true); setSelSkill(0);
    try {
      const data = catName === 'All'
        ? await defaultClient.getTop({ limit: 50 })
        : (await defaultClient.search({ category: catName as SkillCategory, limit: 50 })).results;
      setSkills(data);
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const cats = await defaultClient.getCategories();
        const allCat: CategoryInfo = { name: 'All', count: cats.reduce((s, c) => s + c.count, 0), topSkills: [] };
        setCategories([allCat, ...cats]);
        if (opts.category) {
          const idx = cats.findIndex((c) => c.name.toLowerCase() === opts.category!.toLowerCase());
          if (idx >= 0) setSelCat(idx + 1);
        }
        setSkills(await defaultClient.getTop({ limit: 50 }));
      } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
      finally { setLoading(false); }
    })();
  }, []);

  const visible = filter
    ? skills.filter((s) => { const q = filter.toLowerCase(); return s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q); })
    : skills;

  // Refs to avoid stale closures in useInput handler
  const catsRef = useRef(categories); catsRef.current = categories;
  const selCatRef = useRef(selCat); selCatRef.current = selCat;
  const visibleRef = useRef(visible); visibleRef.current = visible;
  const selSkillRef = useRef(selSkill); selSkillRef.current = selSkill;
  const paneRef = useRef(pane); paneRef.current = pane;
  const filteringRef = useRef(filtering); filteringRef.current = filtering;

  useInput((input, key) => {
    if (filteringRef.current) {
      if (key.escape || key.return) { setFiltering(false); return; }
      if (key.backspace || key.delete) { setFilter((f) => f.slice(0, -1)); return; }
      if (input && !key.ctrl && !key.meta) setFilter((f) => f + input);
      return;
    }
    if (input === 'q') { exit(); return; }
    if (input === '/') { setFiltering(true); setFilter(''); return; }
    if (key.tab) { setPane((p) => p === 'categories' ? 'skills' : 'categories'); return; }
    const up = key.upArrow || input === 'k', down = key.downArrow || input === 'j';
    if (paneRef.current === 'categories') {
      if (up) setSelCat((i) => Math.max(0, i - 1));
      if (down) setSelCat((i) => Math.min(catsRef.current.length - 1, i + 1));
      if (key.return || key.rightArrow) { const c = catsRef.current[selCatRef.current]; if (c) { loadSkills(c.name); setPane('skills'); } }
    } else {
      if (up) setSelSkill((i) => Math.max(0, i - 1));
      if (down) setSelSkill((i) => Math.min(visibleRef.current.length - 1, i + 1));
      if (key.leftArrow) setPane('categories');
      if (key.return && visibleRef.current[selSkillRef.current]) { setInstalling(visibleRef.current[selSkillRef.current].name); setTimeout(() => setInstalling(''), 2000); }
    }
  });

  if (error) return <Text color="red">Error: {error}</Text>;
  const detail = visible[selSkill];

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color="cyan">SKL Browse</Text>
        <Text dimColor>{'  [q] quit  [/] search  [tab] pane  [enter] select'}</Text>
      </Box>
      {filtering && <Box marginBottom={1}><Text color="yellow">Search: </Text><Text>{filter}<Text color="gray">|</Text></Text></Box>}
      {loading ? <Text color="yellow">Loading...</Text> : (
        <Box>
          <Box flexDirection="column" width={22} marginRight={1}>
            <Text bold underline>Categories</Text>
            {categories.slice(0, MAX_ROWS).map((cat, i) => {
              const sel = pane === 'categories' && i === selCat;
              return <Text key={cat.name} color={sel ? 'cyan' : undefined} bold={sel}>{sel ? '> ' : '  '}{cat.name} ({cat.count})</Text>;
            })}
          </Box>
          <Box flexDirection="column" width={52} marginRight={1}>
            <Text bold underline>Skills</Text>
            {visible.length === 0 ? <Text dimColor>No skills found</Text>
              : visible.slice(0, MAX_ROWS).map((s, i) => <SkillCard key={s.name} skill={s} selected={pane === 'skills' && i === selSkill} />)}
          </Box>
          <Box flexDirection="column" width={30}>
            <Text bold underline>Detail</Text>
            {detail ? (
              <Box flexDirection="column">
                <Text bold color="cyan">{detail.name}</Text>
                <Text dimColor>v{detail.version}</Text>
                <Text> </Text>
                <Text>Score: {(detail.audit?.score ?? 0).toFixed(1)}/10</Text>
                <Text>Installs: {detail.telemetry?.totalInstalls ?? 0}</Text>
                <Text>Category: {detail.category}</Text>
                <Text> </Text>
                <Text wrap="wrap" dimColor>{detail.description}</Text>
                {installing === detail.name && <Text color="green" bold>{'\n'}Installing...</Text>}
              </Box>
            ) : <Text dimColor>Select a skill</Text>}
          </Box>
        </Box>
      )}
      {!loading && <Text dimColor>{'\n'}{visible.length} skills shown</Text>}
    </Box>
  );
}
