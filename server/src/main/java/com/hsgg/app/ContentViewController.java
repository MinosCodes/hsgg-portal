package com.hsgg.app;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Controller
public class ContentViewController {

    @GetMapping("/view-content")
    public String viewContent(@RequestParam String file, Model model) {
        try {
            Path filePath = Paths.get("../client/content/" + file);
            
            if (!Files.exists(filePath)) {
                return "error";
            }
            
            String content = Files.readString(filePath);
            model.addAttribute("content", content);
            
            return "inline-view";
        } catch (Exception e) {
            return "error";
        }
    }
}
