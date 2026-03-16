package net.unicorn.ms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "email_id", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password; // Новое поле для хранения пароля

    @Column(name = "is_admin", nullable = false)
    private boolean isAdmin; // Новое поле для роли администратора
}
