package backend.service;

import org.springframework.stereotype.Service;

@Service
public class BloodGlucoseReferenceRangeService {

    public double[] getRange(String testType) {

        if (testType == null) {
            return null;
        }

        switch (testType.toLowerCase()) {

            case "fasting":
                return new double[]{
                        70.0,
                        99.0
                };

            case "random":
                return new double[]{
                        70.0,
                        140.0
                };

            case "post-meal":
                return new double[]{
                        70.0,
                        140.0
                };

            default:
                return null;
        }
    }
}
