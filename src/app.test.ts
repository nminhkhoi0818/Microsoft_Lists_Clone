import {
  TextColumn,
  ChoiceColumn,
  NumberColumn,
  YesNoColumn,
  DateColumn,
} from "./class/Column";
import { FILE_PATHS } from "./class/config";
import { EnumCalendarDisplay, EnumChoiceType } from "./class/Enum";
import List from "./class/List";
import ListManagement from "./class/ListManagement";
import path from "path";
import { BoardView, CalendarView, ListView } from "./class/View";

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

  test("Add new columns, insert data", () => {
    let list = app.createList("My List");

    // Add columns data
    list.addColumn(new NumberColumn("Age"));
    list.addColumn(new YesNoColumn("Is Active"));
    list.addColumn(new DateColumn("Date of Birth"));
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

    list.getRow(0).setValueCol("Date of Birth", new Date("1990-01-01"));
    list.getRow(1).setValueCol("Date of Birth", new Date("1995-01-01"));

    const expectedData = [
      {
        Title: "John Doe",
        Age: 30,
        "Is Active": false,
        Gender: "Male",
        "Date of Birth": new Date("1990-01-01"),
        Courses: ["Math", "English"],
      },
      {
        Title: "Jane Doe",
        Age: 0,
        "Is Active": false,
        Gender: "Female",
        "Date of Birth": new Date("1995-01-01"),
        Courses: undefined,
      },
      {
        Title: "Peter",
        Age: 0,
        "Is Active": false,
        Gender: undefined,
        "Date of Birth": new Date(0),
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
      expect(row.getValueCol("Date of Birth")).toStrictEqual(
        expectedData[index]["Date of Birth"]
      );
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

    let result = list.searchRows("John");

    const expectedData = [
      {
        Title: "John Doe",
        Age: 30,
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

    list.addRow({ Title: "John Doe", Age: 30, "Is Active": true });
    list.addRow({ Title: "Jane Doe", Age: 25, "Is Active": false });
    list.addRow({ Title: "Peter", Age: 35, "Is Active": true });

    list.moveLeftColumn("Is Active");
    list.hideColumn("Age");

    list.sortAsc("Age");
    let groupData = list.groupBy("Is Active");

    const expectedData = {
      true: [
        { Title: "John Doe", Age: 30, "Is Active": true },
        { Title: "Peter", Age: 35, "Is Active": true },
      ],
      false: [{ Title: "Jane Doe", Age: 25, "Is Active": false }],
    };

    const checkGroup = (group, expected) => {
      group.forEach((row, index) => {
        expect(row.getValueCol("Title")).toBe(expected[index].Title);
        expect(row.getValueCol("Age")).toBe(expected[index].Age);
        expect(row.getValueCol("Is Active")).toBe(expected[index]["Is Active"]);
      });
    };

    checkGroup(groupData["true"], expectedData["true"]);
    checkGroup(groupData["false"], expectedData["false"]);

    const expectedColumns = ["Title", "Is Active", "Age", "Description"];

    list.columns.forEach((column, index) => {
      expect(column.name).toBe(expectedColumns[index]);
    });
    expect(list.getColumn("Age")!.isHidden).toBe(true);
  });

  test("Add multiple views", () => {
    list = app.createList("My List");
    list.addColumn(
      new ChoiceColumn("Choice", EnumChoiceType.Single, [
        "Option 1",
        "Option 2",
        "Option 3",
      ])
    );
    list.addColumn(new DateColumn("Date"));

    list.addRow({
      Title: "John Doe",
      Choice: "Option 1",
      Date: new Date("2024-01-01"),
    });
    list.addRow({
      Title: "Jane Doe",
      Choice: "Option 1",
      Date: new Date("2024-01-02"),
    });
    list.addRow({
      Title: "Peter",
      Choice: "Option 1",
      Date: new Date("2024-01-03"),
    });

    let item = list.getRow(0);

    // Adding calendar view
    const calendarView = new CalendarView(
      "Calendar View",
      EnumCalendarDisplay.Week,
      "Date"
    );
    list.addView(calendarView);

    calendarView.moveItem(item.id, new Date("2024-01-02"));

    expect(calendarView.getFromDate(new Date("2024-01-02")).length).toBe(2);
    expect(calendarView.getFromDate(new Date("2024-01-01")).length).toBe(0);

    // Adding board view
    const boardView = new BoardView("Board View", "Choice");
    list.addView(boardView);

    expect(boardView.getOptionItems("Option 1").length).toBe(3);

    boardView.moveItem(item.id, "Option 2");

    expect(boardView.getOptionItems("Option 1").length).toBe(2);
    expect(boardView.getOptionItems("Option 2").length).toBe(1);
  });

  test("Show and hide columns in views", () => {
    list = app.createList("My List");
    list.addColumn(new NumberColumn("Age"));
    list.addColumn(new YesNoColumn("Is Active"));
    list.addColumn(new TextColumn("Description"));

    let listView = new ListView("List View");
    listView.columns = list.columns;
    list.addView(listView);

    listView.hideColumn("Age");
    listView.hideColumn("Description");
    listView.showColumn("Age");

    const expectedColumns = ["Title", "Is Active", "Age"];
    listView.columns.forEach((column, index) => {
      expect(column.name).toBe(expectedColumns[index]);
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
      "Budget",
      "Status",
      "Estimated Hours",
    ];

    form.columns.forEach((column, index) => {
      expect(column.name).toBe(expectedColumns[index]);
    });

    // Columns should be change in list
    list.columns.forEach((column, index) => {
      expect(column.name).toBe(expectedColumns[index]);
    });

    const formData = {
      "Project Name": "Project A",
      "Start Date": new Date("2023-01-01"),
      "End Date": new Date("2023-12-31"),
      Budget: 10000,
      Status: "In Progress",
      "Estimated Hours": 150,
    };

    form.submit(formData);

    list.rows.forEach((row) => {
      Object.keys(formData).forEach((colName) => {
        expect(row.getValueCol(colName)).toStrictEqual(formData[colName]);
      });
    });
  });

  test("Delete columns, and list", () => {
    app.createList("My List");
    list.addColumn(new NumberColumn("Age"));
    list.addColumn(new YesNoColumn("Is Active"));

    list.addRow({ Title: "John Doe", Age: 30, "Is Active": true });
    list.addRow({ Title: "Jane Doe", Age: 25, "Is Active": false });

    list.deleteColumn("Age");

    list.rows.forEach((row) => {
      expect(row.getValueCol("Age")).toBe(undefined);
    });

    app.deleteList("My List");
    expect(app.getList("My List")).toBe(undefined);
  });
});
