import { v4 as uuidv4 } from "uuid";
import List from "./List";
import { TextColumn } from "./Column";

class User {
  id: string;
  name: string;
  email: string;
  lists: List[];

  constructor(name: string, email: string) {
    this.id = uuidv4();
    this.name = name;
    this.email = email;
    this.lists = [];
  }

  createList(name: string) {
    const existingList = this.lists.find((list) => list.name === name);
    if (existingList) {
      throw new Error("List with the same name already exists");
    }

    let newList = new List(name);
    // Add default column
    newList.addColumn(new TextColumn("Title"));
    this.lists.push(newList);
    return newList;
  }
}

class Organization {
  id: string;
  name: string;
  users: User[];

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
    this.users = [];
  }

  addUser(userId: string) {
    const user = this.users.find((user) => user.id === userId);

    if (!user) {
      throw new Error("User not found");
    }

    this.users.push(user);
  }
}

export { User, Organization };
