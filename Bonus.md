Bonus: Future Model Training Pipeline
The dashboard features a thumbs up/down feedback mechanism that logs user interactions into a ContentFeedback database table. This data is the foundation for an RLHF (Reinforcement Learning from Human Feedback) training pipeline to improve future AI curations.

How it works:

1. Data Collection: Every time a user votes, the system stores the UserId, ContentType (e.g., Meme, Insight, News), the specific ContentReference (the text or URL), and the boolean label IsPositive (true/false).

2. Context Enrichment: Periodically, a scheduled data pipeline extracts these interactions and joins them with the user's saved UserPreference (investor type, selected coins) to build a rich context profile of who liked what.

3. Model Fine-Tuning: The resulting dataset can be transformed into instruction-output pairs. Using techniques like LoRA (Low-Rank Adaptation) on open-source LLMs (such as LLaMA-3 or Mistral), the model can be fine-tuned to naturally align its tone and content selection with what users consistently upvote (e.g., providing more technical analysis for "Day Traders", or broader macro summaries for "HODLers").

4. Recommendation System (Collaborative Filtering): For non-LLM content like Memes and News, the boolean feedback matrix can be fed into a collaborative filtering algorithm to push articles/memes that were highly rated by similar users to the top of the feed, maximizing daily engagement.