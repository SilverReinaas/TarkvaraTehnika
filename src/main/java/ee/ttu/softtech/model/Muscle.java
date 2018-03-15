package ee.ttu.softtech.model;

import javax.persistence.*;
import java.io.Serializable;

@Entity
public class Muscle {

    @Id
    private Integer id;
    private String muscleName;
    private Integer locationId;

    public Integer getLocationId() {
        return locationId;
    }

    public void setLocationId(Integer locationId) {
        this.locationId = locationId;
    }

    public String getMuscleName() {
        return muscleName;
    }

    public void setMuscleName(String muscleName) {
        this.muscleName = muscleName;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}