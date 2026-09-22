package backend.controller;

import backend.dto.UserProfileResponse;
import backend.model.User;
import backend.repository.UserRepository;
import backend.service.UserProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5177")
public class UserProfileController {

    private final UserRepository userRepository;
    private final UserProfileService userProfileService;

    public UserProfileController(
            UserRepository userRepository,
            UserProfileService userProfileService) {

        this.userRepository = userRepository;
        this.userProfileService = userProfileService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfile(
            @PathVariable String userId) {

        try {

            User user = userRepository
                    .findById(userId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "User not found"
                            )
                    );

            int age =
                    userProfileService.calculateAge(user);

            UserProfileResponse response =
                    new UserProfileResponse(
                            user.getUserId(),
                            user.getName(),
                            user.getEmail(),
                            user.getDateOfBirth(),
                            user.getGender(),
                            age
                    );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}