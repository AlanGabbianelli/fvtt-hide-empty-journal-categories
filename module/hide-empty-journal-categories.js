/**
 * Wrap JournalEntrySheet#_prepareTableOfContents so users who cannot edit the journal do not see empty categories.
 * @param {Function} original  The core method.
 * @returns {Function}         The wrapped method.
 */
export function wrapTableOfContents(original) {
  return async function () {
    const tableOfContents = await original.call(this);
    return this.isEditable ? tableOfContents : hideEmptyJournalCategories(tableOfContents);
  };
}

/* -------------------------------------------- */

/**
 * Remove category headers that no page follows. Core lists each category's visible pages right after its header,
 * so an empty category is one that is followed by another category or nothing at all.
 * @param {object[]} tableOfContents  The result of JournalEntrySheet#_prepareTableOfContents.
 * @returns {object[]}                The table of contents without empty categories.
 */
function hideEmptyJournalCategories(tableOfContents) {
  return tableOfContents.filter((entry, i) => !isEmptyCategory(entry, tableOfContents[i + 1]));
}

/* -------------------------------------------- */

/**
 * Test whether an entry is an empty category header (no page follows it).
 * @param {object} entry        An entry of the table of contents.
 * @param {object} [nextEntry]  The entry right after it, if there is one.
 * @returns {boolean}
 */
function isEmptyCategory(entry, nextEntry) {
  return !!(entry.isCategory && (!nextEntry || nextEntry.isCategory));
}
