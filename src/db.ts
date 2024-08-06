import mysql from "mysql2/promise";

export const connectionConfig = {};

let connection: mysql.Connection;

export const connect = async () => {
  if (!connection) {
    connection = await mysql.createConnection(connectionConfig);
  }
  return connection;
};

export const getConnection = () => connection;
