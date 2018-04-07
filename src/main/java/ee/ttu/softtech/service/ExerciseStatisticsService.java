package ee.ttu.softtech.service;

import ee.ttu.softtech.model.ExerciseStatistics;

import java.util.Date;

public interface ExerciseStatisticsService {

    ExerciseStatistics getExerciseStatistics(Integer userId, Integer exerciseId, Date from);

}
