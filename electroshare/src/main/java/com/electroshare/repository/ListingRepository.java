package com.electroshare.repository;

import com.electroshare.entity.Listing;
import com.electroshare.entity.ListingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ListingRepository
        extends JpaRepository<Listing, Long> {

    // Get available listings, newest first
    List<Listing> findByStatusOrderByCreatedAtDesc(
            ListingStatus status
    );
    List<Listing> findBySeller_EmailOrderByCreatedAtDesc(String email);


    @Query("""
        SELECT l FROM Listing l
        WHERE l.status = com.electroshare.entity.ListingStatus.AVAILABLE

        AND (
            :keyword IS NULL OR
            LOWER(l.title) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%'))
            OR
            LOWER(l.description) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%'))
        )

        AND (
            :categoryId IS NULL
            OR l.category.id = :categoryId
        )

        AND (
            :location IS NULL OR
            LOWER(l.location) LIKE LOWER(CONCAT('%', CAST(:location AS string), '%'))
        )

        AND (
            :minPrice IS NULL
            OR l.price >= :minPrice
        )

        AND (
            :maxPrice IS NULL
            OR l.price <= :maxPrice
        )

        ORDER BY l.createdAt DESC
        """)
    List<Listing> searchListings(
            @Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            @Param("location") String location,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice
    );
}