import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = process.env.TABLE_NAME || "users-table-dev";
const REGION = process.env.AWS_REGION || "us-east-1";

const client = new DynamoDBClient({ region: REGION });
export const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

export type User = {
  userId: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
};

export const db = {
  async get(userId: string) {
    const { Item } = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { userId },
    }));
    return Item as User | undefined;
  },
  async put(item: User) {
    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
      ConditionExpression: "attribute_not_exists(userId)"
    }));
  },
  async scan() {
    const res = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
    return (res.Items as User[]) || [];
  },
  async update(userId: string, attrs: Partial<User>) {
    const sets: string[] = [];
    const names: Record<string, string> = {};
    const values: Record<string, any> = {};

    if (attrs.name !== undefined) {
      names["#name"] = "name";
      values[":name"] = attrs.name;
      sets.push("#name = :name");
    }
    if (attrs.email !== undefined) {
      names["#email"] = "email";
      values[":email"] = attrs.email;
      sets.push("#email = :email");
    }
    names["#updatedAt"] = "updatedAt";
    values[":updatedAt"] = new Date().toISOString();
    sets.push("#updatedAt = :updatedAt");

    const res = await docClient.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { userId },
      UpdateExpression: "SET " + sets.join(", "),
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ConditionExpression: "attribute_exists(userId)",
      ReturnValues: "ALL_NEW",
    }));
    return res.Attributes as User;
  },
  async delete(userId: string) {
    await docClient.send(new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { userId },
      ConditionExpression: "attribute_exists(userId)",
    }));
  },
};