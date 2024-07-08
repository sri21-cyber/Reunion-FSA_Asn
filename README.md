Advanced Data Table Web App
Objective
To create an advanced data table web app using React JS / Next JS / Gatsby with various features to demonstrate understanding and effective implementation of open-source solutions.

Features
a) Column Visibility: View/hide columns.
b) Sorting: Sort data in columns.
c)Filtering:
    Global search.
    Column-specific fuzzy search.
    Multi-select dropdown filter with facets.
    Range filter for numbers and dates.
d)Grouping: Group data by category and subcategory.
e)Pagination: Display 10 results per page.

Technologies Used
    React JS
    Next JS / Gatsby
    Tanstack React Table
    Material React Table
    Material UI
Getting Started
Prerequisites
    Node.js
    npm
Installation
Clone the repository:


git clone <your-repo-url>
cd <your-repo-directory>
Install dependencies:


npm install
Start the development server:


npm start

Usage
1)View/Hide Columns: Click the visibility icon to toggle the visibility of columns.
2)Sort Columns: Click the sort icon to sort data in columns.
3)Filter Rows: Click the filter icon to apply different filters.
4)Group Data: Click the group icon to group data by category and subcategory.
5)Pagination: Navigate through pages using the pagination controls at the bottom of the table.
Implementation Details
1)Grouping: Implemented on category and subcategory.
2)Filtering:
    Fuzzy search on name.
    Multi-select dropdown with facets on category and subcategory.
    Range filter with a slider for price.
    Date range filter with a calendar for createdAt.
4)Sorting: Enabled for all columns.
5)Column Visibility: Enabled for all columns.
6)Custom Cell Value Rendering: Dates are displayed in local datetime format DD-MMM-YYYY HH:MM for createdAt and updatedAt.
7)Pagination: Implemented with 10 results per page.

Sample Data
sample-data.json
