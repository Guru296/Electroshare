package com.electroshare.mapper;

import com.electroshare.dto.request.RegisterRequest;
import com.electroshare.dto.response.UserResponse;
import com.electroshare.entity.AppUser;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(AppUser user) {

        UserResponse response = new UserResponse();

        response.setId(user.getId());
        response.setName(user.getName());
        response.setPhone(user.getPhone());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());

        return response;
    }

    public AppUser toEntity(RegisterRequest request) {

        AppUser user = new AppUser();

        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        return user;
    }
}