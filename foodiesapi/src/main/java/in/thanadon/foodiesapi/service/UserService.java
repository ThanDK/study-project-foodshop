package in.thanadon.foodiesapi.service;

import in.thanadon.foodiesapi.io.UserRequest;
import in.thanadon.foodiesapi.io.UserRespond;

public interface UserService {

    UserRespond registerUser(UserRequest user);

    String findByUserId();
}
