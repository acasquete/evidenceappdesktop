import { create } from 'zustand';

interface AppState {
  email: string;
  setEmail: (email: string) => void;
  repoMappings: Record<string, string>;
  setRepoMapping: (project: string, path: string) => void;
  emailAliases: Record<string, string>;
  setEmailAlias: (gitEmail: string, corpEmail: string) => void;
}

export const useStore = create<AppState>(set => ({
  email: '',
  setEmail: email => set({ email }),
  repoMappings: {},
  setRepoMapping: (project, path) =>
    set(state => ({ repoMappings: { ...state.repoMappings, [project]: path } })),
  emailAliases: {},
  setEmailAlias: (gitEmail, corpEmail) =>
    set(state => ({ emailAliases: { ...state.emailAliases, [gitEmail]: corpEmail } })),
}));
