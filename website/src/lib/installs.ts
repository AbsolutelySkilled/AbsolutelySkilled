import installsData from '../../../data/installs.json';

const data = installsData as Record<string, number | string>;

export function getInstallCount(slug: string): number {
  return (data[slug] as number) || 0;
}

export function getTotalInstalls(): number {
  return (data._total as number) || 0;
}

export function getFetchedAt(): string {
  return (data._fetchedAt as string) || '';
}

export function getTopSkillsByCounts(slugs: string[], limit = 5): { slug: string; count: number }[] {
  return slugs
    .map((slug) => ({ slug, count: getInstallCount(slug) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/** URL for runtime fetch of fresh install counts from GitHub */
export const INSTALLS_RAW_URL =
  'https://raw.githubusercontent.com/AbsolutelySkilled/AbsolutelySkilled/main/data/installs.json';
