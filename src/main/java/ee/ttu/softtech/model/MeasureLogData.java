package ee.ttu.softtech.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;

public class MeasureLogData {
    private Integer exerciseId;
    private String logDate = (new Date()).toString();
    private ArrayList<UnitType> unitTypes;
    private ArrayList<Float> values;


    public Integer getExerciseId() {
        return exerciseId;
    }

    public void setExerciseId(Integer exerciseId) {
        this.exerciseId = exerciseId;
    }

    public ArrayList<UnitType> getUnitTypes() {
        return unitTypes;
    }

    public void setUnitTypes(ArrayList<UnitType> unitTypes) {
        this.unitTypes = unitTypes;
    }

    public ArrayList<Float> getValues() {
        return values;
    }

    public void setValues(ArrayList<Float> values) {
        this.values = values;
    }

    public String getLogDate() {
        return logDate;
    }

    public void setLogDate(String logDate) {
        this.logDate = logDate;
    }
}
