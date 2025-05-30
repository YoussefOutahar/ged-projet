package ma.sir.ged.ws.facade.open;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

@RestController
@RequestMapping("/api/open/translation/")
public class TranslationWs {

    @Autowired
    private ResourceLoader resourceLoader;

    @GetMapping("/lang/{lang}")
    public ResponseEntity<String> getTranslation(@PathVariable String lang) {
        String path = "classpath:locales/" + lang + "/translation.json";
        // Load the resource from the classpath (resources folder)
        Resource resource = resourceLoader.getResource(path);

        // Read the content of the file
        byte[] contentBytes = new byte[0];
        try {
            contentBytes = Files.readAllBytes(resource.getFile().toPath());
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        String json = new String(contentBytes, StandardCharsets.UTF_8);
        return new ResponseEntity<>(json,HttpStatus.OK);
    }


}
