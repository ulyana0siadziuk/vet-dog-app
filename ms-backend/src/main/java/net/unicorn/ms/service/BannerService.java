package net.unicorn.ms.service;

import net.unicorn.ms.dto.BannerRequestDto;
import net.unicorn.ms.dto.BannerResponseDto;
import java.util.List;

public interface BannerService {
    List<BannerResponseDto> getAllBanners();
    BannerResponseDto createBanner(BannerRequestDto bannerRequestDto);
    void deleteBanner(Long id);
    BannerResponseDto updateBanner(Long id, BannerRequestDto bannerRequestDto);
}
