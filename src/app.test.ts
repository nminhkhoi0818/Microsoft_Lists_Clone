import {
  ChoiceColumn,
  DateColumn,
  NumberColumn,
  TextColumn,
  YesNoColumn,
} from "./components/Column";
import List from "./components/List";
import ListManagement from "./components/ListManagement";
import path from "path";
import {
  BoardView,
  CalendarView,
  GalleryView,
  ListView,
} from "./components/View";

describe("Microsoft Lists Clone Application", () => {
  let app: ListManagement;
  let list: List;

  beforeEach(() => {
    app = new ListManagement();
    const filePath = path.resolve(__dirname, "data/templates.json");
    app.loadTemplates(filePath);
  });

  test("Add template and update data in row", () => {
    list = app.createFromTemplate("Task tracker", app.templates[1].id);

    const expectedColumns = ["Task Name", "Due Date", "Completed", "Priority"];

    list.columns.forEach((column, index) => {
      expect(column.name).toBe(expectedColumns[index]);
    });

    list.addRow();
    list.addRow();

    const row1 = list.getRow(0);
    row1.setValueCol("Task Name", "Task 1");
    row1.setValueCol("Due Date", new Date("11-07-2003"));
    row1.setValueCol("Completed", true);
    row1.setValueCol("Priority", "High");

    const row2 = list.getRow(1);
    row2.setValueCol("Task Name", "Task 2");
    row2.setValueCol("Due Date", new Date("12-08-2004"));
    row2.setValueCol("Completed", false);
    row2.setValueCol("Priority", "Low");

    const expectedData = [
      {
        "Task Name": "Task 1",
        "Due Date": new Date("11-07-2003"),
        Completed: true,
        Priority: "High",
      },
      {
        "Task Name": "Task 2",
        "Due Date": new Date("12-08-2004"),
        Completed: false,
        Priority: "Low",
      },
    ];

    list.rows.forEach((row, index) => {
      expect(row.getValueCol("Task Name")).toBe(
        expectedData[index]["Task Name"]
      );
      expect(row.getValueCol("Due Date")).toStrictEqual(
        expectedData[index]["Due Date"]
      );
      expect(row.getValueCol("Completed")).toBe(expectedData[index].Completed);
      expect(row.getValueCol("Priority")).toBe(expectedData[index].Priority);
    });
  });

  test("Add new columns, insert data and delete columns", () => {
    let list = app.createList("My List");

    list.addColumn(new NumberColumn("Age"));
    list.addColumn(new YesNoColumn("Is Active"));
    list.addColumn(new DateColumn("Date of Birth"));
    list.addColumn(
      new ChoiceColumn("Choice Column", ["Choice 1", "Choice 2", "Choice 3"])
    );

    list.addRow("John Doe", 30, true, new Date("11-07-2003"), "Option 1");
    list.addRow("Jane Doe", 25, false, new Date("12-08-2004"), "Option 2");

    list.addColumn(new NumberColumn("Salary"));

    const expectedData = [
      {
        Title: "John Doe",
        Age: 30,
        "Is Active": true,
        "Date of Birth": new Date("11-07-2003"),
        "Choice Column": "Option 1",
        Salary: 0,
      },
      {
        Title: "Jane Doe",
        Age: 25,
        "Is Active": false,
        "Date of Birth": new Date("12-08-2004"),
        "Choice Column": "Option 2",
        Salary: 0,
      },
    ];

    list.rows.forEach((row, index) => {
      expect(row.getValueCol("Title")).toBe(expectedData[index].Title);
      expect(row.getValueCol("Age")).toBe(expectedData[index].Age);
      expect(row.getValueCol("Is Active")).toBe(
        expectedData[index]["Is Active"]
      );
      expect(row.getValueCol("Date of Birth")).toStrictEqual(
        expectedData[index]["Date of Birth"]
      );
      expect(row.getValueCol("Choice Column")).toStrictEqual(
        expectedData[index]["Choice Column"]
      );
      expect(row.getValueCol("Salary")).toBe(expectedData[index].Salary);
    });

    // Delete columns
    list.deleteColumn("Age");
    list.deleteColumn("Date of Birth");

    list.rows.forEach((row) => {
      expect(row.getValueCol("Age")).toBeUndefined();
      expect(row.getValueCol("Date of Birth")).toBeUndefined();
    });

    // Delete rows
    list.deleteRow(list.rows[0].id);
    expect(list.rows.length).toBe(1);
  });

  test("Delete a list", () => {
    app.createList("My List");
    app.deleteList(app.lists[0].id);
    expect(app.lists.length).toBe(0);
  });

  test("Create form", () => {
    list = app.createList("My List");

    let form = list.createForm("Student Form");
    form.addField(
      new ChoiceColumn("Student Choice", ["Choice 1", "Choice 2", "Choice 3"])
    );
    form.addField(new TextColumn("Student Name", ""));
    form.addField(new NumberColumn("Student Age", 0));

    form.hideField("Title");
    form.hideField("Student Choice");

    const expectedForm = ["Student Name", "Student Age"];

    form.columns.forEach((column, index) => {
      expect(column.name).toBe(expectedForm[index]);
    });

    const expectedColumns = [
      "Title",
      "Student Choice",
      "Student Name",
      "Student Age",
    ];

    // Check column should be added in list
    list.columns.forEach((column, index) => {
      expect(column.name).toBe(expectedColumns[index]);
    });

  });

  test("Create new view", () => {
    list = app.createFromTemplate("Project tracker", app.templates[2].id);

    list.addColumn(new ChoiceColumn("Priority", ["High", "Medium", "Low"]));
    list.addRow("Task 1", new Date("11-07-2003"), true, "High");
    list.addRow("Task 2", new Date("12-08-2004"), false, "Low");

    list.addView("Board View", new BoardView("Board View", "Priority"));
    list.views[0].changeBucket(, column.name);
  });

  test("Delete form", () => {});

  test("Share sheet", () => {});

  test("Export to Excel", () => {});

  test("Export to CSV", () => {});
});
