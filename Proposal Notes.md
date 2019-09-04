# Overview

## DB Description
- Application - Web based store front
- Replaces the need for cashiers, all you need is persons making food
- Manages members, card info, inventory stock levels and item prices

## Stakeholders
### Who
- Store(company) owners
- programmers
- Store Managers

### Why they matter
- They have invested time/money into project
- They're counting on us to have an end product that meets their standards


# System Environment
- **HW**: Linux based machine
- **RDBMS Used**: MySQL
- **SW**: JavaScript, React.js, MySQL, Apache Web Server

# Functional Requirements
### Users
- Access via internet using keyboard and mouse
- Users are store customers of varied age and gender

### Features
- Users will be able to make an account
- Users will be able to select items to purchase
- Users will be able to modify payment methods
- Users will be able to update their accounts

### Functional Processes
- Draw.io flowcharts

# Non-functional Requirements
- Front-end should be fast and easy to navigate
- Information displayed on website should be secure
- Software should be easy to use by people with various disabilities
- Front-end should be efficient
- Software should be able to handle a large amount of users
- Software should be easily scalable


---
### Table Ideas
1. Person
- Names, cell phone, member id
- Relation: Account
2. Account
- member id, email, password, join/expire date, address
- Relation: Person (from member id)
3. Orders
- Price, order id, item id, member id
- Relation: Account
4. Item Categories
- Name, category ID
- Relation: Item
5. Item
- Name, category ID, Item ID
- Relation: Item Categories
6. Item Stock Levels
-  Item ID, stock date, quantity
- Relation: Item
7. Prices
- Item ID, price
- Relation: Item
8. Checkout
- Item ID, Member ID, Order ID, Payment
- Relation: Account, Item
9. Payments
- Member ID, list of card id  
- Relation: Account, checkout
10. Card info
- Card number, card id, security code, card holder, zipcode
- Relation: Payments










