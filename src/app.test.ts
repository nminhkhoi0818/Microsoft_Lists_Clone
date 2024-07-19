import {
  TextColumn,
  ChoiceColumn,
  NumberColumn,
  YesNoColumn,
} from "./class/Column";
import { FILE_PATHS } from "./class/config";
import { EnumChoiceType } from "./class/Enum";
import List from "./class/List";
import ListManagement from "./class/ListManagement";
import path from "path";
import { BoardView, CalendarView, GalleryView, ListView } from "./class/View";

describe("Microsoft Lists Clone Application", () => {
  let app: ListManagement;
  let list: List;

  beforeEach(() => {
    app = new ListManagement();
    const filePath = path.resolve(__dirname, FILE_PATHS.TEMPLATES);
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
    list.addColumn(
      new ChoiceColumn("Gender", EnumChoiceType.Single, [
        "Male",
        "Female",
        "Other",
      ])
    );

    list.addRow({ Title: "John Doe", Age: 30, Gender: "Male" });
    list.addRow({ Title: "Jane Doe", Age: 25, Gender: "Female" });

    const filePath = path.resolve(__dirname, FILE_PATHS.LISTS);
    app.saveLists(filePath);
  });

  test("Load lists file", () => {
    const filePath = path.resolve(__dirname, FILE_PATHS.LISTS);
    app.loadLists(filePath);

    const expectedData = [
      {
        Title: "John Doe",
        Age: 30,
        Gender: "Male",
      },
      {
        Title: "Jane Doe",
        Age: 25,
        Gender: "Female",
      },
    ];

    const list = app.getList("My List")!;

    list.columns.forEach((column, index) => {
      expect(column.name).toBe(Object.keys(expectedData[0])[index]);
    });

    list.rows.forEach((row, index) => {
      expect(row.getValueCol("Title")).toBe(expectedData[index].Title);
      expect(row.getValueCol("Age")).toBe(expectedData[index].Age);
    });
  });

  test("Search key word", () => {
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

  test("Paging rows data", () => {
    list = app.createList("My List");
    list.addColumn(new NumberColumn("Age"));
    list.addColumn(new YesNoColumn("Is Active"));

    // Add 10 rows of data
    list.addRow({ Title: "John Doe", Age: 30, "Is Active": true });
    list.addRow({ Title: "Jane Doe", Age: 25, "Is Active": false });
    list.addRow({ Title: "Peter", Age: 35, "Is Active": true });
    list.addRow({ Title: "Mary", Age: 40, "Is Active": false });
    list.addRow({ Title: "Tom", Age: 45, "Is Active": true });
    list.addRow({ Title: "Jerry", Age: 50, "Is Active": false });
    list.addRow({ Title: "Alice", Age: 55, "Is Active": true });
    list.addRow({ Title: "Bob", Age: 60, "Is Active": false });
    list.addRow({ Title: "Eve", Age: 65, "Is Active": true });
    list.addRow({ Title: "Adam", Age: 70, "Is Active": false });

    const pageSize = 5;
    let page1 = list.getPage(1, pageSize);
    page1.forEach((row, index) => {
      expect(row.getValueCol("Title")).toBe(
        list.rows[index].getValueCol("Title")
      );
      expect(row.getValueCol("Age")).toBe(list.rows[index].getValueCol("Age"));
    });
  });

  test("Column settings", () => {
    list = app.createList("My List");
    list.addColumn(new NumberColumn("Age"));
    list.addColumn(new YesNoColumn("Is Active"));
    list.addColumn(new TextColumn("Description"));

    list.moveLeftColumn("Is Active");
    list.hideColumn("Age");

    const expectedColumns = ["Title", "Is Active", "Age", "Description"];

    list.columns.forEach((column, index) => {
      expect(column.name).toBe(expectedColumns[index]);
    });
    expect(list.getColumn("Age")!.isHidden).toBe(true);
  });

  test("Add view", () => {
    list = app.createList("My List");
    list.addColumn(new NumberColumn("Age"));
    list.addColumn(new YesNoColumn("Is Active"));
    list.addColumn(
      new ChoiceColumn("Gender", EnumChoiceType.Single, [
        "Male",
        "Female",
        "Other",
      ])
    );

    list.addRow({ Title: "John Doe", Age: 30, "Is Active": true });
    list.addRow({ Title: "Jane Doe", Age: 25, "Is Active": false });
    list.addRow({ Title: "Peter", Age: 35, "Is Active": true });

    list.addView(new ListView("My List View"));
    list.addView(new CalendarView("My Calendar View"));
    list.addView(new GalleryView("My Gallery View"));
    list.addView(new BoardView("My Board View", "Gender"));

    list.views.forEach((view) => {
      expect(view.columns).toStrictEqual(list.columns);
    });
  });

  test("Create a form", () => {
    const template = app.getTemplate("Project tracker");
    list = app.createFromTemplate("My Project Tracker", template!.id);

    let form = list.createForm("My Form");
    form.addColumn(new NumberColumn("Estimated Hours"));
    form.hideColumn("Budget");

    const expectedColumns = [
      "Project Name",
      "Start Date",
      "End Date",
      "Status",
      "Estimated Hours",
    ];
    form.columns.forEach((column, index) => {
      expect(column.name).toBe(expectedColumns[index]);
    });
  });

  test("Delete a list", () => {
    app.createList("My List");
    app.deleteList(app.lists[0].id);
    expect(app.lists.length).toBe(0);
  });
});
