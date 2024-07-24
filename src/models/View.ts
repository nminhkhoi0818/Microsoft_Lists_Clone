import { v4 as uuidv4 } from "uuid";
import { ChoiceColumn, Column } from "./Column";
import { EnumCalendarDisplay, EnumViewType } from "./Enum";
import { Row } from "./Row";

abstract class View {
  id: string;
  name: string;
  type: EnumViewType;
  columns: Column[];
  rows: Row[];

  constructor(name: string, type: EnumViewType) {
    this.id = uuidv4();
    this.name = name;
    this.type = type;
    this.columns = [];
    this.rows = [];
  }

  hideColumn(colName: string) {
    this.columns = this.columns.filter((col) => col.name !== colName);
  }

  showColumn(colName: string) {
    this.columns = this.columns.filter((col) => col.name !== colName);
  }
}

interface IMoveable {
  moveItem(rowId: string, newValue: any): void;
}

class ListView extends View {
  constructor(name: string) {
    super(name, EnumViewType.List);
  }
}

class CalendarView extends View implements IMoveable {
  calendarColumn: string;
  calendarDisplay: EnumCalendarDisplay;

  constructor(
    name: string,
    calendarDisplay: EnumCalendarDisplay,
    calendarColumn: string
  ) {
    super(name, EnumViewType.Calendar);
    this.calendarDisplay = calendarDisplay;
    this.calendarColumn = calendarColumn;
  }

  getFromDate(date: Date) {
    return this.rows.filter((row) => {
      const rowDate = new Date(row.getValueCol(this.calendarColumn));
      return rowDate.toDateString() === date.toDateString();
    });
  }

  moveItem(rowId: string, newDate: Date) {
    const row = this.rows.find((row) => row.id === rowId);
    row!.setValueCol(this.calendarColumn, newDate);
  }
}

class GalleryView extends View {
  constructor(name: string) {
    super(name, EnumViewType.Gallery);
  }
}

class BoardView extends View implements IMoveable {
  choiceColumn: string;

  constructor(name: string, choiceColumn: string = "") {
    super(name, EnumViewType.Board);
    this.choiceColumn = choiceColumn;
  }

  addOption(newOption: string) {
    const choiceColumn = this.columns.find(
      (col) => col.name === this.choiceColumn
    ) as ChoiceColumn;
    choiceColumn.options.push(newOption);
  }

  moveItem(rowId: string, newOption: string) {
    const row = this.rows.find((row) => row.id === rowId);
    row!.setValueCol(this.choiceColumn, newOption);
  }

  getOptionItems(option: string) {
    return this.rows.filter(
      (row) => row.getValueCol(this.choiceColumn) === option
    );
  }
}

export { View, ListView, CalendarView, GalleryView, BoardView };
