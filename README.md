# AI News Summarizer

## Project Description

This project is a Node.js utility that fetches article content from a given URL and leverages AI models to generate a concise title and summary. It's an ideal solution for various applications such as news aggregation platforms, briefing tools, and content analysis systems.

## Features

* **URL-based Summarization:** Easily summarize articles by simply providing their URL.
* **Customizable Summary Length:** Specify the approximate word count for the generated summaries.
* **AI-Powered Summaries:** Utilizes advanced AI models (GPT-4o) for intelligent and relevant content extraction.
* **Local Storage:** Automatically saves generated summaries (title, summary, URL, and timestamp) to a local `summaries.json` file.
* **User-Friendly Interface:** A simple web interface built with Express.js and Bootstrap 5.3 for easy interaction.

## Setup

To get this project up and running on your local machine, please follow these steps:

1.  **Clone the Repository:**
    Start by cloning the project repository to your local system.

    ```bash
    git clone <repository-url> # Replace with your actual repository URL
    cd ai-news-summarizer
    ```

2.  **Install Dependencies:**
    Navigate into the project directory and install all the necessary Node.js packages.

    ```bash
    npm install
    ```

3.  **Create `.env` File:**
    For secure handling of your API key, create a file named `.env` in the root directory of your project. Add your OpenAI API key to this file as shown below:

    ```
    OPENAI_API_KEY=YOUR_ACTUAL_OPENAI_API_KEY
    ```
    **Important:** Remember to replace `YOUR_ACTUAL_OPENAI_API_KEY` with your valid OpenAI API key.

## Running the Application

Once you have installed all dependencies and configured your `.env` file, you can start the application using the following command:

```bash
npm start
