# corvo [![Build Status](https://travis-ci.com/boranseckin/corvo.svg?branch=master)](https://travis-ci.com/boranseckin/corvo) ![David](https://img.shields.io/david/boranseckin/corvo.svg)

Corvo is a web application development playground.

## Contents

- [HW Tracker](#hw-tracker)
- [URL Shortener](#url-shortener)

### HW Tracker

Homework Tracker is a one page app to keep track of assignments across multiple subjects. It provides a brief summary page with each subject's information and a thorough detail page for all listed subjects. The user can create up to 4 classes and add new assignments to those classes by filling out the modal forms at the summary (home) page. The detail pages offer lists of active assignments with the options of editing and marking them completed.

### URL Shortener

URL Shortener is a one page app to create short and humane URLs. It has a form to submit a long URL and a reactive list to show shortened version of it. User can specify the duration of the shortened URL. All the content is stored in MongoDB.

In order to use the shortened URL, paste your 5 character code after `/r/` path.
Example: `http://DOMAIN/r/SHORTENED_URL`

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

#### Using Docker

The [Dockerfile](Dockerfile) is configured for a full Meteor setup over the latest Node image. It will install Meteor and all required NPM modules, then, it will run the code.

The project is already pushed to Docker Hub. Use the code below to pull the Docker repository:
```
docker pull boranseckin/corvo:latest
```

Then, run the following code to run the project in a detached container with the port 3000 exposed:
```
docker run -d -p 3000:3000 boranseckin/corvo
```

### Testing

Meteor uses [Mocha](https://mochajs.org/) test framework and [Chai](https://www.chaijs.com/) assertion library.

To run a one time test, use this line:
```
meteor npm test
```
To run the app in "test mode" and be able to edit it while testing, use this line instead:
```
TEST_WATCH=1 meteor test --driver-package meteortesting:mocha
```

## Built With

* [Meteor](https://www.meteor.com/) - The web framework used
* [ReactJS](https://reactjs.org/) - The user interface library used
* [MongoDB](https://www.mongodb.com/) - The database program used

## Authors

* **Boran Seckin**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
