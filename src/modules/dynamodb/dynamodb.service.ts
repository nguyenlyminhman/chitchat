import { Injectable } from '@nestjs/common';
import {
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
} from '@aws-sdk/lib-dynamodb';


@Injectable()
export class DynamodbService {
    private readonly client: DynamoDBClient;
  private readonly docClient: DynamoDBDocumentClient;

  constructor() {
    this.client = new DynamoDBClient({
      region: 'us-east-1',
      credentials: {
        accessKeyId: '',
        secretAccessKey: '',
      },
    });

    this.docClient = DynamoDBDocumentClient.from(this.client);
  }

  async putItem(tableName: string, item: Record<string, any>) {
    const command = new PutCommand({
      TableName: tableName,
      Item: item,
    });
    return this.docClient.send(command);
  }

  async getItem(tableName: string, key: Record<string, any>) {
    const command = new GetCommand({
      TableName: tableName,
      Key: key,
    });
    return this.docClient.send(command);
  }
}
