/*
Add additional items for the itemLibrary in this format:
e.g.
{
  // Category level
  key: 'vegetables',                          // Lowercase, no spaces, if two words can use a dash like 'sweet-potatoes'
  name: 'Vegetables',                         // Name of category
  image: '/images/categories/vegetables.jpg', // Optional, image file must live in public/images/foods directory
  fallbackIcon: '🥬',                         // Used in case of no image
  data: [
    {
      // Item level  
      id: 'artichoke',                        // Lowercase, no spaces, if two words can use a dash like 'sweet-potatoes'
      item: 'Artichoke',                      // Used for alt text
      name: 'Artichoke',                      // Display name
      image: '/images/foods/artichoke.jpg',   // Optional, image file must live in public/images/foods directory
      fallbackIcon: '🥬',                     // Used in case of no image
      peakTime: 1.0,                          // How long (in hours) it takes for a food to reach its maximum blood glucose impact (ask AI)
      peakValue: 135,                         // Peak glucose level of item (ask AI)
      description: '...'                      // Educational text about the item
    }
  ]
}
*/
export const itemLibrary = [
  {
    item: "Artichoke",
    category: "vegetable",
    serving_size: "1 medium",
    glucose_change: 8,
    educational_text: "Artichokes have moderate fiber and carbs, causing minimal glucose rise in diabetes.",
    image: "/images/foods/artichoke.jpg",
    fallbackIcon: "🥬"
  },
  {
    item: "Arugula",
    category: "vegetable",
    serving_size: "2 cups raw",
    glucose_change: 2,
    educational_text: "Leafy greens like arugula have almost no carbs, keeping glucose stable.",
    image: "/images/foods/arugula.jpg",
    fallbackIcon: "🥬"
  },
  {
    item: "Asparagus",
    category: "vegetable",
    serving_size: "1 cup cooked",
    glucose_change: 5,
    educational_text: "Asparagus is low in carbs with good fiber, causing minimal glucose impact.",
    image: "/images/foods/asparagus.jpg",
    fallbackIcon: "🥦"
  },
  {
    item: "Avocado",
    category: "healthy-fat",
    serving_size: "1/2 avocado",
    glucose_change: 3,
    educational_text: "Avocados are mostly healthy fats with very few carbs, barely affecting glucose.",
    image: "/images/foods/avocado.jpg",
    fallbackIcon: "🥑"
  },
  {
    item: "Bacon",
    category: "processed-meat",
    serving_size: "3 strips",
    glucose_change: 5,
    educational_text: "Bacon's high fat content minimizes glucose impact, though cured meats may affect insulin sensitivity.",
    image: "/images/foods/bacon.jpg",
    fallbackIcon: "🥓"
  },
  {
    item: "Bagel",
    category: "refined-grain",
    serving_size: "1/2 bagel",
    glucose_change: 45,
    educational_text: "Bagels are dense in refined carbs, causing significant glucose spikes.",
    image: "/images/foods/bagel.jpg",
    fallbackIcon: "🥯"
  },
  {
    item: "Barley",
    category: "grain",
    serving_size: "1/2 cup cooked",
    glucose_change: 28,
    educational_text: "Barley's beta-glucan fiber helps moderate glucose rise compared to other grains.",
    image: "/images/foods/barley.jpg",
    fallbackIcon: "🌾"
  },
  {
    item: "Bean sprouts",
    category: "vegetable",
    serving_size: "1 cup raw",
    glucose_change: 4,
    educational_text: "Bean sprouts are very low carb, having negligible effect on blood glucose.",
    image: "/images/foods/bean-sprouts.jpg",
    fallbackIcon: "🌱"
  },
  {
    item: "Beans",
    category: "legume",
    serving_size: "1/2 cup cooked",
    glucose_change: 20,
    educational_text: "Beans have protein and fiber but still contain significant carbs, raising glucose 20-30 mg/dL.",
    image: "/images/foods/beans.jpg",
    fallbackIcon: "🫘"
  },
  {
    item: "Beef",
    category: "meat",
    serving_size: "4 oz lean",
    glucose_change: 15,
    educational_text: "Red meat protein can raise glucose more than poultry in some people with diabetes, especially if insulin resistant.",
    image: "/images/foods/beef.jpg",
    fallbackIcon: "🥩"
  },
  {
    item: "Beets",
    category: "vegetable",
    serving_size: "1/2 cup cooked",
    glucose_change: 15,
    educational_text: "Beets contain natural sugars, potentially raising glucose 15-20 mg/dL in diabetes.",
    image: "/images/foods/beets.jpg",
    fallbackIcon: "🟣"
  },
  {
    item: "Bok choy",
    category: "vegetable",
    serving_size: "1 cup cooked",
    glucose_change: 3,
    educational_text: "Bok choy is very low in carbs, ideal for stable blood glucose levels.",
    image: "/images/foods/bok-choy.jpg",
    fallbackIcon: "🥬"
  },
  {
    item: "Broccoli",
    category: "vegetable",
    serving_size: "1 cup cooked",
    glucose_change: 6,
    educational_text: "Broccoli's high fiber content helps minimize any glucose rise from its few carbs.",
    image: "/images/foods/broccoli.jpg",
    fallbackIcon: "🥦"
  },
  {
    item: "Brown Rice",
    category: "grain",
    serving_size: "1/2 cup cooked",
    glucose_change: 35,
    educational_text: "Brown rice has fiber but still contains significant carbs, raising glucose 35-45 mg/dL in diabetes.",
    image: "/images/foods/brown-rice.jpg",
    fallbackIcon: "🟤"
  },
  {
    item: "Brussels sprouts",
    category: "vegetable",
    serving_size: "1 cup cooked",
    glucose_change: 8,
    educational_text: "Brussels sprouts have moderate carbs with good fiber, causing mild glucose elevation.",
    image: "/images/foods/brussels-sprouts.jpg",
    fallbackIcon: "🥦"
  },
  {
    item: "Buckwheat",
    category: "grain",
    serving_size: "1/2 cup cooked",
    glucose_change: 25,
    educational_text: "Buckwheat has a lower glycemic impact than wheat, raising glucose 25-35 mg/dL.",
    image: "/images/foods/buckwheat.jpg",
    fallbackIcon: "🟤"
  },
  {
    item: "Buffalo",
    category: "meat",
    serving_size: "4 oz grilled",
    glucose_change: 12,
    educational_text: "Very lean buffalo meat may cause a moderate glucose rise as protein converts to glucose over several hours.",
    image: "/images/foods/buffalo.jpg",
    fallbackIcon: "🦬"
  },
  {
    item: "Butter",
    category: "fat",
    serving_size: "1 tbsp",
    glucose_change: 1,
    educational_text: "Butter is nearly pure fat with trace lactose, minimal glucose impact.",
    image: "/images/foods/butter.jpg",
    fallbackIcon: "🧈"
  },
  {
    item: "Cabbage",
    category: "vegetable",
    serving_size: "1 cup cooked",
    glucose_change: 5,
    educational_text: "Cabbage is low-carb and high-fiber, having minimal impact on blood sugar.",
    image: "/images/foods/cabbage.jpg",
    fallbackIcon: "🥬"
  },
  {
    item: "Cake",
    category: "sweets",
    serving_size: "1 slice",
    glucose_change: 60,
    educational_text: "Cake's high sugar and refined flour content spikes glucose 60-80 mg/dL.",
    image: "/images/foods/cake.jpg",
    fallbackIcon: "🍰"
  },
  {
    item: "Canned meat/fish in oil",
    category: "processed-meat",
    serving_size: "1 can",
    glucose_change: 8,
    educational_text: "Oil-packed canned meats have minimal glucose impact, with fat slowing any protein effects.",
    image: "/images/foods/canned-fish-oil.jpg",
    fallbackIcon: "🐟"
  },
  {
    item: "Carrots",
    category: "vegetable",
    serving_size: "1/2 cup cooked",
    glucose_change: 10,
    educational_text: "Cooked carrots have moderate natural sugars, raising glucose 10-15 mg/dL.",
    image: "/images/foods/carrots.jpg",
    fallbackIcon: "🥕"
  },
  {
    item: "Cassava",
    category: "starchy-vegetable",
    serving_size: "1/2 cup cooked",
    glucose_change: 45,
    educational_text: "Cassava is very high in starch, causing significant glucose spikes in diabetes.",
    image: "/images/foods/cassava.jpg",
    fallbackIcon: "🥔"
  },
  {
    item: "Cauliflower",
    category: "vegetable",
    serving_size: "1 cup cooked",
    glucose_change: 5,
    educational_text: "Cauliflower is very low-carb, making it excellent for glucose control.",
    image: "/images/foods/cauliflower.jpg",
    fallbackIcon: "🥦"
  },
  {
    item: "Celery",
    category: "vegetable",
    serving_size: "1 cup raw",
    glucose_change: 2,
    educational_text: "Celery is mostly water and fiber with minimal carbs, barely affecting glucose.",
    image: "/images/foods/celery.jpg",
    fallbackIcon: "🥬"
  },
  {
    item: "Chayote",
    category: "vegetable",
    serving_size: "1 cup cooked",
    glucose_change: 6,
    educational_text: "Chayote squash is low in carbs with good fiber, causing minimal glucose rise.",
    image: "/images/foods/chayote.jpg",
    fallbackIcon: "🥒"
  },
  {
    item: "Chicken",
    category: "meat",
    serving_size: "4 oz grilled",
    glucose_change: 10,
    educational_text: "While chicken has no carbs, protein can convert to glucose slowly through gluconeogenesis, causing a mild rise in people with diabetes.",
    image: "/images/foods/chicken.jpg",
    fallbackIcon: "🍗"
  },
  {
    item: "Chickpeas",
    category: "legume",
    serving_size: "1/2 cup cooked",
    glucose_change: 25,
    educational_text: "Chickpeas are higher in carbs than other legumes, raising glucose 25-35 mg/dL.",
    image: "/images/foods/chickpeas.jpg",
    fallbackIcon: "🟤"
  },
  {
    item: "Chips",
    category: "snack",
    serving_size: "1 oz",
    glucose_change: 25,
    educational_text: "Potato chips' starch and processing cause glucose rise of 25-35 mg/dL.",
    image: "/images/foods/chips.jpg",
    fallbackIcon: "🥔"
  },
  {
    item: "Collard greens",
    category: "vegetable",
    serving_size: "1 cup cooked",
    glucose_change: 4,
    educational_text: "Leafy collards are very low in carbs, excellent for blood sugar management.",
    image: "/images/foods/collard-greens.jpg",
    fallbackIcon: "🥬"
  },
  {
    item: "Cookie",
    category: "sweets",
    serving_size: "2 cookies",
    glucose_change: 35,
    educational_text: "Cookies combine sugar, refined flour, and fat, spiking glucose significantly.",
    image: "/images/foods/cookie.jpg",
    fallbackIcon: "🍪"
  },
  {
    item: "Cooking Spray",
    category: "healthy-fat",
    serving_size: "1 second spray",
    glucose_change: 0,
    educational_text: "Cooking sprays are pure fat in minimal amounts, no glucose effect.",
    image: "/images/foods/cooking-spray.jpg",
    fallbackIcon: "🍳"
  },
  {
    item: "Corn",
    category: "starchy-vegetable",
    serving_size: "1/2 cup kernels",
    glucose_change: 25,
    educational_text: "Corn is high in starch and natural sugars, raising glucose 25-35 mg/dL in diabetes.",
    image: "/images/foods/corn.jpg",
    fallbackIcon: "🌽"
  },
  {
    item: "Corned beef",
    category: "processed-meat",
    serving_size: "4 oz",
    glucose_change: 10,
    educational_text: "Cured beef contains some sugar from processing, causing mild glucose elevation in diabetes.",
    image: "/images/foods/corned-beef.jpg",
    fallbackIcon: "🥩"
  },
  {
    item: "Cottage cheese",
    category: "dairy",
    serving_size: "1/2 cup lowfat",
    glucose_change: 10,
    educational_text: "Low-fat cottage cheese contains some lactose, mildly raising glucose in diabetes.",
    image: "/images/foods/cottage-cheese.jpg",
    fallbackIcon: "🥛"
  },
  {
    item: "Cream",
    category: "dairy",
    serving_size: "2 tbsp heavy",
    glucose_change: 2,
    educational_text: "Heavy cream is mostly fat with trace lactose, having minimal glucose impact.",
    image: "/images/foods/cream.jpg",
    fallbackIcon: "🥛"
  },
  {
    item: "Cream of whole wheat",
    category: "grain",
    serving_size: "1 cup cooked",
    glucose_change: 35,
    educational_text: "Hot wheat cereal raises glucose similarly to other wheat products in diabetes.",
    image: "/images/foods/cream-wheat.jpg",
    fallbackIcon: "🥣"
  },
  {
    item: "Creamy salad dressing",
    category: "condiment",
    serving_size: "2 tbsp",
    glucose_change: 8,
    educational_text: "Creamy dressings often contain added sugars, mildly raising glucose.",
    image: "/images/foods/creamy-dressing.jpg",
    fallbackIcon: "🥗"
  },
  {
    item: "Creamy sauce",
    category: "condiment",
    serving_size: "1/4 cup",
    glucose_change: 10,
    educational_text: "Cream sauces may contain flour and milk sugars, raising glucose moderately.",
    image: "/images/foods/creamy-sauce.jpg",
    fallbackIcon: "🍝"
  },
  {
    item: "Croissant",
    category: "refined-grain",
    serving_size: "1 medium",
    glucose_change: 30,
    educational_text: "Buttery croissants raise glucose 30-40 mg/dL despite fat content.",
    image: "/images/foods/croissant.jpg",
    fallbackIcon: "🥐"
  },
  {
    item: "Cucumber",
    category: "vegetable",
    serving_size: "1 cup sliced",
    glucose_change: 3,
    educational_text: "Cucumbers are mostly water with very few carbs, ideal for glucose control.",
    image: "/images/foods/cucumber.jpg",
    fallbackIcon: "🥒"
  },
  {
    item: "Deli meat",
    category: "processed-meat",
    serving_size: "3 oz",
    glucose_change: 8,
    educational_text: "Deli meats often contain dextrose and starches, causing small glucose rises in diabetes.",
    image: "/images/foods/deli-meat.jpg",
    fallbackIcon: "🥪"
  },
  {
    item: "Donut",
    category: "sweets",
    serving_size: "1 glazed",
    glucose_change: 45,
    educational_text: "Donuts' fried dough and sugar coating cause rapid glucose elevation.",
    image: "/images/foods/donut.jpg",
    fallbackIcon: "🍩"
  },
  {
    item: "Dried fruit",
    category: "fruit",
    serving_size: "1/4 cup",
    glucose_change: 40,
    educational_text: "Dried fruit concentrates natural sugars, causing rapid glucose spikes.",
    image: "/images/foods/dried-fruit.jpg",
    fallbackIcon: "🍇"
  },
  {
    item: "Eggplant",
    category: "vegetable",
    serving_size: "1 cup cooked",
    glucose_change: 5,
    educational_text: "Eggplant is low-carb and high-fiber, having minimal glucose impact.",
    image: "/images/foods/eggplant.jpg",
    fallbackIcon: "🍆"
  },
  {
    item: "Eggs/Egg whites",
    category: "protein",
    serving_size: "2 large eggs",
    glucose_change: 8,
    educational_text: "Eggs cause minimal glucose rise, but the protein can still convert to glucose slowly in people with diabetes.",
    image: "/images/foods/eggs.jpg",
    fallbackIcon: "🥚"
  },
  {
    item: "Farro",
    category: "grain",
    serving_size: "1/2 cup cooked",
    glucose_change: 30,
    educational_text: "Ancient grain farro has protein and fiber but still raises glucose significantly.",
    image: "/images/foods/farro.jpg",
    fallbackIcon: "🌾"
  },
  {
    item: "Fish/Tuna",
    category: "meat",
    serving_size: "4 oz grilled",
    glucose_change: 8,
    educational_text: "Fish has zero carbs but protein can still raise glucose mildly in diabetes. Fatty fish like salmon may have less impact than lean fish.",
    image: "/images/foods/fish-tuna.jpg",
    fallbackIcon: "🐟"
  },
  {
    item: "Fried starchy vegetable",
    category: "fried-food",
    serving_size: "10 pieces",
    glucose_change: 35,
    educational_text: "Deep frying doesn't prevent starch from raising glucose 35-45 mg/dL.",
    image: "/images/foods/fried-vegetable.jpg",
    fallbackIcon: "🍟"
  },
  {
    item: "Fruit",
    category: "fruit",
    serving_size: "1 medium piece",
    glucose_change: 25,
    educational_text: "Fresh fruit raises glucose 20-35 mg/dL depending on type and ripeness.",
    image: "/images/foods/fruit.jpg",
    fallbackIcon: "🍎"
  },
  {
    item: "Fruit juice (100% natural)",
    category: "drink",
    serving_size: "4 oz",
    glucose_change: 45,
    educational_text: "Even 100% juice lacks fiber and spikes glucose 45-60 mg/dL rapidly.",
    image: "/images/foods/fruit-juice.jpg",
    fallbackIcon: "🧃"
  },
  {
    item: "Fruit packed in juice/syrup",
    category: "fruit",
    serving_size: "1/2 cup canned",
    glucose_change: 35,
    educational_text: "Fruit in syrup has added sugars, spiking glucose more than fresh fruit.",
    image: "/images/foods/canned-fruit.jpg",
    fallbackIcon: "🥫"
  },
  {
    item: "Full fat cheese",
    category: "dairy",
    serving_size: "1 oz",
    glucose_change: 3,
    educational_text: "Full-fat cheese has very little lactose, causing minimal glucose rise due to high fat content.",
    image: "/images/foods/full-fat-cheese.jpg",
    fallbackIcon: "🧀"
  },
  {
    item: "Goat",
    category: "meat",
    serving_size: "4 oz cooked",
    glucose_change: 12,
    educational_text: "Lean goat meat acts similarly to other lean proteins, potentially raising glucose 10-15 mg/dL through gluconeogenesis.",
    image: "/images/foods/goat.jpg",
    fallbackIcon: "🐐"
  },
  {
    item: "Greek yogurt",
    category: "dairy",
    serving_size: "6 oz plain",
    glucose_change: 15,
    educational_text: "Plain Greek yogurt has less lactose than regular yogurt but still raises glucose 15-20 mg/dL.",
    image: "/images/foods/greek-yogurt.jpg",
    fallbackIcon: "🥛"
  },
  {
    item: "Green beans",
    category: "vegetable",
    serving_size: "1 cup cooked",
    glucose_change: 8,
    educational_text: "Green beans have moderate carbs with fiber, causing mild glucose elevation.",
    image: "/images/foods/green-beans.jpg",
    fallbackIcon: "🫘"
  },
  {
    item: "High fat/fried meat",
    category: "fried-food",
    serving_size: "3 oz",
    glucose_change: 20,
    educational_text: "Breading on fried meats adds carbs, raising glucose 20-30 mg/dL.",
    image: "/images/foods/fried-meat.jpg",
    fallbackIcon: "🍗"
  },
  {
    item: "Hot dog",
    category: "processed-meat",
    serving_size: "1 hot dog",
    glucose_change: 10,
    educational_text: "Processed hot dogs contain fillers and sugars that can mildly elevate blood glucose.",
    image: "/images/foods/hot-dog.jpg",
    fallbackIcon: "🌭"
  },
  {
    item: "Ice cream",
    category: "dairy",
    serving_size: "1/2 cup",
    glucose_change: 40,
    educational_text: "Ice cream's high sugar content (20g+) causes significant glucose spike in diabetes.",
    image: "/images/foods/ice-cream.jpg",
    fallbackIcon: "🍨"
  },
  {
    item: "Icelandic yogurt",
    category: "dairy",
    serving_size: "5.3 oz plain",
    glucose_change: 12,
    educational_text: "Skyr is high in protein with moderate lactose, causing controlled glucose rise in diabetes.",
    image: "/images/foods/icelandic-yogurt.jpg",
    fallbackIcon: "🥛"
  },
  {
    item: "Jicama",
    category: "vegetable",
    serving_size: "1/2 cup raw",
    glucose_change: 6,
    educational_text: "Jicama has some carbs but high fiber content moderates glucose impact.",
    image: "/images/foods/jicama.jpg",
    fallbackIcon: "🥔"
  },
  {
    item: "Kale",
    category: "vegetable",
    serving_size: "1 cup cooked",
    glucose_change: 4,
    educational_text: "Kale is nutrient-dense with minimal carbs, barely affecting blood glucose.",
    image: "/images/foods/kale.jpg",
    fallbackIcon: "🥬"
  },
  {
    item: "Kielbasa",
    category: "processed-meat",
    serving_size: "3 oz",
    glucose_change: 18,
    educational_text: "Polish sausage often contains sugars and starches, potentially raising glucose 15-25 mg/dL.",
    image: "/images/foods/kielbasa.jpg",
    fallbackIcon: "🌭"
  },
  {
    item: "Kohlrabi",
    category: "vegetable",
    serving_size: "1 cup raw",
    glucose_change: 6,
    educational_text: "Kohlrabi is low-carb with good fiber, causing minimal glucose rise.",
    image: "/images/foods/kohlrabi.jpg",
    fallbackIcon: "🥬"
  },
  {
    item: "Lamb",
    category: "meat",
    serving_size: "4 oz roasted",
    glucose_change: 15,
    educational_text: "Lamb's higher fat content may slow protein conversion to glucose, but still expect a 10-20 mg/dL rise in diabetes.",
    image: "/images/foods/lamb.jpg",
    fallbackIcon: "🍖"
  },
  {
    item: "Leeks",
    category: "vegetable",
    serving_size: "1/2 cup cooked",
    glucose_change: 8,
    educational_text: "Leeks have moderate carbs, potentially raising glucose 8-12 mg/dL.",
    image: "/images/foods/leeks.jpg",
    fallbackIcon: "🥬"
  },
  {
    item: "Lentils",
    category: "legume",
    serving_size: "1/2 cup cooked",
    glucose_change: 18,
    educational_text: "Lentils have good protein and fiber, moderating glucose rise to 18-25 mg/dL.",
    image: "/images/foods/lentils.jpg",
    fallbackIcon: "🟠"
  },
  {
    item: "Lettuce",
    category: "vegetable",
    serving_size: "2 cups raw",
    glucose_change: 2,
    educational_text: "Lettuce is mostly water and fiber, having virtually no glucose impact.",
    image: "/images/foods/lettuce.jpg",
    fallbackIcon: "🥬"
  },
  {
    item: "Light/reduced fat cheese",
    category: "dairy",
    serving_size: "1 oz",
    glucose_change: 5,
    educational_text: "Reduced fat cheese has minimal lactose, causing only slight glucose elevation.",
    image: "/images/foods/light-cheese.jpg",
    fallbackIcon: "🧀"
  },
  {
    item: "Marbled steak",
    category: "fatty-meat",
    serving_size: "6 oz",
    glucose_change: 12,
    educational_text: "Fatty steaks cause less glucose rise than lean cuts due to fat slowing protein conversion, but still expect 10-15 mg/dL increase.",
    image: "/images/foods/marbled-steak.jpg",
    fallbackIcon: "🥩"
  },
  {
    item: "Margarine",
    category: "fat",
    serving_size: "1 tbsp",
    glucose_change: 0,
    educational_text: "Margarine contains no carbs but may affect long-term insulin sensitivity.",
    image: "/images/foods/margarine.jpg",
    fallbackIcon: "🧈"
  },
  {
    item: "Mayonnaise",
    category: "condiment",
    serving_size: "1 tbsp",
    glucose_change: 1,
    educational_text: "Mayo is mostly fat with minimal carbs, having negligible glucose impact.",
    image: "/images/foods/mayonnaise.jpg",
    fallbackIcon: "🥄"
  },
  {
    item: "Muffin",
    category: "refined-grain",
    serving_size: "1 small",
    glucose_change: 50,
    educational_text: "Muffins combine refined flour and sugar, spiking glucose 50-60 mg/dL.",
    image: "/images/foods/muffin.jpg",
    fallbackIcon: "🧁"
  },
  {
    item: "Mushrooms",
    category: "vegetable",
    serving_size: "1 cup cooked",
    glucose_change: 4,
    educational_text: "Mushrooms are very low-carb, ideal for maintaining stable glucose levels.",
    image: "/images/foods/mushrooms.jpg",
    fallbackIcon: "🍄"
  },
  {
    item: "Nut butter",
    category: "healthy-fat",
    serving_size: "2 tbsp",
    glucose_change: 8,
    educational_text: "Natural nut butters have minimal carbs, with fat and protein moderating glucose.",
    image: "/images/foods/nut-butter.jpg",
    fallbackIcon: "🥜"
  },
  {
    item: "Oatmeal",
    category: "grain",
    serving_size: "1/2 cup cooked",
    glucose_change: 25,
    educational_text: "Steel-cut oats raise glucose more slowly than instant, but still increase 25-35 mg/dL.",
    image: "/images/foods/oatmeal.jpg",
    fallbackIcon: "🥣"
  },
  {
    item: "Okra",
    category: "vegetable",
    serving_size: "1 cup cooked",
    glucose_change: 7,
    educational_text: "Okra's fiber content helps slow any glucose rise from its moderate carbs.",
    image: "/images/foods/okra.jpg",
    fallbackIcon: "🥒"
  },
  {
    item: "Olive",
    category: "healthy-fat",
    serving_size: "10 olives",
    glucose_change: 2,
    educational_text: "Olives are primarily fat with almost no carbs, ideal for glucose control.",
    image: "/images/foods/olive.jpg",
    fallbackIcon: "🫒"
  },
  {
    item: "Olive Oil",
    category: "healthy-fat",
    serving_size: "1 tbsp",
    glucose_change: 0,
    educational_text: "Pure olive oil contains no carbs and doesn't raise glucose levels.",
    image: "/images/foods/olive-oil.jpg",
    fallbackIcon: "🫒"
  },
  {
    item: "Onions",
    category: "vegetable",
    serving_size: "1/2 cup cooked",
    glucose_change: 8,
    educational_text: "Onions contain some natural sugars, mildly raising glucose in diabetes.",
    image: "/images/foods/onions.jpg",
    fallbackIcon: "🧅"
  },
  {
    item: "Organ meat",
    category: "meat",
    serving_size: "4 oz",
    glucose_change: 15,
    educational_text: "Liver contains stored glycogen (carbs), potentially raising glucose 15-20 mg/dL in diabetes.",
    image: "/images/foods/organ-meat.jpg",
    fallbackIcon: "🫀"
  },
  {
    item: "Pasta",
    category: "refined-grain",
    serving_size: "1/2 cup cooked",
    glucose_change: 40,
    educational_text: "Refined pasta causes rapid glucose elevation of 40-50 mg/dL in diabetes.",
    image: "/images/foods/pasta.jpg",
    fallbackIcon: "🍝"
  },
  {
    item: "Pastry",
    category: "sweets",
    serving_size: "1 piece",
    glucose_change: 50,
    educational_text: "Pastries combine refined flour, sugar, and often fruit, spiking glucose significantly.",
    image: "/images/foods/pastry.jpg",
    fallbackIcon: "🥐"
  },
  {
    item: "Pea pods",
    category: "vegetable",
    serving_size: "1 cup raw",
    glucose_change: 6,
    educational_text: "Snow peas are lower in carbs than regular peas, causing minimal glucose rise.",
    image: "/images/foods/pea-pods.jpg",
    fallbackIcon: "🥒"
  },
  {
    item: "Peas",
    category: "starchy-vegetable",
    serving_size: "1/2 cup cooked",
    glucose_change: 18,
    educational_text: "Green peas have protein and fiber but still raise glucose 15-25 mg/dL.",
    image: "/images/foods/peas.jpg",
    fallbackIcon: "🟢"
  },
  {
    item: "Peppers",
    category: "vegetable",
    serving_size: "1 cup raw",
    glucose_change: 6,
    educational_text: "Bell peppers have some natural sugars but high vitamin C and fiber content.",
    image: "/images/foods/peppers.jpg",
    fallbackIcon: "🫑"
  },
  {
    item: "Pie",
    category: "sweets",
    serving_size: "1 slice",
    glucose_change: 55,
    educational_text: "Pie filling and crust create major glucose spikes of 55-70 mg/dL.",
    image: "/images/foods/pie.jpg",
    fallbackIcon: "🥧"
  },
  {
    item: "Plant Oil",
    category: "healthy-fat",
    serving_size: "1 tbsp",
    glucose_change: 0,
    educational_text: "Plant oils are pure fat with zero glucose impact when used for cooking.",
    image: "/images/foods/plant-oil.jpg",
    fallbackIcon: "🌻"
  },
  {
    item: "Plantain",
    category: "starchy-vegetable",
    serving_size: "1/2 cup sliced",
    glucose_change: 30,
    educational_text: "Ripe plantains are high in natural sugars and starch, spiking glucose 30-40 mg/dL.",
    image: "/images/foods/plantain.jpg",
    fallbackIcon: "🍌"
  },
  {
    item: "Pork",
    category: "meat",
    serving_size: "4 oz lean",
    glucose_change: 12,
    educational_text: "Pork protein impacts glucose similarly to other meats in diabetes, with fattier cuts potentially causing less rise than lean cuts.",
    image: "/images/foods/pork.jpg",
    fallbackIcon: "🥓"
  },
  {
    item: "Potatoes",
    category: "starchy-vegetable",
    serving_size: "1 small baked",
    glucose_change: 40,
    educational_text: "Potatoes rapidly convert to glucose, causing spikes of 40-60 mg/dL in diabetes.",
    image: "/images/foods/potatoes.jpg",
    fallbackIcon: "🥔"
  },
  {
    item: "Pumpkin",
    category: "starchy-vegetable",
    serving_size: "1/2 cup mashed",
    glucose_change: 15,
    educational_text: "Pumpkin is lower in carbs than other squashes but still raises glucose moderately.",
    image: "/images/foods/pumpkin.jpg",
    fallbackIcon: "🎃"
  },
  {
    item: "Quinoa",
    category: "grain",
    serving_size: "1/2 cup cooked",
    glucose_change: 25,
    educational_text: "Quinoa's complete protein and fiber help moderate its glucose impact to 25-35 mg/dL.",
    image: "/images/foods/quinoa.jpg",
    fallbackIcon: "🌾"
  },
  {
    item: "Radishes",
    category: "vegetable",
    serving_size: "1 cup sliced",
    glucose_change: 3,
    educational_text: "Radishes are very low-carb and crunchy, barely affecting blood glucose.",
    image: "/images/foods/radishes.jpg",
    fallbackIcon: "🟥"
  },
  {
    item: "Ricotta cheese",
    category: "dairy",
    serving_size: "1/4 cup part-skim",
    glucose_change: 8,
    educational_text: "Part-skim ricotta has moderate lactose content, causing mild glucose elevation.",
    image: "/images/foods/ricotta-cheese.jpg",
    fallbackIcon: "🧀"
  },
  {
    item: "Romaine",
    category: "vegetable",
    serving_size: "2 cups raw",
    glucose_change: 2,
    educational_text: "Romaine lettuce is extremely low in carbs, ideal for glucose control.",
    image: "/images/foods/romaine.jpg",
    fallbackIcon: "🥬"
  },
  {
    item: "Rutabaga",
    category: "vegetable",
    serving_size: "1/2 cup cooked",
    glucose_change: 10,
    educational_text: "Rutabaga has more carbs than many vegetables, moderately raising glucose.",
    image: "/images/foods/rutabaga.jpg",
    fallbackIcon: "🟤"
  },
  {
    item: "Rye",
    category: "grain",
    serving_size: "1 slice bread",
    glucose_change: 22,
    educational_text: "Rye bread typically has a lower glycemic impact than wheat bread in diabetes.",
    image: "/images/foods/rye.jpg",
    fallbackIcon: "🍞"
  },
  {
    item: "Sauerkraut",
    category: "vegetable",
    serving_size: "1/2 cup",
    glucose_change: 3,
    educational_text: "Fermented sauerkraut is very low-carb with probiotic benefits.",
    image: "/images/foods/sauerkraut.jpg",
    fallbackIcon: "🥬"
  },
  {
    item: "Sausage",
    category: "processed-meat",
    serving_size: "2 links",
    glucose_change: 15,
    educational_text: "Many sausages contain fillers and sugars that can raise glucose 15-20 mg/dL in diabetes.",
    image: "/images/foods/sausage.jpg",
    fallbackIcon: "🌭"
  },
  {
    item: "Scallions",
    category: "vegetable",
    serving_size: "1/4 cup chopped",
    glucose_change: 2,
    educational_text: "Green onions are very low in carbs, adding flavor without glucose impact.",
    image: "/images/foods/scallions.jpg",
    fallbackIcon: "🥬"
  },
  {
    item: "Seafood",
    category: "meat",
    serving_size: "4 oz mixed",
    glucose_change: 12,
    educational_text: "Shellfish like shrimp contain small amounts of carbs plus protein effects, potentially raising glucose 10-15 mg/dL in diabetes.",
    image: "/images/foods/seafood.jpg",
    fallbackIcon: "🦐"
  },
  {
    item: "Seeds",
    category: "healthy-fat",
    serving_size: "1 oz mixed",
    glucose_change: 5,
    educational_text: "Seeds are high in healthy fats and protein with minimal glucose impact.",
    image: "/images/foods/seeds.jpg",
    fallbackIcon: "🌻"
  },
  {
    item: "Shortening",
    category: "fat",
    serving_size: "1 tbsp",
    glucose_change: 0,
    educational_text: "Shortening is pure fat with no direct glucose impact.",
    image: "/images/foods/shortening.jpg",
    fallbackIcon: "🧈"
  },
  {
    item: "Skim milk",
    category: "dairy",
    serving_size: "1 cup",
    glucose_change: 20,
    educational_text: "Low-fat milk contains 12g lactose (milk sugar) per cup, raising glucose 20-30 mg/dL in diabetes.",
    image: "/images/foods/skim-milk.jpg",
    fallbackIcon: "🥛"
  },
  {
    item: "Spaghetti squash",
    category: "vegetable",
    serving_size: "1 cup cooked",
    glucose_change: 8,
    educational_text: "Spaghetti squash is lower-carb than pasta but still raises glucose mildly.",
    image: "/images/foods/spaghetti-squash.jpg",
    fallbackIcon: "🟡"
  },
  {
    item: "Spare ribs",
    category: "fatty-meat",
    serving_size: "4 ribs",
    glucose_change: 25,
    educational_text: "BBQ sauce on ribs can add 15-20g carbs, causing significant glucose rise. Plain ribs have less impact.",
    image: "/images/foods/spare-ribs.jpg",
    fallbackIcon: "🍖"
  },
  {
    item: "Spinach",
    category: "vegetable",
    serving_size: "1 cup cooked",
    glucose_change: 3,
    educational_text: "Spinach is extremely low-carb and nutrient-dense, barely affecting glucose.",
    image: "/images/foods/spinach.jpg",
    fallbackIcon: "🥬"
  },
  {
    item: "Sugary cereal",
    category: "refined-grain",
    serving_size: "1 cup",
    glucose_change: 55,
    educational_text: "Sugary cereals cause rapid glucose spikes of 55-70 mg/dL in diabetes.",
    image: "/images/foods/sugary-cereal.jpg",
    fallbackIcon: "🥣"
  },
  {
    item: "Sugary flavored milk",
    category: "dairy",
    serving_size: "1 cup",
    glucose_change: 50,
    educational_text: "Chocolate milk contains 25-30g sugar, causing rapid glucose spike of 50+ mg/dL in diabetes.",
    image: "/images/foods/flavored-milk.jpg",
    fallbackIcon: "🍫"
  },
  {
    item: "Sugary yogurt",
    category: "dairy",
    serving_size: "6 oz",
    glucose_change: 45,
    educational_text: "Fruit yogurts contain 20-30g sugar, spiking glucose 40-60 mg/dL in diabetes.",
    image: "/images/foods/sugary-yogurt.jpg",
    fallbackIcon: "🍓"
  },
  {
    item: "Summer squash",
    category: "vegetable",
    serving_size: "1 cup cooked",
    glucose_change: 5,
    educational_text: "Yellow squash is low in carbs with good fiber, causing minimal glucose rise.",
    image: "/images/foods/summer-squash.jpg",
    fallbackIcon: "🟡"
  },
  {
    item: "Sweet potatoes",
    category: "starchy-vegetable",
    serving_size: "1/2 cup mashed",
    glucose_change: 35,
    educational_text: "Sweet potatoes have more fiber than white but still raise glucose 35-45 mg/dL.",
    image: "/images/foods/sweet-potatoes.jpg",
    fallbackIcon: "🍠"
  },
  {
    item: "Swiss chard",
    category: "vegetable",
    serving_size: "1 cup cooked",
    glucose_change: 4,
    educational_text: "Swiss chard is low-carb with excellent minerals, having minimal glucose impact.",
    image: "/images/foods/swiss-chard.jpg",
    fallbackIcon: "🥬"
  },
  {
    item: "Tempeh",
    category: "plant-protein",
    serving_size: "3 oz",
    glucose_change: 20,
    educational_text: "Tempeh has about 10g carbs per serving, which combined with protein can raise glucose 20-30 mg/dL in diabetes.",
    image: "/images/foods/tempeh.jpg",
    fallbackIcon: "🟫"
  },
  {
    item: "Tofu",
    category: "plant-protein",
    serving_size: "5 oz firm",
    glucose_change: 15,
    educational_text: "Tofu contains 2-3g carbs per serving plus protein effects, potentially raising glucose 15-20 mg/dL in diabetes.",
    image: "/images/foods/tofu.jpg",
    fallbackIcon: "🧈"
  },
  {
    item: "Tomatoes",
    category: "vegetable",
    serving_size: "1 cup chopped",
    glucose_change: 8,
    educational_text: "Tomatoes have natural sugars and acids, mildly raising glucose levels.",
    image: "/images/foods/tomatoes.jpg",
    fallbackIcon: "🍅"
  },
  {
    item: "Turkey",
    category: "meat",
    serving_size: "4 oz roasted",
    glucose_change: 10,
    educational_text: "Turkey protein can cause a delayed, mild glucose rise as the body converts some protein to glucose over 3-5 hours.",
    image: "/images/foods/turkey.jpg",
    fallbackIcon: "🦃"
  },
  {
    item: "Turnips",
    category: "vegetable",
    serving_size: "1/2 cup cooked",
    glucose_change: 6,
    educational_text: "Turnips are lower-carb root vegetables, causing minimal glucose elevation.",
    image: "/images/foods/turnips.jpg",
    fallbackIcon: "⚪"
  },
  {
    item: "Unsweetened milk alternative",
    category: "dairy",
    serving_size: "1 cup",
    glucose_change: 5,
    educational_text: "Unsweetened almond or soy milk has minimal carbs, causing little glucose rise.",
    image: "/images/foods/milk-alternative.jpg",
    fallbackIcon: "🥛"
  },
  {
    item: "Whipped cream",
    category: "dairy",
    serving_size: "1/4 cup",
    glucose_change: 8,
    educational_text: "Sweetened whipped cream contains added sugar, mildly raising glucose levels.",
    image: "/images/foods/whipped-cream.jpg",
    fallbackIcon: "🍦"
  },
  {
    item: "White bread",
    category: "refined-grain",
    serving_size: "1 slice",
    glucose_change: 35,
    educational_text: "White bread quickly converts to glucose, spiking levels 35-45 mg/dL in diabetes.",
    image: "/images/foods/white-bread.jpg",
    fallbackIcon: "🍞"
  },
  {
    item: "White rice",
    category: "refined-grain",
    serving_size: "1/2 cup cooked",
    glucose_change: 50,
    educational_text: "White rice rapidly spikes glucose 50-70 mg/dL due to quick starch breakdown.",
    image: "/images/foods/white-rice.jpg",
    fallbackIcon: "🍚"
  },
  {
    item: "Whole grain cracker",
    category: "grain",
    serving_size: "5 crackers",
    glucose_change: 20,
    educational_text: "Whole grain crackers still contain concentrated carbs, raising glucose 20-30 mg/dL.",
    image: "/images/foods/whole-grain-cracker.jpg",
    fallbackIcon: "🍪"
  },
  {
    item: "Whole wheat bread",
    category: "grain",
    serving_size: "1 slice",
    glucose_change: 25,
    educational_text: "Whole wheat bread still raises glucose significantly, though less rapidly than white bread.",
    image: "/images/foods/whole-wheat-bread.jpg",
    fallbackIcon: "🍞"
  },
  {
    item: "Whole wheat pasta",
    category: "grain",
    serving_size: "1/2 cup cooked",
    glucose_change: 30,
    educational_text: "Whole wheat pasta's fiber slows but doesn't prevent glucose rise of 30-40 mg/dL.",
    image: "/images/foods/whole-wheat-pasta.jpg",
    fallbackIcon: "🍝"
  },
  {
    item: "Wild Rice",
    category: "grain",
    serving_size: "1/2 cup cooked",
    glucose_change: 30,
    educational_text: "Wild rice has more protein and fiber than white rice, moderating glucose rise to 30-40 mg/dL.",
    image: "/images/foods/wild-rice.jpg",
    fallbackIcon: "🌾"
  },
  {
    item: "Winter squash",
    category: "starchy-vegetable",
    serving_size: "1/2 cup",
    glucose_change: 20,
    educational_text: "Winter squash has natural sugars and starch, raising glucose 20-30 mg/dL.",
    image: "/images/foods/winter-squash.jpg",
    fallbackIcon: "🎃"
  },
  {
    item: "Yam",
    category: "starchy-vegetable",
    serving_size: "1/2 cup cooked",
    glucose_change: 35,
    educational_text: "Yams are starchy tubers that significantly raise glucose 35-45 mg/dL in diabetes.",
    image: "/images/foods/yam.jpg",
    fallbackIcon: "🍠"
  },
  {
    item: "Yucca",
    category: "starchy-vegetable",
    serving_size: "1/2 cup boiled",
    glucose_change: 40,
    educational_text: "Yucca root is very high in starch, causing substantial glucose elevation.",
    image: "/images/foods/yucca.jpg",
    fallbackIcon: "⚪"
  },
  {
    item: "Zucchini",
    category: "vegetable",
    serving_size: "1 cup cooked",
    glucose_change: 5,
    educational_text: "Zucchini is very low-carb and versatile, excellent for glucose management.",
    image: "/images/foods/zucchini.jpg",
    fallbackIcon: "🥒"
  }
];


// Navigation menu items
export const menuItems = [
  { id: 'blood-sugar', name: 'Blood Sugar' },
  { id: 'glycemic-index', name: 'Glycemic Index' },
  { id: 'ketones', name: 'Ketones' },
  { id: 'insulin-dosing', name: 'Insulin Dosing' }
];