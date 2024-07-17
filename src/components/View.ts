import { v4 as uuidv4 } from "uuid";
import { Column } from "./Column";
import { EnumViewType } from "./Enum";

abstract class View {
  id: string;
  name: string;
  type: EnumViewType;
  viewColumns: Column[];

  constructor(name: string, type: EnumViewType) {
    this.id = uuidv4();
    this.name = name;
    this.type = type;
    this.viewColumns = [];
  }
}

class ListView extends View {
  constructor(name: string) {
    super(name, EnumViewType.List);
  }
}

class CalendarView extends View {
  constructor(name: string) {
    super(name, EnumViewType.Calendar);
  }
}

class GalleryView extends View {
  constructor(name: string) {
    super(name, EnumViewType.Gallery);
  }
}

class BoardView extends View {
  constructor(name: string) {
    super(name, EnumViewType.Board);
  }
}

export { View, ListView, CalendarView, GalleryView, BoardView };
