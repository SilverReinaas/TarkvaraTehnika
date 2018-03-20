package ee.ttu.softtech.model;

import org.apache.tomcat.jni.Local;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

public class SetsByDate {
    private LocalDate date;
    private List<ExerciseSet> sets;

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public List<ExerciseSet> getSets() {
        return sets;
    }

    public void setSets(List<ExerciseSet> sets) {
        this.sets = sets;
    }

    public void addSet(ExerciseSet set) {
        sets.add(set);
    }

    public static LocalDate getDateFromSet(ExerciseSet set) throws ParseException{
        return set.getCreated().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

        /*
        SimpleDateFormat simpleDate = new SimpleDateFormat("dd/MM/yyyy");
        try {
            return simpleDate.parse(set.getCreated().toString()); // getting Date part from exerciseSet
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }
        */
    }

}
