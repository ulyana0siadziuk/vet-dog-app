package net.unicorn.ms.mapper;

import net.unicorn.ms.dto.UserDto;
import net.unicorn.ms.entity.User;

public class UserMapper {

    // Метод для преобразования User -> UserDto
    public static UserDto mapToUserDto(User user) {
        return new UserDto(
                user.getId(),
                user.getUserName(),
                user.getEmail(),
                user.getPassword(),
                user.isAdmin()
        );
    }

    // Метод для преобразования UserDto -> User
    public static User mapToUser(UserDto userDto) {
        return new User(
                userDto.getId(),
                userDto.getUserName(),
                userDto.getEmail(),
                userDto.getPassword(),
                userDto.isAdmin()
        );
    }
}
