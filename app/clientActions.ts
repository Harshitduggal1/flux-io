'use client'

export async function clientTranscribeUploadedFile(resp: any) {
  const response = await fetch('/api/transcribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(resp),
  });
  return await response.json();
}

export async function clientGenerateBlogPostAction(params: { transcriptions: { text: string }; userId: string }) {
  const response = await fetch('/api/generate-blog-post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  return await response.json();
}
