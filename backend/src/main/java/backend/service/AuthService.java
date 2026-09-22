package backend.service;

import backend.dto.LoginRequest;
import backend.dto.RegisterRequest;
import backend.model.User;
import backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();

        user.setUserId(generateUserId());

        user.setName(request.getName());

        user.setEmail(request.getEmail());

        user.setDateOfBirth(
                request.getDateOfBirth()
        );

        user.setGender(
                request.getGender()
        );

        // Never store the plain-text password
        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        return userRepository.save(user);
    }

    public User login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"
                        )
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        return user;
    }

    private String generateUserId() {

        long userCount = userRepository.count();

        long nextNumber = userCount + 1;

        return String.format(
                "MED%03d",
                nextNumber
        );
    }
}