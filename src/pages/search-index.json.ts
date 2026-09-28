import { getCollection, render } from 'astro:content';

export const prerender = true;

export async function GET() {
  const lessons = await getCollection('lessons');
  const documents = await Promise.all(lessons.map(async (lesson) => {
    const { body, data } = lesson;
    const { headings } = await render(lesson);
    return {
    id: `${data.course}/${data.slug}`,
    title: data.title,
    course: data.course === 'javascript' ? 'JavaScript' : data.course.toUpperCase(),
    url: `/${data.course}/${data.slug}`,
    description: data.description,
    sections: headings
      .filter((heading) => heading.depth === 2 || heading.depth === 3)
      .map((heading) => heading.text),
    body: body ?? '',
    };
  }));

  return new Response(JSON.stringify(documents), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
