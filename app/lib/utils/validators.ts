// src/lib/utils/validators.ts
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateCollectionName(name: string): string | null {
  if (!name.trim()) return "Collection name is required";
  if (name.length > 50) return "Collection name must be 50 characters or less";
  return null;
}

export function validateSearchQuery(query: string): string | null {
  if (!query.trim()) return "Search query cannot be empty";
  if (query.length > 200) return "Search query is too long";
  return null;
}
