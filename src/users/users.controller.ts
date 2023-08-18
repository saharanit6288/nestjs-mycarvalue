import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Session, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(private userService: UsersService,
        private authService: AuthService) {}

    @Post('/signup')
    async signup(@Body() body: CreateUserDto, @Session() session: any) {
       const user = await this.authService.signup(body.email, body.password);
       session.userId = user.id;
       return user;
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signout')
    signout(@Session() session: any) {
        session.userId = null;
    }

    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoami(@CurrentUser() user: User) {
        return user;
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

