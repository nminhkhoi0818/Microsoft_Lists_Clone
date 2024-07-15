import {
  ChoiceColumn,
  DateColumn,
  NumberColumn,
  TextColumn,
  YesNoColumn,
} from "./components/Column";
import List from "./components/List";
import ListManagement from "./components/ListManagement";

describe("Microsoft Lists Clone Application", () => {
  let app: ListManagement;
  let list: List;

  beforeEach(() => {
    app = new ListManagement();
    app.createDefaultTemplates();
  });
  test("Create a blank list", () => {
    app.createList("Blank List");

    expect(app.lists[0].name).toBe("Blank List");
    expect(app.lists[0].columns[0].name).toBe("Title"); // Default column
  });

  test("Create a list from template", () => {
    app.createFromTemplate("Template List", app.templates[0].id);

    expect(app.lists[0].name).toBe("Template List");
    expect(app.lists[0].columns[0].name).toBe("Full Name");
    expect(app.lists[0].columns[1].name).toBe("Age");
    expect(app.lists[0].columns[2].name).toBe("Is Active");

    // Insert data to template
    app.lists[0].addItem("John Doe", 30, true);
    app.lists[0].addItem("Jane Doe", 25, false);

    expect(app.lists[0].items[0].columns[0].getValue()).toBe("John Doe");
    expect(app.lists[0].items[0].columns[1].getValue()).toBe(30);
    expect(app.lists[0].items[0].columns[2].getValue()).toBe(true);
    expect(app.lists[0].items[1].columns[0].getValue()).toBe("Jane Doe");
    expect(app.lists[0].items[1].columns[1].getValue()).toBe(25);
    expect(app.lists[0].items[1].columns[2].getValue()).toBe(false);
  });

  test("Delete a list", () => {
    app.createList("My List");
    app.deleteList(app.lists[0].id);
    expect(app.lists.length).toBe(0);
  });

  test("Add new columns and insert data", () => {
    let list = app.createList("My List");

    list.addColumn(new NumberColumn("Age"));
    list.addColumn(new YesNoColumn("Is Active"));
    list.addColumn(new DateColumn("Date of Birth"));
    list.addColumn(
      new ChoiceColumn("Choice Column", ["Choice 1", "Choice 2", "Choice 3"])
    );

    list.addItem("John Doe", 30, true, new Date("11-07-2003"), "Option 1");

    expect(list.items.length).toBe(1);
    expect(list.items[0].getValueCol("Title")).toBe("John Doe");
    expect(list.items[0].getValueCol("Age")).toBe(30);
    expect(list.items[0].getValueCol("Is Active")).toBe(true);
    expect(list.items[0].getValueCol("Date of Birth")).toStrictEqual(
      new Date("11-07-2003")
    );
    expect(list.items[0].getValueCol("Choice Column")).toBe("Option 1");

    // Edit data in row
    list.items[0].setValueCol("Age", 40);
    list.items[0].setValueCol("Is Active", false);
    expect(list.items[0].getValueCol("Age")).toBe(40);
    expect(list.items[0].getValueCol("Is Active")).toBe(false);
  });

  test("Delete an item from a list", () => {
    list = app.createList("My List");
    list.addItem("John Doe");
    list.deleteItem(list.items[0].id);
    expect(list.items.length).toBe(0);
  });

  test("Create a list view", () => {
    list.createView("My View");

    expect(list.views[0].name).toBe("My View");
    expect(list.views[0].viewColumns[0].name).toBe("Title");
  });

  test("Create a calendar view", () => {});

  test("Create a gallery view", () => {});

  test("Create a board view", () => {});

  test("Delete a view", () => {});

  test("Create form", () => {});

  test("Delete form", () => {});

  test("Share sheet", () => {});

  test("Export to Excel", () => {});

  test("Export to CSV", () => {});
});
