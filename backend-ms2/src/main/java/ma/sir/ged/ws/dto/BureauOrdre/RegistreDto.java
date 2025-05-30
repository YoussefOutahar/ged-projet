package ma.sir.ged.ws.dto.BureauOrdre;

import lombok.Data;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Data
public class RegistreDto implements Serializable {
    Long id;
    @NotNull(message = "libelle is null")
    @NotEmpty(message = "libelle is empty")
    String libelle;
    String numero;
    @Max(message = "registre plain", value = 200)
    int size;
}