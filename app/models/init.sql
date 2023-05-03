CREATE SEQUENCE IF NOT EXISTS my_sequence START 3000000;

CREATE TABLE IF NOT EXISTS users (
  user_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  user_name TEXT  ,
  email TEXT ,
  password TEXT,
  focused_areas TEXT[],
  gender TEXT,
  device_id TEXT,
  block BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS otpStored(
  otp_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY ,
  email  TEXT ,
  otp TEXT 
);


CREATE TABLE IF NOT EXISTS workout_categories(
  workout_category_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY ,
  category_name  TEXT ,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS workout_plans(
  workout_plan_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY ,
  category_id  INTEGER ,
  workout_title TEXT,
  description TEXT ,
  image TEXT, 
  focus_area TEXT[],
  paid_status BOOLEAN ,
  level_of_workout TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workoutPlanExersises(
  workout_plan_exersise_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY ,
  title TEXT ,
  description TEXT,
  animation TEXT ,
  video_link TEXT ,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS metric_imperial_units(
  units_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY ,
  user_id INTEGER,
  weight INTEGER,
  weight_unit TEXT,
  height INTEGER,
  height_unit TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_likes_workouts(
  user_like_workout_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY ,
  user_id INTEGER,
  workout_plan_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_inActionWorkouts(
  user_inAction_workout_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY ,
  user_id INTEGER,
  workout_plan_id INTEGER,
  status TEXT,
  completed_at TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS countdowns(
  count_down_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY ,
  user_id INTEGER,
  time TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rest_times(
  rest_time_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY ,
  user_id INTEGER,
  time TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
