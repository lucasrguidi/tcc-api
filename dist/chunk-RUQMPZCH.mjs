// src/dynamo.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand
} from "@aws-sdk/lib-dynamodb";
var TABLE_NAME = process.env.TABLE_NAME || "users-table-dev";
var REGION = process.env.AWS_REGION || "us-east-1";
var client = new DynamoDBClient({ region: REGION });
var docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true }
});
var db = {
  async get(userId) {
    const { Item } = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { userId }
    }));
    return Item;
  },
  async put(item) {
    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
      ConditionExpression: "attribute_not_exists(userId)"
    }));
  },
  async scan() {
    const res = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
    return res.Items || [];
  },
  async update(userId, attrs) {
    const sets = [];
    const names = {};
    const values = {};
    if (attrs.name !== void 0) {
      names["#name"] = "name";
      values[":name"] = attrs.name;
      sets.push("#name = :name");
    }
    if (attrs.email !== void 0) {
      names["#email"] = "email";
      values[":email"] = attrs.email;
      sets.push("#email = :email");
    }
    names["#updatedAt"] = "updatedAt";
    values[":updatedAt"] = (/* @__PURE__ */ new Date()).toISOString();
    sets.push("#updatedAt = :updatedAt");
    const res = await docClient.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { userId },
      UpdateExpression: "SET " + sets.join(", "),
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ConditionExpression: "attribute_exists(userId)",
      ReturnValues: "ALL_NEW"
    }));
    return res.Attributes;
  },
  async delete(userId) {
    await docClient.send(new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { userId },
      ConditionExpression: "attribute_exists(userId)"
    }));
  }
};

export {
  docClient,
  db
};
