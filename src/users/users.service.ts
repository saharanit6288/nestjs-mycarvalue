import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private repo: Repository<User>
    ) {}

    create(email, password) {
        const user = this.repo.create({
            email,
            password
        });

        return this.repo.save(user);
    }
    
    async findOne(id: number): Promise<User> {
        const user = await this.repo.findOneBy({ id });
        
        if(!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async find(email: string): Promise<User[]> {
        const user = await this.repo.find({ where: { email } });
        
        if(!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.findOne(id);

        Object.assign(user, attrs);

        return this.repo.save(user);
    }

    async remove(id: number) {
        const user = await this.findOne(id);

        return this.repo.remove(user);
    }
}
