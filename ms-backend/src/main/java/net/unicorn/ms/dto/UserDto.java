package net.unicorn.ms.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private long id;
    @Column(name = "user_name")
    private String userName;
    @Column(name = "email_id", nullable = false, unique = true)
    private String email;
    @Column(name = "password", nullable = false)
    private String password;
    private boolean isAdmin; // Новое поле для роли администратора
}
