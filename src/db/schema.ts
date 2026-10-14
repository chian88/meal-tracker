import { defineRelations } from "drizzle-orm";
import { pgTable, real, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const meals = pgTable("meals", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  eatenAt: timestamp("eaten_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const foodItems = pgTable("food_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  calories: real("calories").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const mealFoodItems = pgTable("meal_food_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  mealId: uuid("meal_id")
    .notNull()
    .references(() => meals.id, { onDelete: "cascade" }),
  foodItemId: uuid("food_item_id")
    .notNull()
    .references(() => foodItems.id, { onDelete: "restrict" }),
  quantity: real("quantity").notNull().default(1),
});

export const relations = defineRelations(
  { meals, foodItems, mealFoodItems },
  (r) => ({
    meals: {
      mealFoodItems: r.many.mealFoodItems({
        from: r.meals.id,
        to: r.mealFoodItems.mealId,
      }),
    },
    foodItems: {
      mealFoodItems: r.many.mealFoodItems({
        from: r.foodItems.id,
        to: r.mealFoodItems.foodItemId,
      }),
    },
    mealFoodItems: {
      meal: r.one.meals({
        from: r.mealFoodItems.mealId,
        to: r.meals.id,
        optional: false,
      }),
      foodItem: r.one.foodItems({
        from: r.mealFoodItems.foodItemId,
        to: r.foodItems.id,
        optional: false,
      }),
    },
  }),
);

export type Meal = typeof meals.$inferSelect;
export type NewMeal = typeof meals.$inferInsert;
export type FoodItem = typeof foodItems.$inferSelect;
export type NewFoodItem = typeof foodItems.$inferInsert;
export type MealFoodItem = typeof mealFoodItems.$inferSelect;
export type NewMealFoodItem = typeof mealFoodItems.$inferInsert;
