# Advanced Data Table Web App

## Objective
To create an advanced data table web app using React JS / Next JS / Gatsby with various features to demonstrate understanding and effective implementation of open-source solutions.


## Use the below Link to access the website:
## https://main--reunionasn.netlify.app/

## Features
- **Column Visibility:** View/hide columns.
- **Sorting:** Sort data in columns.
- **Filtering:**
  - Global search.
  - Column-specific fuzzy search.
  - Multi-select dropdown filter with facets.
  - Range filter for numbers and dates.
- **Grouping:** Group data by category and subcategory.
- **Pagination:** Display 10 results per page.

## Technologies Used
- React JS
- Next JS / Gatsby
- Tanstack React Table
- Material React Table
- Material UI

## Getting Started

### Prerequisites
- Node.js
- npm

### Installation
Clone the repository:
```sh
git clone <your-repo-url>
cd <your-repo-directory>
```

## Usage
- **View/Hide Columns:** Click the visibility icon to toggle the visibility of columns.
- **Sort Columns:** Click the sort icon to sort data in columns.
- **Filter Rows:** Click the filter icon to apply different filters.
- **Group Data:** Click the group icon to group data by category and subcategory.
- **Pagination:** Navigate through pages using the pagination controls at the bottom of the table.

## Implementation Details
- **Grouping:** Implemented on category and subcategory.
- **Filtering:**
  - Fuzzy search on name.
  - Multi-select dropdown with facets on category and subcategory.
  - Range filter with a slider for price.
  - Date range filter with a calendar for createdAt.
- **Sorting:** Enabled for all columns.
- **Column Visibility:** Enabled for all columns.
- **Custom Cell Value Rendering:** Dates are displayed in local datetime format DD-MMM-YYYY HH for createdAt and updatedAt.
- **Pagination:** Implemented with 10 results per page.




