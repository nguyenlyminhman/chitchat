import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    async createUser(users: Partial<User>): Promise<User> {
        try {
            // const user: Partial<User> = {
            //     name: 'hello',
            //     age: 10,
            //     breed: 'yub',
            //   };


            const a = this.userModel.create(users)
            return a;
        } catch (Error) {
            console.log(Error);
        }
    }

    async getUserById(): Promise<any> {
        try {
            const result = null;
            return result;
        } catch (Error) {
            console.log(Error);
        }
    }

    async updateUserById(): Promise<any> {
        try {
            const result = null;
            return result;
        } catch (Error) {
            console.log(Error);
        }
    }
}
