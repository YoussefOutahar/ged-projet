package ma.sir.ged.zynerator.validator;

import ma.sir.ged.zynerator.exception.CustomValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintViolation;
import javax.validation.Validator;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Component
public class CustomValidator<T> {

    @Autowired
    private Validator validator;

    public void validate(T classToValidate) {
        Set<ConstraintViolation<T>> violations = validator.validate(classToValidate);

        if (!violations.isEmpty()) {
            Map<String, String> errorMap = new HashMap<>();
            violations.forEach(violation -> {
                // Populate the errorMap only if the key doesn't already exist
                errorMap.putIfAbsent(violation.getPropertyPath().toString(), violation.getMessage());
            });
            throw new CustomValidationException(errorMap);
        }
    }


}

