package net.unicorn.ms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BannerResponseDto {
    private Long id;         // ID баннера
    private String imageUrl; // URL изображения баннера
}
