import { TextColumn } from "./components/Column";
import List from "./components/List";
import MicrosoftList from "./components/MicrosoftList";

describe("Microsoft Lists Clone Application", () => {
  let app: MicrosoftList;

  beforeEach(() => {
    app = new MicrosoftList();
  });
  test("Create a blank list", () => {
    app.createList("My List");
    expect(app.lists.length).toBe(1);
  });

  test("Create a list from template", () => {
    app.createFromTemplate("My List", app.templates[0].id);
    expect(app.lists.length).toBe(1);
  });

  test("Delete a list", () => {
    app.createList("My List");
    app.deleteList(app.lists[0].id);
    expect(app.lists.length).toBe(0);
  });

  describe("List Class", () => {
    let list: List;

    beforeEach(() => {
      list = app.createList("My List");
    });

    test("Add a new column to a list", () => {
      list.addColumn(new TextColumn("Full Name"));
      expect(list.columns.length).toBe(1);
    });

    test("Add a new item to a list", () => {
      list.addItem();
      expect(list.items.length).toBe(1);
    });

    test("Delete an item from a list", () => {
      list.addItem();
      list.deleteItem(list.items[0].id);
      expect(list.items.length).toBe(0);
    });

    test("Create a view", () => {
      list.createView("My View");
      expect(list.views.length).toBe(1);
    });

    test("Delete a view", () => {
      list.createView("My View");
      list.deleteView(list.views[0].id);
      expect(list.views.length).toBe(0);
    });

    test("Create form", () => {
      list.createForm("My Form");
      expect(list.forms.length).toBe(1);
    });

    test("Delete form", () => {
      list.createForm("My Form");
      list.deleteForm(list.forms[0].id);
      expect(list.forms.length).toBe(0);
    });

    test("Share sheet", () => {});

    test("Export to Excel", () => {});

    test("Export to CSV", () => {});

    test("Create a rule", () => {});
  });
});
