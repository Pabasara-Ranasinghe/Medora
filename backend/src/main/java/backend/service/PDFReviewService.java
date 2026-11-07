
package backend.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class PDFReviewService {

    public String extractText(MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Please upload a PDF file.");
        }

        if (!"application/pdf".equalsIgnoreCase(file.getContentType())) {
            throw new IllegalArgumentException("Only PDF files are supported.");
        }

        try (PDDocument document = Loader.loadPDF(file.getBytes())) {

            if (document.isEncrypted()) {
                throw new IllegalArgumentException(
                        "Password-protected PDFs are not supported."
                );
            }

            PDFTextStripper stripper = new PDFTextStripper();

            String extractedText = stripper.getText(document).trim();

            if (extractedText.isBlank()) {
                throw new IllegalArgumentException(
                        "No readable text found. This may be a scanned PDF."
                );
            }

            return extractedText;
        }
    }
}
