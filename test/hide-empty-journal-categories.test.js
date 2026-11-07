import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { wrapTableOfContents } from "../module/hide-empty-journal-categories.js";

const category = id => ({ id, isCategory: true });
const page = (id, categoryId) => ({ id, category: categoryId });
const ids = tableOfContents => tableOfContents.map(entry => entry.id);

describe("wrapTableOfContents", () => {
  const prepareTableOfContents = async function () {
    return this.tableOfContents;
  };

  describe("for a user who cannot edit the sheet", () => {
    it("hides a category followed directly by another category, because none of its pages is visible", async () => {
      const tableOfContents = [category("port"), page("linnahall", "port"), category("center"), category("telliskivi"),
        page("nordtech", "telliskivi")];
      const sheet = { isEditable: false, tableOfContents };

      const result = await wrapTableOfContents(prepareTableOfContents).call(sheet);

      assert.deepEqual(ids(result), ["port", "linnahall", "telliskivi", "nordtech"]);
    });

    it("hides the last category when nothing follows it, because none of its pages is visible", async () => {
      const tableOfContents = [category("port"), page("linnahall", "port"), category("center")];
      const sheet = { isEditable: false, tableOfContents };

      const result = await wrapTableOfContents(prepareTableOfContents).call(sheet);

      assert.deepEqual(ids(result), ["port", "linnahall"]);
    });
  });

  describe("for a user who can edit the sheet", () => {
    it("keeps empty categories, so the GM sees the ones left to fill", async () => {
      const tableOfContents = [category("port"), page("linnahall", "port"), category("center")];
      const sheet = { isEditable: true, tableOfContents };

      const result = await wrapTableOfContents(prepareTableOfContents).call(sheet);

      assert.deepEqual(ids(result), ["port", "linnahall", "center"]);
    });
  });
});
