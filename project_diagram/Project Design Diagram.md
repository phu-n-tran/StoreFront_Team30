- Phu
  - Customer
  - Owns
  - Account
  - Holds
  - Card Info
  - Make
  - Orders
- Aaron
  - Item
  - has
  - contains
- Evan 
  - Item Stock Levels
  - belongs
  - Item Categories

# Descritpions
## Item Stock Levels
This entity set has a one to one relationship with the entity set items. This is because as an item can only have one stock level. The entities in the set are identified by the primary key stockID, and are paired to items by the Item's ID.

## Belongs
This is a relationship between Item and Item Categories. The relationship is many to many, as Items can have multiple categories and categories have multiple items.

## Item Categories
This is an entity set that will hold the various categories for Items. The primary key Category ID identifies entities in this set, Category Name is also another attribute. An example of Category name can be "Chips" or "Soda".

