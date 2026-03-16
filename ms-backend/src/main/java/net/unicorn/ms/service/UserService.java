package net.unicorn.ms.service;

import net.unicorn.ms.dto.UserDto;

import java.util.List;
import java.util.Optional;

public interface UserService {

    UserDto createUser(UserDto userDto);

    UserDto getUserById(Long id);

    Optional<UserDto> findUserByEmail(String email);

    boolean existsByEmail(String email);

    List<UserDto> getAllUsers();

    UserDto updateUser(Long id, UserDto updatedUserDto);

    void deleteUser(Long id);

    Optional<UserDto> authenticate(String email, String password);

}
