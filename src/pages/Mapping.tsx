import { useStore } from '../state/store';

export default function Mapping() {
  const { emailAliases } = useStore();
  return (
    <div>
      <h2>Mappings</h2>
      <pre>{JSON.stringify(emailAliases, null, 2)}</pre>
    </div>
  );
}
