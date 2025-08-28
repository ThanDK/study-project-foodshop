package in.thanadon.foodiesapi.controller;

import in.thanadon.foodiesapi.io.UserRequest;
import in.thanadon.foodiesapi.io.UserRespond;
import in.thanadon.foodiesapi.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserRespond register(@RequestBody UserRequest request) {
        return userService.registerUser(request);

    }
}
