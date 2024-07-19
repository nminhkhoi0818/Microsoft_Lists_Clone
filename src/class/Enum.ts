enum EnumColumnType {
  Text,
  Number,
  YesNo,
  Person,
  Date,
  Choice,
  Hyperlink,
  Currency,
  Location,
  Image,
  ManagedMetadata,
  Lookup,
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
