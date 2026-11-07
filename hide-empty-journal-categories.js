import { wrapTableOfContents } from "./module/hide-empty-journal-categories.js";

Hooks.once("init", () => {
  const { prototype } = foundry.applications.sheets.journal.JournalEntrySheet;
  prototype._prepareTableOfContents = wrapTableOfContents(prototype._prepareTableOfContents);
});
