package net.unicorn.ms.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Разрешить доступ ко всем эндпоинтам
                .allowedOrigins("http://localhost:3000") // Разрешить доступ только с клиента React
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Разрешить определённые HTTP-методы
                .allowedHeaders("*")// Разрешить любые заголовки
                .allowCredentials(true);
    }
}
