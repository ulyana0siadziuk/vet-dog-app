package net.unicorn.ms.controller;

import lombok.AllArgsConstructor;
import net.unicorn.ms.dto.LoginRequest;
import net.unicorn.ms.dto.UserDto;
import net.unicorn.ms.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@AllArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    // Авторизация пользователя
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        if (loginRequest.getEmail() == null || loginRequest.getPassword() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email и пароль обязательны"));
        }

        Optional<UserDto> optionalUser = userService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Неверный email или пароль"));
        }

        UserDto user = optionalUser.get();

        // Возвращаем данные пользователя, включая флаг isAdmin
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "userName", user.getUserName(),
                "isAdmin", user.isAdmin() // Добавлен флаг администратора
        ));
    }

    // Создание нового пользователя
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserDto userDto) {
        if (userDto.getEmail() == null || userDto.getEmail().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email обязателен"));
        }

        if (userDto.getPassword() == null || userDto.getPassword().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Пароль обязателен"));
        }

        if (userService.existsByEmail(userDto.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Пользователь с таким email уже зарегистрирован"));
        }

        UserDto savedUser = userService.createUser(userDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    // Получение пользователя по ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable("id") Long userId) {
        if (userId == null || userId <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Некорректный ID пользователя"));
        }

        UserDto userDto = userService.getUserById(userId);
        userDto.setPassword(null); // Убираем пароль из ответа

        return ResponseEntity.ok(userDto);
    }

    // Получение всех пользователей
    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        users.forEach(user -> user.setPassword(null)); // Убираем пароли из списка
        return ResponseEntity.ok(users);
    }

    // Обновление пользователя
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable("id") Long userId, @RequestBody UserDto updatedUser) {
        if (updatedUser.getEmail() == null || updatedUser.getEmail().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email обязателен"));
        }

        if (updatedUser.getPassword() == null || updatedUser.getPassword().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Пароль обязателен"));
        }

        UserDto updatedUserDto = userService.updateUser(userId, updatedUser);
        return ResponseEntity.ok(updatedUserDto);
    }

    // Удаление пользователя
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable("id") Long userId) {
        if (userId == null || userId <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Некорректный ID пользователя"));
        }

        userService.deleteUser(userId);
        return ResponseEntity.ok(Map.of("message", "Пользователь успешно удален"));
    }
}
