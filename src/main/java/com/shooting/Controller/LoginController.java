package com.shooting.Controller;

import com.shooting.Model.User;
import com.shooting.Service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class LoginController {

    private final UserService userService;

    @Autowired
    public LoginController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Username user) {

        String providedUsername = user.getUserName().trim(); // Trim leading and trailing whitespaces
        System.out.println("Received login request: username=" + providedUsername + ", password=" + user.getPassword());

        User foundUser = userService.findUserByUsername(providedUsername);
        System.out.println("User found in database: " + foundUser);

        foundUser = userService.findUserByUsername(user.getUserName());
        if (foundUser != null) {
            if (foundUser.getPassword().equals(user.getPassword())) {
                return ResponseEntity.ok("Login successful!");
            } else {
                return ResponseEntity.badRequest().body("Invalid password.");
            }
        } else {
            return ResponseEntity.badRequest().body("User not found.");
        }
    }
}
