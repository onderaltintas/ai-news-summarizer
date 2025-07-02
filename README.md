AI News Summarizer
Project Description
This project is a Node.js utility that fetches article content from a URL and generates a concise title and summary using AI models. It is ideal for news aggregation, briefing tools, and content analysis.

Setup
To run the project on your local machine, follow these steps:

Clone the Repository:

git clone <repository-url> # Paste your repository URL here
cd ai-news-summarizer

Install Dependencies:
Install the project dependencies by running the following command:

npm install

Create .env File:
In the root directory of your project, create a file named .env and add your OpenAI API key in the following format:

OPENAI_API_KEY=YOUR_ACTUAL_OPENAI_API_KEY

Remember to replace YOUR_ACTUAL_OPENAI_API_KEY with your actual OpenAI API key.

Running the Application
After installing all dependencies and configuring the .env file, use the following command to start the application:

npm start

Once the server has successfully started, you will see the following message in your terminal:

Sunucu http://localhost:3000 adresinde çalışıyor

Open your browser and navigate to http://localhost:3000 to start using the application. Paste the news URL, specify the desired summary word count, and click the "Summarize" button. The summarized news items will be listed on the page.
