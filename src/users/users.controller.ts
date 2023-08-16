import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('auth')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
       return this.userService.create(body.email, body.password);
    }

    @Get('/:id')
    findUser(@Param('id') id: string): Promise<User> {
        return this.userService.findOne(parseInt(id));
    }

    @Get()
    findAllUsers(@Query('email') email: string): Promise<User[]> {
        return this.userService.find(email);
    }

    @Delete('/:id')
    deleteUser(@Param('id') id: string): Promise<User> {
        return this.userService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(
        @Param('id') id: string,
        @Body() body: UpdateUserDto) {
        return this.userService.update(parseInt(id), body);
    }
    
}
