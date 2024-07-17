import {
  ChoiceColumn,
  DateColumn,
  NumberColumn,
  TextColumn,
  YesNoColumn,
} from "./components/Column";
import { EnumChoiceType } from "./components/Enum";
import List from "./components/List";
import ListManagement from "./components/ListManagement";
import path from "path";

describe("Microsoft Lists Clone Application", () => {
  let app: ListManagement;
  let list: List;

  beforeEach(() => {
    app = new ListManagement();
    const filePath = path.resolve(__dirname, "data/templates.json");
    app.loadTemplates(filePath);
  });

  test("Add list from template", () => {
    let template = app.getTemplate("Task tracker");
    list = app.createFromTemplate("Task tracker", template!.id);

    const expectedColumns = ["Task Name", "Due Date", "Completed", "Priority"];

    list.columns.forEach((column, index) => {
      expect(column.name).toBe(expectedColumns[index]);
    });
  });

  test("Add new columns, insert data and delete columns", () => {
    let list = app.createList("My List");

    // Add columns data
    list.addColumn(new NumberColumn("Age"));
    list.addColumn(new YesNoColumn("Is Active"));
    list.addColumn(
      new ChoiceColumn("Gender", EnumChoiceType.Single, [
        "Male",
        "Female",
        "Other",
      ])
    );
    list.addColumn(
      new ChoiceColumn("Courses", EnumChoiceType.Multiple, [
        "Math",
        "Science",
        "English",
      ])
    );

    // Add rows data
    list.addRow(
      { Title: "John Doe" },
      { Age: 30 },
      { Gender: "Male" },
      { Courses: ["Math", "English"] }
    );
    list.addRow({ Title: "Jane Doe" }, { Gender: "Female" });
    list.addRow({ Title: "Peter" }, { Courses: ["Math", "Science"] });

    const expectedData = [
      {
        Title: "John Doe",
        Age: 30,
        "Is Active": false,
        Gender: "Male",
        Courses: ["Math", "English"],
      },
      {
        Title: "Jane Doe",
        Age: 0,
        "Is Active": false,
        Gender: "Female",
        Courses: undefined,
      },
      {
        Title: "Peter",
        Age: 0,
        "Is Active": false,
        Gender: undefined,
        Courses: ["Math", "Science"],
      },
    ];

    list.rows.forEach((row, index) => {
      expect(row.getValueCol("Title")).toBe(expectedData[index].Title);
      expect(row.getValueCol("Age")).toBe(expectedData[index].Age);
      expect(row.getValueCol("Is Active")).toBe(
        expectedData[index]["Is Active"]
      );
      expect(row.getValueCol("Gender")).toBe(expectedData[index]["Gender"]);
      expect(row.getValueCol("Courses")).toStrictEqual(
        expectedData[index]["Courses"]
      );
    });
  });

  test("Save lists file", () => {
    let list = app.createList("My List");
    list.addColumn(new NumberColumn("Age"));

    list.addRow({ Title: "John Doe", Age: 30 });
    list.addRow({ Title: "Jane Doe", Age: 25 });

    const filePath = path.resolve(__dirname, "data/mylist.json");
    app.saveLists(filePath);
  });

  test("Search and paging", () => {
    let list = app.createList("My List");
    list.addColumn(new NumberColumn("Age"));

    list.addRow({ Title: "John Doe", Age: 30 });
    list.addRow({ Title: "Jane Doe", Age: 25 });

    let result = list.searchRows("Doe");

    const expectedData = [
      {
        Title: "John Doe",
        Age: 30,
      },
      {
        Title: "Jane Doe",
        Age: 25,
      },
    ];

    result.forEach((row, index) => {
      expect(row.getValueCol("Title")).toBe(expectedData[index].Title);
      expect(row.getValueCol("Age")).toBe(expectedData[index].Age);
    });
  });

  test("Delete a list", () => {
    app.createList("My List");
    app.deleteList(app.lists[0].id);
    expect(app.lists.length).toBe(0);
  });
});
