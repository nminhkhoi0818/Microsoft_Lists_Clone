enum EnumColumnType {
  Text = "Text",
  Number = "Number",
  YesNo = "YesNo",
  Person = "Person",
  Date = "Date",
  Choice = "Choice",
  MultiChoice = "MultiChoice",
  Hyperlink = "Hyperlink",
  Currency = "Currency",
  Location = "Location",
  Image = "Image",
  ManagedMetadata = "Managed Metadata",
  Lookup = "Lookup",
}

enum EnumViewType {
  List,
  Calendar,
  Gallery,
  Board,
}

enum EnumCalendarDisplay {
  Day,
  Week,
  Month,
}

export { EnumColumnType, EnumViewType, EnumCalendarDisplay };
