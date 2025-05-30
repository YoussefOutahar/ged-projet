package ma.sir.ged.ws.converter.BureauOrdre;

import ma.sir.ged.bean.core.bureauOrdre.Registre;
import ma.sir.ged.ws.dto.BureauOrdre.RegistreDto;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class RegistreConverter {

    public Registre toEntity(RegistreDto dto) {
        Registre entity = new Registre();
//        entity.setId(dto.getId());
        entity.setLibelle(dto.getLibelle());
        entity.setNumero(dto.getNumero());
        entity.setSize(dto.getSize());
        return entity;
    }

    public RegistreDto toDto(Registre entity) {

        RegistreDto dto = new RegistreDto();
        dto.setId(entity.getId());
        dto.setLibelle(entity.getLibelle());
        dto.setNumero(entity.getNumero());
        dto.setSize(entity.getSize());
        return dto;
    }

    public List<RegistreDto> toDtoList(List<Registre> entities) {
        return entities.stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<Registre> toEntityList(List<RegistreDto> dtos) {
        return dtos.stream().map(this::toEntity).collect(Collectors.toList());
    }

}
