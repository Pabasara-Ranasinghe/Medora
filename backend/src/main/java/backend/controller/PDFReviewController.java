
package backend.controller;

import backend.service.PDFReviewService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/pdf-review")
public class PDFReviewController {

    private final PDFReviewService pdfReviewService;

    public PDFReviewController(PDFReviewService pdfReviewService) {
        this.pdfReviewService = pdfReviewService;
    }

    @PostMapping(
            value = "/extract",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> extractPDF(
            @RequestParam("file") MultipartFile file) {

        try {
            String extractedText =
                    pdfReviewService.extractText(file);

            return ResponseEntity.ok(
                    Map.of(
                            "message", "PDF text extracted successfully.",
                            "extractedText", extractedText
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );

        } catch (IOException e) {

            return ResponseEntity.internalServerError().body(
                    Map.of("message", "Unable to read the uploaded PDF.")
            );
        }
    }
}
