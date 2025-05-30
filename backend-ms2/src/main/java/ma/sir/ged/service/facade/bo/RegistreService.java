package ma.sir.ged.service.facade.bo;

import lombok.RequiredArgsConstructor;
import ma.sir.ged.bean.core.bureauOrdre.Registre;
import ma.sir.ged.dao.facade.core.bureauOrdre.RegistreRepository;
import ma.sir.ged.ws.converter.BureauOrdre.RegistreConverter;
import ma.sir.ged.ws.dto.BureauOrdre.RegistreDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RegistreService {

    private final RegistreRepository registreRepository;
    private final RegistreConverter registreConverter;


    public List<RegistreDto> getAllRegistres() {
        return registreConverter.toDtoList(registreRepository.findAll());
    }


    public RegistreDto create(RegistreDto registreDto) {
        return registreConverter.toDto(registreRepository.save(registreConverter.toEntity(registreDto)));
    }

    public RegistreDto update(RegistreDto registreDto) {

        Registre registre = registreConverter.toEntity(registreDto);
        registre.setId(registreDto.getId());

        return registreConverter.toDto(registreRepository.save(registre));
    }


    public Registre update(Registre registre) {
        return registreRepository.save(registre);
    }

    public void deleteRegistre(Long id) {
        try{
            registreRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("RegistreService: Delete fail | Registre not found");
        }
    }
}
