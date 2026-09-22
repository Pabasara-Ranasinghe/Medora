package backend.service;

import org.springframework.stereotype.Service;

@Service
public class CBCReferenceRangeService {

    public double[] getRange(
            String parameter,
            int age,
            String gender
    ) {

        if (parameter == null) {
            return null;
        }

        String ageGroup = getAgeGroup(age);

        switch (parameter.toLowerCase()) {

            case "hemoglobin":
                return getHemoglobinRange(ageGroup, gender);

            case "hematocrit":
                return getHematocritRange(ageGroup, gender);

            case "rbc":
                return getRBCRange(ageGroup, gender);

            case "wbc":
                return getWBCRange(ageGroup);

            case "platelets":
                return new double[]{150000, 450000};

            case "mcv":
                return new double[]{80, 100};

            case "mch":
                return new double[]{27, 33};

            case "mchc":
                return new double[]{32, 36};

            case "rdw":
                return new double[]{11.5, 14.5};

            case "neutrophils":
                return new double[]{40, 75};

            case "lymphocytes":
                return new double[]{20, 45};

            case "monocytes":
                return new double[]{2, 10};

            case "eosinophils":
                return new double[]{1, 6};

            case "basophils":
                return new double[]{0, 1};

            case "esr":
                return getESRRange(gender);

            default:
                return null;
        }
    }

    /*
     * Determine age group.
     */
    private String getAgeGroup(int age) {

        if (age < 1) {
            return "INFANT";

        } else if (age < 12) {
            return "CHILD";

        } else if (age < 18) {
            return "ADOLESCENT";

        } else if (age < 65) {
            return "ADULT";

        } else {
            return "ELDERLY";
        }
    }

    /*
     * Hemoglobin
     *
     * Gender is important for adolescent,
     * adult and elderly ranges.
     */
    private double[] getHemoglobinRange(
            String ageGroup,
            String gender
    ) {

        switch (ageGroup) {

            case "INFANT":
                return new double[]{9.5, 14.0};

            case "CHILD":
                return new double[]{11.0, 15.5};

            case "ADOLESCENT":

                if ("MALE".equalsIgnoreCase(gender)) {
                    return new double[]{13.0, 16.0};
                }

                if ("FEMALE".equalsIgnoreCase(gender)) {
                    return new double[]{12.0, 15.5};
                }

                return null;

            case "ADULT":

                if ("MALE".equalsIgnoreCase(gender)) {
                    return new double[]{13.5, 17.5};
                }

                if ("FEMALE".equalsIgnoreCase(gender)) {
                    return new double[]{12.0, 15.5};
                }

                return null;

            case "ELDERLY":

                if ("MALE".equalsIgnoreCase(gender)) {
                    return new double[]{12.4, 14.9};
                }

                if ("FEMALE".equalsIgnoreCase(gender)) {
                    return new double[]{11.7, 13.8};
                }

                return null;

            default:
                return null;
        }
    }

    /*
     * Hematocrit
     */
    private double[] getHematocritRange(
            String ageGroup,
            String gender
    ) {

        if ("ADULT".equals(ageGroup)) {

            if ("MALE".equalsIgnoreCase(gender)) {
                return new double[]{41, 53};
            }

            if ("FEMALE".equalsIgnoreCase(gender)) {
                return new double[]{36, 46};
            }

            return null;
        }

        if ("ELDERLY".equals(ageGroup)) {

            if ("MALE".equalsIgnoreCase(gender)) {
                return new double[]{37, 47};
            }

            if ("FEMALE".equalsIgnoreCase(gender)) {
                return new double[]{35, 45};
            }

            return null;
        }

        /*
         * Same range for children and adolescents
         * in this simplified Medora implementation.
         */
        return new double[]{36, 46};
    }

    /*
     * RBC count
     */
    private double[] getRBCRange(
            String ageGroup,
            String gender
    ) {

        if ("ADULT".equals(ageGroup)) {

            if ("MALE".equalsIgnoreCase(gender)) {
                return new double[]{4.5, 5.9};
            }

            if ("FEMALE".equalsIgnoreCase(gender)) {
                return new double[]{4.1, 5.1};
            }

            return null;
        }

        /*
         * Age-specific RBC ranges can be added here
         * when we expand the pediatric CBC ranges.
         */
        return null;
    }

    /*
     * WBC count
     *
     * Gender is not required.
     */
    private double[] getWBCRange(String ageGroup) {

        switch (ageGroup) {

            case "INFANT":
                return new double[]{6000, 17500};

            case "CHILD":
                return new double[]{5000, 13000};

            case "ADOLESCENT":
            case "ADULT":
            case "ELDERLY":
                return new double[]{4500, 11000};

            default:
                return null;
        }
    }

    /*
     * ESR
     *
     * Gender is required.
     */
    private double[] getESRRange(String gender) {

        if ("MALE".equalsIgnoreCase(gender)) {
            return new double[]{0, 15};
        }

        if ("FEMALE".equalsIgnoreCase(gender)) {
            return new double[]{0, 20};
        }

        return null;
    }
}