package com.electroshare.dto.response;

import com.electroshare.entity.Role;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserResponse {

    private Long id;
    private String name;
    private String phone;
    private String email;
    private Role role;

}