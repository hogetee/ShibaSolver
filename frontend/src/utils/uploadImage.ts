// src/utils/uploadImage.ts
export async function uploadImageToCloudinary(file: File): Promise<string> {
    const CLOUD_NAME = "dkhggwcub";
    const UPLOAD_PRESET = "unsigned_preset";

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary env missing: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET');
  }

  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: form,
  });

  const data = await res.json();
  if (!res.ok) {
    const msg = data?.error?.message || 'Upload failed';
    throw new Error(msg);
  }

  return data.secure_url as string;
}