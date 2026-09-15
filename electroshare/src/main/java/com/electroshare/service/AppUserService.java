package com.electroshare.service;

import com.electroshare.entity.AppUser;
import com.electroshare.repository.AppUserRepository;
import org.springframework.stereotype.Service;

@Service
public class AppUserService {

    private final AppUserRepository appUserRepository;

    public AppUserService(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    public AppUser saveUser(AppUser user) {
        return appUserRepository.save(user);
    }
}