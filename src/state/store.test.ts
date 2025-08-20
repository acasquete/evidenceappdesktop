import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './store';

describe('store', () => {
  beforeEach(() => {
    useStore.setState({ email: '', repoMappings: {}, emailAliases: {} });
  });

  it('sets email', () => {
    useStore.getState().setEmail('user@example.com');
    expect(useStore.getState().email).toBe('user@example.com');
  });
});
