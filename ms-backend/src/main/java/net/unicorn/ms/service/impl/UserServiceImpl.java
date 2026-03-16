package net.unicorn.ms.service.impl;

import lombok.AllArgsConstructor;
import net.unicorn.ms.dto.UserDto;
import net.unicorn.ms.entity.User;
import net.unicorn.ms.exception.ResourceNotFoundException;
import net.unicorn.ms.mapper.UserMapper;
import net.unicorn.ms.repository.UserRepository;
import net.unicorn.ms.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserDto createUser(UserDto userDto) {
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new IllegalArgumentException("Email уже используется!");
        }

        User user = UserMapper.mapToUser(userDto);

        // Обрабатываем роль администратора (по умолчанию false)
        if (userDto.isAdmin()) {
            user.setAdmin(true);
        } else {
            user.setAdmin(false);
        }

        User savedUser = userRepository.save(user);
        return UserMapper.mapToUserDto(savedUser);
    }

    @Override
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден с ID: " + id));
        return UserMapper.mapToUserDto(user);
    }

    @Override
    public Optional<UserDto> findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(UserMapper::mapToUserDto);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(UserMapper::mapToUserDto)
                .toList();
    }

    @Override
    public UserDto updateUser(Long id, UserDto updatedUserDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден с ID: " + id));

        user.setUserName(updatedUserDto.getUserName());
        user.setEmail(updatedUserDto.getEmail());
        user.setPassword(updatedUserDto.getPassword());

        // Обновляем флаг isAdmin
        user.setAdmin(updatedUserDto.isAdmin());

        User savedUser = userRepository.save(user);
        return UserMapper.mapToUserDto(savedUser);
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("Пользователь не найден с ID: " + id);
        }
        userRepository.deleteById(id);
    }

    @Override
    public Optional<UserDto> authenticate(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(user -> user.getPassword().equals(password)) // Проверка пароля
                .map(user -> {
                    UserDto userDto = UserMapper.mapToUserDto(user);
                    userDto.setAdmin(user.isAdmin()); // Устанавливаем флаг администратора
                    return userDto;
                });
    }
}
