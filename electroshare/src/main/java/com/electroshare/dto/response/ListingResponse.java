package com.electroshare.dto.response;

import com.electroshare.entity.ListingCondition;
import com.electroshare.entity.ListingStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ListingResponse {

    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private Integer quantity;
    private ListingCondition condition;
    private ListingStatus status;
    private String location;
    private String imageUrl;
    private LocalDateTime createdAt;

    private Long sellerId;
    private String sellerName;
    private String sellerPhone;
    private String sellerEmail;

    private Long categoryId;
    private String categoryName;
}