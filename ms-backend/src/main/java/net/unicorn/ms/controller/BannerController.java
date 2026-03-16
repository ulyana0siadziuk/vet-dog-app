package net.unicorn.ms.controller;

import lombok.RequiredArgsConstructor;
import net.unicorn.ms.dto.BannerRequestDto;
import net.unicorn.ms.dto.BannerResponseDto;
import net.unicorn.ms.service.BannerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banners")
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;

    @GetMapping
    public ResponseEntity<List<BannerResponseDto>> getAllBanners() {
        return ResponseEntity.ok(bannerService.getAllBanners());
    }

    @PostMapping
    public ResponseEntity<BannerResponseDto> createBanner(@RequestBody BannerRequestDto bannerRequestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bannerService.createBanner(bannerRequestDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BannerResponseDto> updateBanner(@PathVariable Long id,
                                                          @RequestBody BannerRequestDto bannerRequestDto) {
        return ResponseEntity.ok(bannerService.updateBanner(id, bannerRequestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBanner(@PathVariable Long id) {
        bannerService.deleteBanner(id);
        return ResponseEntity.noContent().build();
    }

}
