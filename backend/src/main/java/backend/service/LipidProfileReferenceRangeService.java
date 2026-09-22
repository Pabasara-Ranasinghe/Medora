package backend.service;

import org.springframework.stereotype.Service;

@Service
public class LipidProfileReferenceRangeService {

    public double[] getRange(
            String parameter,
            String gender
    ) {

        if (parameter == null) {
            return null;
        }

        switch (parameter.toLowerCase()) {

            case "totalcholesterol":
            case "total_cholesterol":
            case "total cholesterol":

                return new double[]{
                        0,
                        200
                };

            case "ldl":

                return new double[]{
                        0,
                        100
                };

            case "hdl":

                return getHDLRange(gender);

            case "triglycerides":

                return new double[]{
                        0,
                        150
                };

            case "vldl":

                return new double[]{
                        2,
                        30
                };

            case "cholesterolhdlratio":
            case "cholesterol_hdl_ratio":
            case "cholesterol/hdl ratio":

                return new double[]{
                        0,
                        5
                };

            default:
                return null;
        }
    }

    private double[] getHDLRange(String gender) {

        /*
         * HDL reference range is gender-dependent.
         */

        if ("MALE".equalsIgnoreCase(gender)) {

            return new double[]{
                    40,
                    Double.MAX_VALUE
            };
        }

        if ("FEMALE".equalsIgnoreCase(gender)) {

            return new double[]{
                    50,
                    Double.MAX_VALUE
            };
        }

        /*
         * Gender is required for HDL because
         * the reference range differs between
         * males and females.
         */
        return null;
    }
}
