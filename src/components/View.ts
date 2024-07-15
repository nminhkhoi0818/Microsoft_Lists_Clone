import { v4 as uuidv4 } from "uuid";
import { Column } from "./Column";

class View {
  id: string;
  name: string;
  viewColumns: Column[];

  constructor(name: string, viewColumns: Column[]) {
    this.id = uuidv4();
    this.name = name;
    this.viewColumns = viewColumns;
  }

  addField(column: Column) {
    this.viewColumns.push(column);
  }

  removeField(columnId: string) {
    this.viewColumns = this.viewColumns.filter(
      (column) => column.id !== columnId
    );
  }
}

class ListView extends View {
  constructor() {
    super("List View", []);
  }
}

class CalendarView extends View {
  constructor() {
    super("Calendar View", []);
  }
}

class GaleryView extends View {
  constructor() {
    super("Galery View", []);
  }
}

class BoardView extends View {
  constructor() {
    super("Board View", []);
  }
}

export default View;
