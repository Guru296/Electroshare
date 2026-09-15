package com.electroshare.service;

import com.electroshare.dto.request.ListingRequest;
import com.electroshare.dto.response.ListingResponse;
import com.electroshare.entity.AppUser;
import com.electroshare.entity.Category;
import com.electroshare.entity.Listing;
import com.electroshare.entity.ListingStatus;
import com.electroshare.mapper.ListingMapper;
import com.electroshare.repository.AppUserRepository;
import com.electroshare.repository.CategoryRepository;
import com.electroshare.repository.ListingRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ListingService {

    private final ListingRepository listingRepository;
    private final CategoryRepository categoryRepository;
    private final AppUserRepository appUserRepository;
    private final ListingMapper listingMapper;

    public ListingService(
            ListingRepository listingRepository,
            CategoryRepository categoryRepository,
            AppUserRepository appUserRepository,
            ListingMapper listingMapper) {

        this.listingRepository = listingRepository;
        this.categoryRepository = categoryRepository;
        this.appUserRepository = appUserRepository;
        this.listingMapper = listingMapper;
    }


    // CREATE LISTING
    public ListingResponse createListing(
            ListingRequest request,
            Authentication authentication) throws IOException {

        // Get authenticated user from JWT
        AppUser seller = appUserRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Find category
        Category category = categoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        // Create Listing entity
        Listing listing = new Listing();

        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setPrice(request.getPrice());
        listing.setQuantity(request.getQuantity());
        listing.setCondition(request.getCondition());

        // New listing always has quantity >= 1
        listing.setStatus(ListingStatus.AVAILABLE);

        listing.setLocation(request.getLocation());

        // Image is mandatory when creating listing
        if (request.getImage() == null ||
                request.getImage().isEmpty()) {

            throw new RuntimeException("Image is required");
        }

        // Store image in PostgreSQL
        listing.setImage(request.getImage().getBytes());

        listing.setImageContentType(
                request.getImage().getContentType()
        );

        listing.setCreatedAt(LocalDateTime.now());

        // Set relationships
        listing.setSeller(seller);
        listing.setCategory(category);

        // Save listing
        Listing savedListing =
                listingRepository.save(listing);

        return listingMapper.toResponse(savedListing);
    }


    // GET LISTING ENTITY
    public Listing getListing(Long id) {

        return listingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Listing not found"));
    }


    // GET ALL AVAILABLE LISTINGS
    public List<ListingResponse> getAllListings() {

        return listingRepository
                .findByStatusOrderByCreatedAtDesc(
                        ListingStatus.AVAILABLE
                )
                .stream()
                .map(listingMapper::toResponse)
                .toList();
    }


    // GET LISTING BY ID
    public ListingResponse getListingById(Long id) {

        Listing listing = listingRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Listing not found"));

        return listingMapper.toResponse(listing);
    }


    // GET LISTING IMAGE
    public byte[] getListingImage(Long id) {

        Listing listing = listingRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Listing not found"));

        return listing.getImage();
    }


    // UPDATE LISTING
    public ListingResponse updateListing(
            Long id,
            ListingRequest request,
            Authentication authentication)
            throws IOException {

        // Find listing
        Listing listing = listingRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Listing not found"));

        // Get authenticated user
        AppUser user = appUserRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Only owner can update
        if (!listing.getSeller().getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You are not allowed to update this listing");
        }

        // Sold listing cannot be updated
        if (listing.getStatus() == ListingStatus.SOLD) {

            throw new RuntimeException(
                    "Sold listings cannot be updated");
        }

        // Find category
        Category category = categoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        // Update listing information
        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setPrice(request.getPrice());
        listing.setQuantity(request.getQuantity());
        listing.setCondition(request.getCondition());
        listing.setLocation(request.getLocation());
        listing.setCategory(category);

        // Replace image only if provided
        if (request.getImage() != null &&
                !request.getImage().isEmpty()) {

            listing.setImage(
                    request.getImage().getBytes()
            );

            listing.setImageContentType(
                    request.getImage().getContentType()
            );
        }

        // Save updated listing
        Listing updatedListing =
                listingRepository.save(listing);

        return listingMapper.toResponse(updatedListing);
    }


    // UPDATE QUANTITY
    public ListingResponse updateQuantity(
            Long id,
            Integer quantity,
            Authentication authentication) {

        // Find listing
        Listing listing = listingRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Listing not found"));

        // Get authenticated user
        AppUser user = appUserRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Only owner can update quantity
        if (!listing.getSeller().getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You are not allowed to update this listing");
        }

        // Quantity cannot be negative
        if (quantity < 0) {

            throw new RuntimeException(
                    "Quantity cannot be negative");
        }

        // Update quantity
        listing.setQuantity(quantity);

        // Determine availability from quantity
        if (quantity == 0) {

            listing.setStatus(ListingStatus.SOLD);

        } else {

            listing.setStatus(ListingStatus.AVAILABLE);
        }

        // Save
        Listing updatedListing =
                listingRepository.save(listing);

        return listingMapper.toResponse(updatedListing);
    }


    // DELETE LISTING
    public void deleteListing(
            Long id,
            Authentication authentication) {

        // Find listing
        Listing listing = listingRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Listing not found"));

        // Get authenticated user
        AppUser user = appUserRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Only owner can delete
        if (!listing.getSeller().getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You are not allowed to delete this listing");
        }

        listingRepository.delete(listing);
    }


    // SEARCH LISTINGS
    public List<ListingResponse> searchListings(
            String keyword,
            Long categoryId,
            String location,
            BigDecimal minPrice,
            BigDecimal maxPrice) {

        return listingRepository
                .searchListings(
                        keyword,
                        categoryId,
                        location,
                        minPrice,
                        maxPrice
                )
                .stream()
                .map(listingMapper::toResponse)
                .toList();
    }

    public List<ListingResponse> getMyListings(Authentication authentication) {

        String email = authentication.getName();

        return listingRepository
                .findBySeller_EmailOrderByCreatedAtDesc(email)
                .stream()
                .map(listingMapper::toResponse)
                .toList();
    }
}