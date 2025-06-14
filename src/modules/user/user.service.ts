import { Catch, Injectable } from '@nestjs/common';
import { DynamodbService } from '../dynamodb/dynamodb.service';

@Injectable()
export class UserService {
    constructor(
        readonly dbService: DynamodbService
    ) { }

    async createUser(): Promise<any> {
        try {
            const result = await this.dbService.putItem('Users', { id:"1", name: "abc", age: 12, email: "abc@gmail.com" });
            return result;
        } catch (Error) {
            console.log(Error);
        }
    }

    async getUserById(): Promise<any> {
        try {
            const result = await this.dbService.getItem('Users', { id:"1"});
            return result;
        } catch (Error) {
            console.log(Error);
        }
    }

    async updateUserById(): Promise<any> {
        try {
            const result = await this.dbService.updateItem('Users', "1", { name: "xyz" });
            return result;
        } catch (Error) {
            console.log(Error);
        }
    }
}
