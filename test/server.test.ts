import request from "supertest";
import { server } from "../src/app/index";
import { User } from "../src/users/type";
import { generateUUID } from "../src/users/user";

const app = request(server);

let userId: string;

const newUser: User = {username: "Name", age: 25, hobbies: []};
const newUserPut: User = {username: "NameName", age: 30, hobbies: ['hobbies1', 'hobbies2']};

afterAll(() => {
    server.close();
});

describe("Scenario one", () => {
    it("should return an empty array with a GET api/users request", async () => {
      const res = await app.get("/api/users");
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should return newly created record for a POST api/users request", async () => {
        const res = await app.post("/api/users").send(newUser);
        expect(res.statusCode).toBe(201);
        expect(res.body.username).toEqual("Name");
        expect(res.body.age).toEqual(25);
        expect(res.body.hobbies).toEqual([]);
        userId = res.body.id;
    });

    it("should return created record with a GET api/user/{userId} request", async () => {
        const res = await app.get(`/api/users/${userId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toEqual(userId);
        expect(res.body.username).toEqual("Name");
        expect(res.body.age).toEqual(25);
        expect(res.body.hobbies).toEqual([]);
    });

    it("should return containing an updated object with the same id the created record with a PUT api/users/{userId} request", async () => {
        const res = await app.put(`/api/users/${userId}`).send(newUserPut);
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(userId);
        expect(res.body.username).toEqual(newUserPut.username);
        expect(res.body.age).toEqual(newUserPut.age);
        expect(res.body.hobbies).toEqual(newUserPut.hobbies);
    });

    it("should delete the created object by id with a DELETE api/users/{userId} request", async () => {
        const res = await app.delete(`/api/users/${userId}`);
        expect(res.statusCode).toBe(204);
    });

    it("should return that there is no such object with a GET api/users/{userId} request", async () => {
        const res = await app.get(`/api/users/${userId}`);
        expect(res.statusCode).toBe(404);
    });
});

describe("Scenario two", () => {

    const newUserError = {username: 1, age: 25, hobbies: []};

    it("should return statusCode 400 if user is invalid for the POST request", async () => {
        const res = await app.post("/api/users").send(newUserError);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toEqual("User is invalid");
    });

    const newUserError1 = {username: "Name", age: "twenty", hobbies: []};

    it("should return statusCode 400 if user is invalid for the POST request", async () => {
        const res = await app.post("/api/users").send(newUserError1);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toEqual("User is invalid");
    });
    
    const newUserError2 = {username: "Name", age: "20", hobbies: "football"};

    it("should return statusCode 400 if user is invalid for the POST request", async () => {
        const res = await app.post("/api/users").send(newUserError2);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toEqual("User is invalid");
    });

    const newUserError3 = {username: "Name", age: 25};

    it("should return statusCode 400 if user is invalid for the POST request", async () => {
        const res = await app.post("/api/users").send(newUserError3);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toEqual("User is invalid");
    });

    it("should return an empty array with a GET api/users request", async () => {
        const res = await app.get("/api/users");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });
});

describe("Scenario three", () => {

    it("should return newly created record for a POST api/users request", async () => {
        const res = await app.post("/api/users").send(newUser);
        expect(res.statusCode).toBe(201);
        expect(res.body.username).toEqual("Name");
        expect(res.body.age).toEqual(25);
        expect(res.body.hobbies).toEqual([]);
        userId = res.body.id;
    });

    it("should return statusCode 404 if user not found for the GET request", async () => {
        const res = await app.get(`/api/users/${generateUUID()}`);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toEqual("User not found");
    });

    it("should return statusCode 400 if userId is invalid for the GET request", async () => {
        const res = await app.get(`/api/users/${userId.slice(0,5)}`);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toEqual("userId is invalid");
    });

    it("should return statusCode 404 if user not found for the PUT request", async () => {
        const res = await app.put(`/api/users/${generateUUID()}`);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toEqual("User not found");
    });

    it("should return statusCode 400 if userId is invalid for the PUT request", async () => {
        const res = await app.put(`/api/users/${userId.slice(0,10)}`);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toEqual("userId is invalid");
    });

    it("should return statusCode 404 if user not found for the DELETE request", async () => {
        const res = await app.delete(`/api/users/${generateUUID()}`);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toEqual("User not found");
    });

    it("should return statusCode 400 if userId is invalid for the DELETE request", async () => {
        const res = await app.delete(`/api/users/${userId.slice(0,10)}`);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toEqual("userId is invalid");
    });

    it("should return newly created record for a POST api/users request", async () => {
        const res = await app.post("/api/users").send(newUser);
        expect(res.statusCode).toBe(201);
        expect(res.body.username).toEqual("Name");
        expect(res.body.age).toEqual(25);
        expect(res.body.hobbies).toEqual([]);
    });
});
