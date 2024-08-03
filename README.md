# DataGriffin

**DataGriffin** is a web application designed to streamline the management and analysis of data. It allows users to upload CSV or Excel files, which are then processed to perform various data operations, including conversion to JSON, data cleaning, visualization, data mining, and SQL query execution.

## Features

- **File Upload**: Upload CSV or Excel files through a user-friendly interface.
- **Data Conversion**: Convert uploaded files to JSON format with detailed structure.
- **Data Cleaning**: Perform data cleaning tasks to ensure data quality.
- **Data Visualization**: Visualize data with charts and graphs for better insights.
- **Data Mining**: Extract useful information and patterns from the data.
- **SQL Queries**: Write and execute SQL queries to manipulate and retrieve data.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **File Parsing**: `csv-parser` for CSV files, `xlsx` for Excel files
- **AWS Services**:
  - **S3**: Store and manage uploaded files and converted JSON files
  - **Lambda**: Process data and perform serverless operations

## Installation

To get started with DataGriffin, follow these steps:

### Clone the Repository

```bash
git clone https://github.com/username/DataGriffin.git
cd DataGriffin
