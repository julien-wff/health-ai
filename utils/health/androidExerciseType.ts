export const androidExerciseType = {
    EXERCISE_TYPE_BADMINTON: 2,
    EXERCISE_TYPE_BASEBALL: 4,
    EXERCISE_TYPE_BASKETBALL: 5,
    EXERCISE_TYPE_BIKING: 8,
    EXERCISE_TYPE_BIKING_STATIONARY: 9,
    EXERCISE_TYPE_BOOT_CAMP: 10,
    EXERCISE_TYPE_BOXING: 11,
    EXERCISE_TYPE_CALISTHENICS: 13,
    EXERCISE_TYPE_CRICKET: 14,
    EXERCISE_TYPE_DANCING: 16,
    EXERCISE_TYPE_ELLIPTICAL: 25,
    EXERCISE_TYPE_EXERCISE_CLASS: 26,
    EXERCISE_TYPE_FENCING: 27,
    EXERCISE_TYPE_FOOTBALL_AMERICAN: 28,
    EXERCISE_TYPE_FOOTBALL_AUSTRALIAN: 29,
    EXERCISE_TYPE_GUIDED_BREATHING: 33,
    EXERCISE_TYPE_FRISBEE_DISC: 31,
    EXERCISE_TYPE_GOLF: 32,
    EXERCISE_TYPE_GYMNASTICS: 34,
    EXERCISE_TYPE_HANDBALL: 35,
    EXERCISE_TYPE_HIGH_INTENSITY_INTERVAL_TRAINING: 36,
    EXERCISE_TYPE_HIKING: 37,
    EXERCISE_TYPE_ICE_HOCKEY: 38,
    EXERCISE_TYPE_ICE_SKATING: 39,
    EXERCISE_TYPE_MARTIAL_ARTS: 44,
    EXERCISE_TYPE_OTHER_WORKOUT: 0,
    EXERCISE_TYPE_PADDLING: 46,
    EXERCISE_TYPE_PARAGLIDING: 47,
    EXERCISE_TYPE_PILATES: 48,
    EXERCISE_TYPE_RACQUETBALL: 50,
    EXERCISE_TYPE_ROCK_CLIMBING: 51,
    EXERCISE_TYPE_ROLLER_HOCKEY: 52,
    EXERCISE_TYPE_ROWING: 53,
    EXERCISE_TYPE_ROWING_MACHINE: 54,
    EXERCISE_TYPE_RUGBY: 55,
    EXERCISE_TYPE_RUNNING: 56,
    EXERCISE_TYPE_RUNNING_TREADMILL: 57,
    EXERCISE_TYPE_SAILING: 58,
    EXERCISE_TYPE_SCUBA_DIVING: 59,
    EXERCISE_TYPE_SKATING: 60,
    EXERCISE_TYPE_SKIING: 61,
    EXERCISE_TYPE_SNOWBOARDING: 62,
    EXERCISE_TYPE_SNOWSHOEING: 63,
    EXERCISE_TYPE_SOCCER: 64,
    EXERCISE_TYPE_SOFTBALL: 65,
    EXERCISE_TYPE_SQUASH: 66,
    EXERCISE_TYPE_STAIR_CLIMBING: 68,
    EXERCISE_TYPE_STAIR_CLIMBING_MACHINE: 69,
    EXERCISE_TYPE_STRENGTH_TRAINING: 70,
    EXERCISE_TYPE_STRETCHING: 71,
    EXERCISE_TYPE_SURFING: 72,
    EXERCISE_TYPE_SWIMMING_OPEN_WATER: 73,
    EXERCISE_TYPE_SWIMMING_POOL: 74,
    EXERCISE_TYPE_TABLE_TENNIS: 75,
    EXERCISE_TYPE_TENNIS: 76,
    EXERCISE_TYPE_VOLLEYBALL: 78,
    EXERCISE_TYPE_WALKING: 79,
    EXERCISE_TYPE_WATER_POLO: 80,
    EXERCISE_TYPE_WEIGHTLIFTING: 81,
    EXERCISE_TYPE_WHEELCHAIR: 82,
    EXERCISE_TYPE_YOGA: 83,
} as const;


export function numberToExerciseType(n: number): keyof typeof androidExerciseType {
    return Object
        .entries(androidExerciseType)
        .find(([ , value ]) => value === n)?.[0] as keyof typeof androidExerciseType;
}
