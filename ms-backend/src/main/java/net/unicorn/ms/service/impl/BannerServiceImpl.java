package net.unicorn.ms.service.impl;

import lombok.RequiredArgsConstructor;
import net.unicorn.ms.dto.BannerRequestDto;
import net.unicorn.ms.dto.BannerResponseDto;
import net.unicorn.ms.entity.Banner;
import net.unicorn.ms.exception.ResourceNotFoundException;
import net.unicorn.ms.repository.BannerRepository;
import net.unicorn.ms.service.BannerService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BannerServiceImpl implements BannerService {

    private final BannerRepository bannerRepository;

    @Override
    public List<BannerResponseDto> getAllBanners() {
        return bannerRepository.findAll()
                .stream()
                .map(banner -> new BannerResponseDto(banner.getId(), banner.getImageUrl()))
                .collect(Collectors.toList());
    }

    @Override
    public BannerResponseDto createBanner(BannerRequestDto bannerRequestDto) {
        Banner banner = new Banner();
        banner.setImageUrl(bannerRequestDto.getImageUrl());
        Banner savedBanner = bannerRepository.save(banner);
        return new BannerResponseDto(savedBanner.getId(), savedBanner.getImageUrl());
    }

    @Override
    public void deleteBanner(Long id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Banner not found with ID: " + id));
        bannerRepository.delete(banner);
    }

    @Override
    public BannerResponseDto updateBanner(Long id, BannerRequestDto bannerRequestDto) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Banner not found with ID: " + id));
        banner.setImageUrl(bannerRequestDto.getImageUrl());
        Banner updatedBanner = bannerRepository.save(banner);
        return new BannerResponseDto(updatedBanner.getId(), updatedBanner.getImageUrl());
    }
}
