/** @typedef {import('satteri').HastPluginDefinition} HastPluginDefinition */

const calloutLabels = {
  NOTE: 'Note',
  TIP: 'Tip',
  IMPORTANT: 'Important',
  WARNING: 'Warning',
  CAUTION: 'Caution',
};

/**
 * @param {string} tagName
 * @param {string[]} classNames
 * @param {import('hast').ElementContent[]} children
 * @returns {import('hast').Element}
 */
const element = (tagName, classNames, children = []) => ({
  type: 'element',
  tagName,
  properties: { className: classNames },
  children,
});

/** @param {string} value @returns {import('hast').Text} */
const text = (value) => ({ type: 'text', value });

/** @type {HastPluginDefinition} */
const markdownCallouts = {
  name: 'markdown-callouts',
  element: {
    filter: ['blockquote'],
    visit(node) {
      const firstParagraph = node.children?.find(
        (child) => child.type === 'element' && child.tagName === 'p',
      );
      const firstText = firstParagraph?.children?.find((child) => child.type === 'text');
      if (!firstText) return;

      const marker = /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i.exec(firstText.value);
      if (!marker) return;

      const kind = marker[1].toUpperCase();
      const remainder = firstText.value.slice(marker[0].length);
      const paragraphChildren = [...firstParagraph.children];
      const markerIndex = paragraphChildren.indexOf(firstText);
      if (remainder.trim()) {
        paragraphChildren[markerIndex] = { ...firstText, value: remainder };
      } else {
        paragraphChildren.splice(markerIndex, 1);
        if (paragraphChildren[markerIndex]?.type === 'break') paragraphChildren.splice(markerIndex, 1);
      }
      const cleanedParagraph = { ...firstParagraph, children: paragraphChildren };
      const contents = node.children
        .map((child) => child === firstParagraph ? cleanedParagraph : child)
        .filter((child) => child !== cleanedParagraph || paragraphChildren.length > 0);
      const properties = node.properties ?? {};
      const existingClasses = Array.isArray(properties.className)
        ? properties.className
        : properties.className ? [properties.className] : [];
      return {
        type: 'element',
        tagName: 'aside',
        properties: {
          ...properties,
          role: 'note',
          className: [
            ...existingClasses,
        'callout', 'my-4', 'flex', 'gap-3', 'rounded-md', 'border', 'border-line', 'p-3',
          ],
        },
        children: [
          element('span', ['callout-icon', 'inline-flex', 'size-5', 'shrink-0', 'items-center', 'justify-center', 'leading-none'], [text('i')]),
          element('div', [], [
            element('strong', [], [text(calloutLabels[kind])]),
            ...contents,
          ]),
        ],
      };
    },
  },
};

export default markdownCallouts;
