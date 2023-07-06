CREATE SEQUENCE IF NOT EXISTS my_sequence START 300000;



CREATE TABLE IF NOT EXISTS users (
  user_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  user_name TEXT  ,
  email TEXT ,
  password TEXT,
  focused_areas TEXT[],
  gender TEXT,
  device_id TEXT,
  block BOOLEAN DEFAULT false,
  height FLOAT ,
  weight FLOAT ,
  height_unit TEXT,
  weight_unit TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  trash BOOLEAN DEFAULT false,
  updated_at TIMESTAMP DEFAULT NOW(),
  subscribe_status BOOLEAN DEFAULT false
);




CREATE TABLE IF NOT EXISTS admins(
  admin_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  user_name TEXT,
  password TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  img  TEXT,
  trash BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);



CREATE TABLE IF NOT EXISTS otpStored(
  otp_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY ,
  email  TEXT ,
  otp TEXT ,
  trash BOOLEAN DEFAULT false
);


CREATE TABLE IF NOT EXISTS workout_categories(
  workout_category_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY ,
  category_name  TEXT ,
  trash BOOLEAN DEFAULT false
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
  time TEXT , 
  calories_burnt  FLOAT,
  trash BOOLEAN DEFAULT false,
  created_at TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exersises(
  exersise_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY ,
  title TEXT ,
  description TEXT,
  animation TEXT ,
  video_link TEXT ,
  trash BOOLEAN DEFAULT false,
  created_at TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workout_plan_exersises(
  workout_plan_exersise_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY ,
  exersise_id INTEGER,
  workout_plan_id INT, 
  reps TEXT,
  time TEXT,
  trash BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS liked_exersises_of_user(
  user_like_exersise_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY ,
  user_id INTEGER,
  exersise_id INTEGER,
  trash BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS user_likes_workouts(
  user_like_workout_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY ,
  user_id INTEGER,
  workout_plan_id INTEGER,
  trash BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_inActionWorkouts(
  user_inAction_workout_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY ,
  user_id INTEGER,
  workout_plan_id INTEGER,
  status TEXT,
  time TEXT,
  completed_at TEXT,
  trash BOOLEAN DEFAULT false,
  created_at TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);



CREATE TABLE IF NOT EXISTS countdowns(
  count_down_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY ,
  user_id INTEGER,
  time TEXT,
  trash BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rest_times(
  rest_time_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY ,
  user_id INTEGER,
  time TEXT,
  trash BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);



CREATE TABLE IF NOT EXISTS week_goals(
  week_goal_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY ,
  user_id INTEGER,
  no_of_days INTEGER,
  first_day_of_week INTEGER,
  trash BOOLEAN DEFAULT false,
  created_at TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS user_plans(
  workout_plan_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY ,
  user_id INTEGER,
  plan_name TEXT,
  description TEXT,
  status TEXT DEFAULT 'unpaid',
  trash BOOLEAN DEFAULT false,
  created_at TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS water_tracker(
  water_tracker_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  user_id INTEGER,
  measure TEXT ,
  measuring_unit TEXT,
  quantity INTEGER,
  trash BOOLEAN DEFAULT false,
  created_at TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS water_tracker_records(
  water_tracker_record_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  user_id INTEGER,
  water_tracker_id INTEGER,
  quantity INTEGER,
  trash BOOLEAN DEFAULT false,
  created_at TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS SevenByFourChallenge(
  seven_by_four_challenge_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  name TEXT,
  description TEXT,
  image TEXT,
  calories_burns FLOAT,
  time TEXT,
  trash BOOLEAN DEFAULT false,
  created_at TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS SevenByFourChallenge_weeks(
  week_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  seven_by_four_challenge_id INTEGER,
  week_no INTEGER,
  trash BOOLEAN DEFAULT false,
  created_at TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS SevenByFourChallenge_week_days(
  day_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  week_id INTEGER,
  seven_by_four_challenge_id INTEGER,
  plan_description TEXT,
  day INTEGER,
  trash BOOLEAN DEFAULT false,
  created_at TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS SevenByFourChallenge_week_day_exercises(
  SevenByFourChallenge_week_day_exercise_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  exersise_id INTEGER,
  SevenByFourChallenge_week_day_id INT, 
  reps TEXT,
  time TEXT,
  trash BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_inAction_sevByFour(
  user_inAction_sevByFour_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY ,
  user_id INTEGER,
  sev_by_fourChallenge_id INTEGER,
  week_id INTEGER,
  day_id INTEGER,
  status TEXT,
  time TEXT,
  completed_at TEXT,
  trash BOOLEAN DEFAULT false,
  created_at TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);



CREATE TABLE IF NOT EXISTS diet_plan(
  diet_plan_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  user_id INTEGER,
  gender TEXT,
  purpose TEXT,
  age INTEGER,
  height FLOAT,
  weight FLOAT,
  targetted_weight FLOAT,
  diet_budget TEXT,
  activity_status TEXT,
  trash BOOLEAN DEFAULT false,
  created_at TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS food(
  food_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  added_by TEXT, 
  added_by_id INTEGER,
  food_name TEXT,
  energy_calories TEXT,
  measure TEXT,
  units TEXT ,
  protein float,
  carbs float,
  fats float,
  monosaturated_fats float,
  saturated_fats float ,
  suger float,
  fiber float ,
  sodium float,
  calcium float,
  iron float,
  vitamin_A float,
  vitamin_b float ,
  vitamin_c float,
  cholestrol float ,
  trash BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS daily_food_intake(
  food_intake_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  user_id INTEGER,
  diet_plan_id INTEGER,
  meal_time TEXT,
  food_id INTEGER,
  quantity INTEGER,
  unit TEXT,
  trash BOOLEAN DEFAULT false,
  created_at TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS faqs(
  faq_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  question TEXT,
  answer TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_subscription(
  user_subscription_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  user_id INTEGER,
  subscription_status BOOLEAN ,
  add_removal_status BOOLEAN,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS feedbacks(
  feedback_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  user_id INTEGER,
  feedback TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workout_reviews(
  workout_review_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  user_id INTEGER,
  review TEXT,
  workout_plan_id INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_weight(
  workout_review_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  user_id INTEGER,
  weight FLOAT,
  weight_unit TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_height(
  height_review_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  user_id INTEGER,
  height FLOAT,
  height_unit TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reminder(
  reminder_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  user_id INTEGER,
  time TEXT,
  days TEXT[],
  active_status BOOLEAN ,
  trash BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS subscription(
  subscription_id INT NOT NULL DEFAULT nextval('my_sequence') PRIMARY KEY,
  user_id INTEGER,
  paid BOOLEAN DEFAULT true,
  amount FLOAT , 
  stripe_subscription_id TEXT,
  customer_Stripe_Id TEXT,
  currency TEXT,
  startingdate TEXT,
  enddate TEXT,
  trash BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

