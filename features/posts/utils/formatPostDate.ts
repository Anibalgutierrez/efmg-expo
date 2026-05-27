// /features/posts/utils/formatPostDate.ts

export function formatPostDate(createdAt: unknown): string {
  try {
    if (!createdAt) {
      return 'Ahora';
    }

    let date: Date | null = null;

    // Firebase Timestamp
    if (
      typeof createdAt === 'object' &&
      createdAt !== null &&
      'toDate' in createdAt &&
      typeof (createdAt as any).toDate === 'function'
    ) {
      date = (createdAt as any).toDate();
    }

    // JS Date
    else if (createdAt instanceof Date) {
      date = createdAt;
    }

    // String o timestamp number
    else if (
      typeof createdAt === 'string' ||
      typeof createdAt === 'number'
    ) {
      date = new Date(createdAt);
    }

    if (!date || isNaN(date.getTime())) {
      return 'Ahora';
    }

    const now = new Date();

    const diffMs = now.getTime() - date.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return 'Ahora';
    }

    if (minutes < 60) {
      return `${minutes}m`;
    }

    if (hours < 24) {
      return `${hours}h`;
    }

    if (days < 7) {
      return `${days}d`;
    }

    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (error) {
    console.error('formatPostDate error:', error);

    return 'Ahora';
  }
}