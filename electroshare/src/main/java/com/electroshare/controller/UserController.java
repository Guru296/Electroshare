package com.electroshare.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @GetMapping("/api/user/test")
    public String userTest() {
        return "USER access granted!";
    }
}