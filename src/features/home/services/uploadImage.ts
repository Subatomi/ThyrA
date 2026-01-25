export async function uploadImageToServer(localUri: string, endpoint = 'https://example.com/upload') {
  const form = new FormData();
  const filename = localUri.split('/').pop() || 'photo.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image';

  // @ts-ignore - React Native FormData file object
  form.append('file', { uri: localUri, name: filename, type });

  const res = await fetch(endpoint, {
    method: 'POST',
    body: form,
    headers: {
      // Let fetch set proper boundaries for multipart
      // 'Content-Type': 'multipart/form-data'
    },
  });

  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  return res.json();
}
