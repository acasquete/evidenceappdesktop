import { useEffect, useState } from 'react';
import { getPendingProjects } from '../api/client';
import { useStore } from '../state/store';

interface PendingProject {
  project: string;
  months: string[];
}

export default function Repos() {
  const { email, repoMappings, setRepoMapping } = useStore();
  const [projects, setProjects] = useState<PendingProject[]>([]);

  useEffect(() => {
    if (email) {
      getPendingProjects(email).then(data => setProjects(data.projects || []));
    }
  }, [email]);

  const selectPath = (project: string) => {
    const path = window.prompt(`Path for ${project}`) || '';
    setRepoMapping(project, path);
  };

  return (
    <div>
      <h2>Pending Projects</h2>
      <ul>
        {projects.map(p => (
          <li key={p.project}>
            {p.project} ({p.months.join(', ')})
            <button onClick={() => selectPath(p.project)}>Select Repo</button>
            {repoMappings[p.project] && <span> {repoMappings[p.project]}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
