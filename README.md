<p align="center">
    <h1 align="center">Health AI</h1>
    <p align="center">
        <img align="center" width="70" src="./assets/icons/splash-icon.png"/>
    </p>
    <p align="center">
        Personalized AI chatbot that uses your health data to provide tailored advice and insights.
    </p>
</p>

<p align="center">
    <img alt="GitHub Release" src="https://img.shields.io/github/v/release/julien-wff/health-ai">
    <img alt="GitHub contributors" src="https://img.shields.io/github/contributors/julien-wff/health-ai">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/julien-wff/health-ai">
    <img alt="GitHub package.json prod dependency version" src="https://img.shields.io/github/package-json/dependency-version/julien-wff/health-ai/expo">
    <img alt="GitHub package.json prod dependency version" src="https://img.shields.io/github/package-json/dependency-version/julien-wff/health-ai/react-native">
</p>

## About the project

Health AI is our 8<sup>th</sup> semester research project at 🇩🇰 Aalborg University. The general theme is _Generative
AI for quantified self_.

The goal of the application is to be a personalized AI chatbot that uses your health data to provide tailored advice and
insights. The chatbot will be able to answer questions about your health, provide recommendations for improving your
well-being, and help you track your progress over time.

More specifically, there are two versions of the chatbot:

|                                                                     | Introvert                                                     | Extravert                                                                                                |
|---------------------------------------------------------------------|---------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|
| Engagement style (first message in conversation)                    | User (can have some propositions like ChatGPT)                | AI (analyze health data, talk about goals)                                                               |
| Goals and suggestions                                               | Always ask if the users want some advice before giving some   | Give advice, set goals without the user asking for it (user can still cancel or change them by chatting) |
| Tone                                                                | Neutral and objective                                         | Friendly and encouraging                                                                                 |
| Goals tracking                                                      | Only talks about it if the user asks for it                   | Remember goals, analyze progress, reacts to it                                                           |
| Notifications                                                       | Basic (e.g., ”come to talk about your health data”)           | Personalized with goals and health data                                                                  |
| If user query is impossible (talks about non-health related topics) | Just politely decline to answer, tell it’s only a health chat | Politely decline to answer, and suggest conversations topics                                             |
| Memory                                                              | Summarized conversation history                               | Complete history of all past conversations                                                               |
| Use case (implicit goal)                                            | Only user-solicited support                                   | Habits formation and continuous tracking                                                                 |

At the beginning of the two-week study, each participant is assigned one of the two versions of the chatbot. Then, after
one week and an interview, the participants switch version for the remaining week.

## Screenshots

<table>
  <tr>
    <td valign="top">
      <p align="center"><strong>Demo Video</strong></p>
      <video controls width="300" src="https://github.com/user-attachments/assets/18b93f18-821c-4c60-a1c8-7d67e6586582">
          Your browser does not support the video tag.
      </video>
    </td>
    <td valign="top">
      <p align="center"><strong>Health AI Chat (Dark Mode)</strong></p>
      <img src="https://github.com/user-attachments/assets/4077b14f-4d63-4d5a-ab9b-17ab08e3d428" alt="health-ai-chat-dark" width="300">
    </td>
  </tr>
</table>
