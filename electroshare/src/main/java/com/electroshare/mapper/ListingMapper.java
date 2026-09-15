package com.electroshare.mapper;

import com.electroshare.dto.response.ListingResponse;
import com.electroshare.entity.Listing;
import org.springframework.stereotype.Component;

@Component
public class ListingMapper {

    public ListingResponse toResponse(Listing listing) {

        ListingResponse response =
                new ListingResponse();

        // Listing details
        response.setId(listing.getId());
        response.setTitle(listing.getTitle());
        response.setDescription(listing.getDescription());
        response.setPrice(listing.getPrice());
        response.setQuantity(listing.getQuantity());
        response.setCondition(listing.getCondition());
        response.setStatus(listing.getStatus());
        response.setLocation(listing.getLocation());
        response.setCreatedAt(listing.getCreatedAt());


        // Image URL
        if (listing.getId() != null) {

            response.setImageUrl(
                    "/api/listings/"
                            + listing.getId()
                            + "/image"
            );
        }


        // Seller information
        response.setSellerId(
                listing.getSeller().getId()
        );

        response.setSellerName(
                listing.getSeller().getName()
        );

        response.setSellerPhone(
                listing.getSeller().getPhone()
        );

        response.setSellerEmail(
                listing.getSeller().getEmail()
        );


        // Category information
        response.setCategoryId(
                listing.getCategory().getId()
        );

        response.setCategoryName(
                listing.getCategory().getName()
        );

        return response;
    }
}