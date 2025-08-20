import { invoke } from '@tauri-apps/api/core';
import { requestSasUrl, registerIngestion } from '../api/client';
import { useStore } from '../state/store';

export default function Upload() {
  const { email, emailAliases } = useStore();

  const handleUpload = async () => {
    // Placeholder flow for evidence generation
    const zipPath = await invoke<string>('zip_evidence', {
      files: [],
      outputZip: 'evidence.zip',
    });
    const sas = await requestSasUrl();
    await invoke('upload_with_sas', { file: zipPath, sasUrl: sas.url });
    await registerIngestion({ email, aliases: emailAliases });
    alert('Upload complete');
  };

  return (
    <div>
      <h2>Upload</h2>
      <button onClick={handleUpload}>Start Upload</button>
    </div>
  );
}
