# Final Project README: Smart Movie Chatbot

This README will show how each module mentioned in the report can be built and tested.

The Smart Movie Chatbot have the following architectures:

- User Interface: Facebook Messenger is the main user interface for interacting with the chatbot. Users can ask questions about movies by messaging to the Facebook page called "Smart Movie Recommendations". Facebook Messenger is connect to
- IBM Cloud Functions:

## User Interface

Facebook Messenger is integrated with IBM Watson Assistant. This requires the developer to have a Meta Developer account. The IBM Watson Assistant's exported skill file can be found [here](./IBM%20Cloud/Smart-Movie-Chatbot-dialog.json).

### Building and Testing

To test of the Facebook Messenger that is connected to the IBM Watson Assistant, a series of string is sent through the interface. The replies of the chatbot are used to considered whether the dialog nodes handles the inputs correctly.

## IBM Cloud Functions

IBM Watson Assistant is programmatically called to a webhook that sends requests to external applications. The webhook we use is the IBM Cloud Functions, which is used to create web actions. The code for the web action can be found [here](./IBM%20Cloud/cloud-function-action.js).

### Building and Testing

IBM Cloud Functions automatically compiles and deploys the code. It has custom parameters where developers can set before invoking the function for testing.

## Heroku Websever

The recommendation system for the chatbot is deployed onto the Heroku Webserver. The model is trained and tested through this Python [notebook](./Creating%20Machine%20Learning%20Model.ipynb), and it is compiled and deployed with Flask framework, which can be found in this [file](./Heroku/app.py).

### Building and Testing

The Flask web application is deployed using Heroku Git, where it is compiled and built automatically to the cloud. Postman is used to test the functionalities of the web app.
