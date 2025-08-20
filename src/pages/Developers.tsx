import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useStore } from '../state/store';

export default function Developers() {
  const { repoMappings, emailAliases, setEmailAlias } = useStore();
  const [emails, setEmails] = useState<string[]>([]);

  useEffect(() => {
    const all = new Set<string>();
    const load = async () => {
      for (const path of Object.values(repoMappings)) {
        if (path) {
          const res = await invoke<string[]>('git_authors', { repoPath: path });
          res.forEach(e => all.add(e));
        }
      }
      setEmails(Array.from(all));
    };
    load();
  }, [repoMappings]);

  const mapAlias = (gitEmail: string) => {
    const corp = window.prompt(`Corporate email for ${gitEmail}`, emailAliases[gitEmail] || '');
    if (corp) setEmailAlias(gitEmail, corp);
  };

  return (
    <div>
      <h2>Developers</h2>
      <ul>
        {emails.map(e => (
          <li key={e}>
            {e} → {emailAliases[e] || 'unknown'}
            <button onClick={() => mapAlias(e)}>Map</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
