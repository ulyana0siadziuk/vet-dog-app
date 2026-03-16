package net.unicorn.ms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BannerRequestDto {
    @NotNull(message = "Image URL is required")
    @NotBlank(message = "Image URL cannot be blank")
    private String imageUrl; // URL изображения баннера
}
