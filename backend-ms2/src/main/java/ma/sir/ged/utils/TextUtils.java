package ma.sir.ged.utils;

public class TextUtils {
    public static String convertToTitleCase(String input) {
        String[] words = input.toLowerCase().split("_");
        for (int i = 0; i < words.length; i++) {
            words[i] = words[i].substring(0, 1).toUpperCase() + words[i].substring(1);
        }
        return String.join(" ", words);
    }
}
