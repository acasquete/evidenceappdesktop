import { useEffect, useState } from 'react';
import { open } from '@tauri-apps/plugin-shell';
import { invoke } from '@tauri-apps/api/core';
import { useStore } from '../state/store';

export default function Onboarding() {
  const { email, setEmail } = useStore();
  const [gitInstalled, setGitInstalled] = useState<boolean | null>(null);

  useEffect(() => {
    invoke<boolean>('check_git').then(setGitInstalled);
  }, []);

  const handleSave = () => {
    // In a real app, persist to disk
    setEmail(email);
  };

  const installGit = () => {
    open('https://git-scm.com/downloads');
  };

  return (
    <div>
      <h2>Welcome</h2>
      <input
        type="email"
        placeholder="corporate email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button onClick={handleSave}>Save</button>
      {gitInstalled === false && (
        <div>
          <p>Git is not installed.</p>
          <button onClick={installGit}>Install Git</button>
        </div>
      )}
    </div>
  );
}
