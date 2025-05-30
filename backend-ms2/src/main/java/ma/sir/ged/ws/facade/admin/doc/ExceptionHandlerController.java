package ma.sir.ged.ws.facade.admin.doc;

import ma.sir.ged.service.exception.RessourceNotFoundException;
import ma.sir.ged.zynerator.exception.CustomValidationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class ExceptionHandlerController {

    @ExceptionHandler(RessourceNotFoundException.class)
    public ResponseEntity<String> handleEntityNotFoundException(RessourceNotFoundException ex) {
        // Customize the response message and status code here
        String errorMessage = "Bad Request: " + ex.getMessage();
        return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,String>> handleInvalidArgument(MethodArgumentNotValidException exception)
    {
        Map<String,String> errorMap=new HashMap<>();
        exception.getBindingResult().getFieldErrors().forEach(error->
        {
            errorMap.put(error.getField(),error.getDefaultMessage());
        });
        return new ResponseEntity<>(errorMap,HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(CustomValidationException.class)
    public ResponseEntity<Map<String,String>> handleValidationException(CustomValidationException ex) {
        return new ResponseEntity<>(ex.getErrors(),HttpStatus.BAD_REQUEST);
    }
}