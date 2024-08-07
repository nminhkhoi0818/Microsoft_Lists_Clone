import mysql from "mysql2/promise";

export const connectionConfig = {
  host: "127.0.0.1",
  user: "root",
  password: "Minhkhoi@2003",
  database: "mslists"
};

let connection: mysql.Connection;

export const connect = async () => {
  if (!connection) {
    connection = await mysql.createConnection(connectionConfig);
  }
  return connection;
};

export const getConnection = () => connection;
