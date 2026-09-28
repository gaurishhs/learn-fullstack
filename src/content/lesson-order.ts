type OrderedLesson = {
  id: string;
  filePath?: string;
};

export function lessonNumberFromFile(entry: OrderedLesson, fallback: number) {
  const match = /(?:^|\/)(\d+)-/.exec(entry.filePath ?? entry.id);
  return match ? Number(match[1]) : fallback;
}

export function compareLessonOrder(a: OrderedLesson, b: OrderedLesson) {
  const aNumber = lessonNumberFromFile(a, Number.MAX_SAFE_INTEGER);
  const bNumber = lessonNumberFromFile(b, Number.MAX_SAFE_INTEGER);
  return aNumber - bNumber || a.id.localeCompare(b.id);
}
