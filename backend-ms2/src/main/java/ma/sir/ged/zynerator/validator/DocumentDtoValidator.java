package ma.sir.ged.zynerator.validator;

import ma.sir.ged.ws.dto.DocumentDto;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class DocumentDtoValidator implements ConstraintValidator<DocumentValidator, DocumentDto> {

    @Override
    public void initialize(DocumentValidator constraintAnnotation) {
    }

    @Override
    public boolean isValid(DocumentDto documentDto, ConstraintValidatorContext context) {

        if (documentDto == null) {
            return false;
        }
        if (documentDto.getReference() == null || documentDto.getReference().isEmpty()) {
            return false;
        }
        return true;
    }
}

