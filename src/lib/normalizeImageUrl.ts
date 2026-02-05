export function normalizeImageUrl(url?: string | null) {
  if (!url) return "/default-avatar.svg";

  if (url.startsWith("https//")) {
    return url.replace("https//", "https://");
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
}
