import { v4 as uuidv4 } from "uuid";
import { Column } from "./Column";
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
}

class ListView extends View {
  constructor(name: string) {
    super(name, EnumViewType.List);
  }
}

class CalendarView extends View {
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
}

class GalleryView extends View {
  constructor(name: string) {
    super(name, EnumViewType.Gallery);
  }
}

class BoardView extends View {
  choiceColumn: string;

  constructor(name: string, choiceColumn: string = "") {
    super(name, EnumViewType.Board);
    this.choiceColumn = choiceColumn;
  }
}

export { View, ListView, CalendarView, GalleryView, BoardView };
