package com.electroshare.service;

import com.electroshare.dto.request.LoginRequest;
import com.electroshare.dto.request.RegisterRequest;
import com.electroshare.dto.response.UserResponse;
import com.electroshare.entity.AppUser;
import com.electroshare.entity.Role;
import com.electroshare.mapper.UserMapper;
import com.electroshare.repository.AppUserRepository;
import com.electroshare.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserMapper userMapper;

    public AuthService(AppUserRepository appUserRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                        JwtService jwtService,
                       UserMapper userMapper
    ) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userMapper = userMapper;
    }



    public UserResponse register(RegisterRequest request) {

        AppUser user = userMapper.toEntity(request);

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        user.setRole(Role.USER);

        AppUser savedUser = appUserRepository.save(user);

        return userMapper.toResponse(savedUser);
    }

    public String login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        return jwtService.generateToken(request.getEmail());
    }
}