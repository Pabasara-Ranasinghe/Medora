package backend.service;

import backend.model.User;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;

@Service
public class UserProfileService {

    public int calculateAge(User user) {

        if (user == null || user.getDateOfBirth() == null) {
            return 0;
        }

        LocalDate today = LocalDate.now();

        return Period.between(
                user.getDateOfBirth(),
                today
        ).getYears();
    }
}