import { Injectable } from '@nestjs/common';
import {
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  ScanCommand,
  ScanCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { ServerConfigService } from '../share/server-config.service';


@Injectable()
export class DynamodbService {
  private readonly client: DynamoDBClient;
  private readonly docClient: DynamoDBDocumentClient;

  constructor(private readonly config: ServerConfigService) {
    this.client = new DynamoDBClient({
      region: this.config.awsConfig.region,
      credentials: {
        accessKeyId: this.config.awsConfig.accessKeyId,
        secretAccessKey: this.config.awsConfig.secretAccessKey,
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


  async scanAndGetByFields(tableName: string, fields: Record<string, any>) {
    const expressionParts: string[] = [];
    const attributeNames: Record<string, string> = {};
    const attributeValues: Record<string, any> = {};

    Object.entries(fields).forEach(([key, value], index) => {
      const nameKey = `#key${index}`;
      const valueKey = `:val${index}`;

      expressionParts.push(`contains(${nameKey}, ${valueKey})`);
      attributeNames[nameKey] = key;
      attributeValues[valueKey] = typeof value === 'string' ? value.toLowerCase() : value;
    });

    const commandInput: ScanCommandInput = {
      TableName: tableName,
      FilterExpression: expressionParts.join(' AND '),
      ExpressionAttributeNames: attributeNames,
      ExpressionAttributeValues: attributeValues,
    };

    const result = await this.docClient.send(new ScanCommand(commandInput));

    // Nếu field cần so sánh không chuẩn hóa, thì lọc thêm phía client:
    return result.Items?.filter(item => {
      return Object.entries(fields).every(([key, val]) =>
        (item[key]?.toLowerCase() || '').includes(val.toLowerCase())
      );
    });
  }

  async updateItem(tableName: string, id: string, updateObject: Record<string, any>) {
    const updateExpr = [];
    const exprAttrNames = {};
    const exprAttrValues = {};

    let index = 0;
    for (const [key, value] of Object.entries(updateObject)) {
      const attrName = `#attr${index}`;
      const attrValue = `:val${index}`;
      updateExpr.push(`${attrName} = ${attrValue}`);
      exprAttrNames[attrName] = key;
      exprAttrValues[attrValue] = value;
      index++;
    }

    const command = new UpdateCommand({
      TableName: tableName,
      Key: { id },
      UpdateExpression: `SET ${updateExpr.join(', ')}`,
      ExpressionAttributeNames: exprAttrNames,
      ExpressionAttributeValues: exprAttrValues,
      ReturnValues: 'ALL_NEW',
    });

    const result = await this.docClient.send(command);
    return result.Attributes;
  }
}
