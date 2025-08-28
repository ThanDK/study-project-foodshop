package in.thanadon.foodiesapi.service;

import in.thanadon.foodiesapi.entity.UserEnitity;
import in.thanadon.foodiesapi.io.UserRequest;
import in.thanadon.foodiesapi.io.UserRespond;
import in.thanadon.foodiesapi.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private  final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationFacade authenticationFacade;

    @Override
    public UserRespond registerUser(UserRequest request) {
        UserEnitity newUser = convertToEnitity(request);
        newUser = userRepository.save(newUser);
        return convertToRespond(newUser);
    }

    @Override
    public String findByUserId() {
        String loggedInUserEmail = authenticationFacade.getAuthentication().getName();
        UserEnitity loggedInUser = userRepository.findByEmail(loggedInUserEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return loggedInUser.getId();
    }

    private UserEnitity convertToEnitity(UserRequest request) {
        return UserEnitity.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .build();
    }

    private UserRespond convertToRespond(UserEnitity registeredUser) {
        return UserRespond.builder()
                .id(registeredUser.getId())
                .name(registeredUser.getName())
                .email(registeredUser.getEmail())
                .build();
    }
}
