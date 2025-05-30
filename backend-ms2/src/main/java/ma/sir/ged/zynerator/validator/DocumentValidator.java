package ma.sir.ged.zynerator.validator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = DocumentDtoValidator.class)
public @interface DocumentValidator {
    String message() default "Invalid DocumentDto";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
