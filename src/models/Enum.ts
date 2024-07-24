enum EnumColumnType {
  Text = "Text",
  Number = "Number",
  YesNo = "Yes/No",
  Person = "Person",
  Date = "Date",
  Choice = "Choice",
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

enum EnumChoiceType {
  Single,
  Multiple,
}

export { EnumColumnType, EnumViewType, EnumChoiceType, EnumCalendarDisplay };
