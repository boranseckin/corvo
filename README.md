# corvo [![Build Status](https://travis-ci.com/boranseckin/corvo.svg?branch=master)](https://travis-ci.com/boranseckin/corvo)

Corvo is a web application development playground.

## Contents

- [URL Shortener](#url-shortener)

### URL Shortener

URl Shortener is a one page app to create short and humane URLs. It has a form to submit a long URL and a reactive list to show shortened version of it. User can specify the duration of the shortened URL. All the content is stored in MongoDB.

In order to use the shortened URL, paste your 5 character code after `http://boranseckin.com/r/`. 

A running example of the shortener can be found here: http://boranseckin.com/url

## Installation

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

On Windows, use the installer can be found at https://www.meteor.com/install.

On Linux/MacOS, use this line:
```
curl https://install.meteor.com/ | sh
```
To make sure it is installed, you can run:
```
meteor -version
```

### Installing

Clone the repository:
```
git clone https://github.com/boranseckin/corvo.git
```
Inside the project folder use this line to install all npm dependencies:
```
meteor npm install
```
Finally, run:
```
meteor run
```
If you visit http://localhost:3000, you should see the app up and running.

## Built With

* [Meteor](https://www.meteor.com/) - The web framework used
* [ReactJS](https://reactjs.org/) - The user interface library used
* [MongoDB](https://www.mongodb.com/) - The database program used

## Authors

* **Boran Seckin**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
