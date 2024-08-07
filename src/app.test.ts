import request from "supertest";
import express from "express";
import listRoutes from "./routes/listRoutes";
import { connect } from "./db";

const app = express();
app.use(express.json());
app.use("/api/lists", listRoutes);

describe("List API", () => {
  beforeAll(async () => {
    await connect();
  });

  it("Create a list", async () => {
    const newList = { name: "New List 3" };

    const res = await request(app).post("/api/lists").send(newList);

    expect(res.status).toBe(201);
    expect(res.body.name).toEqual(newList.name);
  });

  it("Add multiples column to a list", async () => {
    let listId = 5;
    const columns = [
      {
        name: "Full Name",
        type: "Text",
        config: [
          { configName: "maxLength", configValue: "255" },
          { configName: "defaultValue", configValue: "Nguyen Van A" }
        ]
      },
      {
        name: "Age",
        type: "Number",
        config: [{ configName: "defaultValue", configValue: "18" }]
      },
      {
        name: "Course",
        type: "Choice",
        config: [
          { configName: "choices", configValue: "Math, Physics, English" },
          { configName: "defaultValue", configValue: "Math" }
        ]
      },
      {
        name: "Link",
        type: "Hyperlink",
        config: []
      },
      {
        name: "Married",
        type: "YesNo",
        config: []
      },
      {
        name: "My Image",
        type: "Image",
        config: []
      },
      {
        name: "Location",
        type: "Location",
        config: []
      }
    ];

    await Promise.all(
      columns.map(async (col) => {
        const res = await request(app)
          .post(`/api/lists/${listId}/columns`)
          .send(col);

        expect(res.status).toBe(201);
        expect(res.body.name).toEqual(col.name);
        expect(res.body.type).toEqual(col.type);
      })
    );
  });

  it("Add a row to a list", async () => {
    let listId = 5;

    const res = await request(app)
      .post(`/api/lists/${listId}/rows`)
      .send({
        formValues: [
          { FieldName: "Full Name", FieldValue: "Minh Khoi" },
          { FieldName: "Age", FieldValue: "12" },
          {
            FieldName: "Link",
            FieldValue: "https://www.youtube.com, Youtube"
          },
          { FieldName: "Married", FieldValue: "1" },
          { FieldName: "My Image", FieldValue: "cat.png, Cat Picture" },
          {
            FieldName: "Location",
            FieldValue: "Ho Chi Minh City Museum, 65 Đuong Ly Tu Trong"
          },
          { FieldName: "Course", FieldValue: "Math" }
        ]
      });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: expect.any(Number) });
  });

  it("Update a column", async () => {
    let listId = 9;
    let columnId = 40;

    const res = await request(app)
      .put(`/api/lists/${listId}/columns/${columnId}`)
      .send({ name: "Full Name", type: "Text" });

    expect(res.status).toBe(204);
  });

  it("Update cell data", async () => {
    let listId = 5;
    let rowId = 5;

    const res = await request(app)
      .put(`/api/lists/${listId}/rows/${rowId}`)
      .send({ FieldName: "Full Name", FieldValue: "New Value" });

    expect(res.status).toBe(204);
  });

  it("Delete a column", async () => {
    let listId = 5;
    let columnId = 5;

    const res = await request(app).delete(
      `/api/lists/${listId}/columns/${columnId}`
    );

    expect(res.status).toBe(204);
  });

  it("Delete a row", async () => {
    let listId = 5;
    let rowId = 5;

    const res = await request(app).delete(`/api/lists/${listId}/rows/${rowId}`);

    expect(res.status).toBe(204);
  });

  it("Create list from template", async () => {
    const templateId = 5;
    const newListName = "New List 3";

    const res = await request(app)
      .post(`/api/lists/from-template`)
      .send({ name: newListName, templateId });

    expect(res.status).toBe(201);
    expect(res.body.name).toEqual(newListName);
  });

  it("Get all lists", async () => {
    const page = 1;
    const pageSize = 1;

    const res = await request(app).get("/api/lists").query({ page, pageSize });

    const expectedData = [
      {
        id: expect.any(Number),
        name: expect.any(String)
      }
    ];

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.arrayContaining(expectedData));
  });

  it("Get all templates", async () => {
    const page = 1;
    const pageSize = 10;

    const res = await request(app)
      .get("/api/lists/templates")
      .query({ page, pageSize });

    const expectedData = [
      {
        id: expect.any(Number),
        name: expect.any(String),
        listId: expect.any(Number)
      }
    ];

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.arrayContaining(expectedData));
  });

  it("Get rows of a list", async () => {
    const listId = 5;
    const page = 1;
    const pageSize = 10;

    const res = await request(app).get(`/api/lists/${listId}/rows`).query({
      page,
      pageSize
    });

    const expectedData = [
      {
        id: 9,
        listId: 5,
        cells: {
          "Full Name": "Minh Khoi",
          Age: 12,
          Link: {
            url: "https://www.youtube.com",
            displayText: "Youtube"
          },
          Married: {
            value: 1,
            displayText: "Yes"
          },
          "My Image": {
            url: "cat.png",
            fileName: "Cat Picture"
          },
          Location: {
            displayName: "Ho Chi Minh City Museum",
            address: "65 Đuong Ly Tu Trong"
          },
          Course: "Math"
        }
      }
    ];

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expectedData);
  });

  it("Filter data in rows", async () => {
    const listId = 5;
    const column = "Full Name";
    const values = ["Minh Khoi"];
    const page = 1;
    const pageSize = 10;

    const res = await request(app)
      .get(`/api/lists/${listId}/rows?filter`)
      .query({ column, value: values, page, pageSize });

    const expectedData = [
      {
        id: 9,
        listId: 5,
        cells: {
          "Full Name": "Minh Khoi",
          Age: 12,
          Link: {
            url: "https://www.youtube.com",
            displayText: "Youtube"
          },
          Married: {
            value: 1,
            displayText: "Yes"
          },
          "My Image": {
            url: "cat.png",
            fileName: "Cat Picture"
          },
          Location: {
            displayName: "Ho Chi Minh City Museum",
            address: "65 Đuong Ly Tu Trong"
          },
          Course: "Math"
        }
      }
    ];

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expectedData);
  });

  it("Add multiple choice column", async () => {
    const listId = 6;
    const column = {
      name: "Course",
      type: "MultiChoice",
      config: [{ configName: "choices", configValue: "Math, Physics, English" }]
    };
    const res = await request(app)
      .post(`/api/lists/${listId}/columns`)
      .send(column);

    expect(res.status).toBe(201);
  });

  it("Add data row in multiple choice column", async () => {
    const listId = 6;
    const res = await request(app)
      .post(`/api/lists/${listId}/rows`)
      .send({
        formValues: [{ FieldName: "Course", FieldValue: "Math, Physics" }]
      });

    expect(res.status).toBe(201);
  });

  it("Get data of template", async () => {
    const templateId = 1;
    const res = await request(app).get(`/api/lists/templates/${templateId}`);

    expect(res.status).toBe(200);
  });
});
