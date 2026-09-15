package com.electroshare.controller;

import com.electroshare.dto.request.ListingRequest;
import com.electroshare.dto.response.ListingResponse;
import com.electroshare.entity.Listing;
import com.electroshare.service.ListingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/listings")
public class ListingController {

    private final ListingService listingService;

    public ListingController(ListingService listingService) {
        this.listingService = listingService;
    }


    // CREATE LISTING
    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ListingResponse> createListing(
            @Valid @ModelAttribute ListingRequest request,
            Authentication authentication)
            throws IOException {

        ListingResponse response =
                listingService.createListing(
                        request,
                        authentication
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // GET ALL AVAILABLE LISTINGS
    @GetMapping
    public ResponseEntity<List<ListingResponse>>
    getAllListings() {

        return ResponseEntity.ok(
                listingService.getAllListings()
        );
    }


    // SEARCH LISTINGS
    @GetMapping("/search")
    public ResponseEntity<List<ListingResponse>>
    searchListings(

            @RequestParam(required = false)
            String keyword,

            @RequestParam(required = false)
            Long categoryId,

            @RequestParam(required = false)
            String location,

            @RequestParam(required = false)
            BigDecimal minPrice,

            @RequestParam(required = false)
            BigDecimal maxPrice) {

        return ResponseEntity.ok(
                listingService.searchListings(
                        keyword,
                        categoryId,
                        location,
                        minPrice,
                        maxPrice
                )
        );
    }


    // GET LISTING BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ListingResponse>
    getListingById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                listingService.getListingById(id)
        );
    }


    // GET LISTING IMAGE
    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getListingImage(
            @PathVariable Long id) {

        Listing listing =
                listingService.getListing(id);

        return ResponseEntity.ok()
                .contentType(
                        MediaType.parseMediaType(
                                listing.getImageContentType()
                        )
                )
                .body(listing.getImage());
    }


    // UPDATE LISTING
    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ListingResponse>
    updateListing(

            @PathVariable Long id,

            @Valid
            @ModelAttribute ListingRequest request,

            Authentication authentication)
            throws IOException {

        return ResponseEntity.ok(
                listingService.updateListing(
                        id,
                        request,
                        authentication
                )
        );
    }


    // UPDATE QUANTITY
    @PatchMapping("/{id}/quantity")
    public ResponseEntity<ListingResponse>
    updateQuantity(

            @PathVariable Long id,

            @RequestParam Integer quantity,

            Authentication authentication) {

        return ResponseEntity.ok(
                listingService.updateQuantity(
                        id,
                        quantity,
                        authentication
                )
        );
    }


    // DELETE LISTING
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteListing(
            @PathVariable Long id,
            Authentication authentication) {

        listingService.deleteListing(
                id,
                authentication
        );

        return ResponseEntity
                .noContent()
                .build();
    }

    @GetMapping("/my")
    public ResponseEntity<List<ListingResponse>> getMyListings(
            Authentication authentication) {

        return ResponseEntity.ok(
                listingService.getMyListings(authentication)
        );
    }
}