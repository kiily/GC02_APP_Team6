# GC02_APP_Team6

## What is BloodTestApp? 

BloodTestApp is solution for a client as part of a project in the Code4Health initiative which aims to improve healthcare by using IT. The requirements were to develop a mobile application to address the issue of test result communication which has been well documented in the scientific literature. The higher level requirements for the app were: 
  * Give patients information about their blood test
  * Reassure patients by conveying useful information through a medical professional (video format) 
  * Notify/remind users to ring their GP and collect their test results after estimating the result delivery time.
  
  ## Technologies used:
 * [Ionic 3 Framework](https://ionicframework.com/)
 * [Node.js](http://nodejs.org/)
 * [Firebase](https://firebase.google.com/)
 
## Installation Guide:
### Preparing the development environment:

* Install node.js.
* Use the node package manager to install the Angular CLI on your machine (-g stands for global installation) and check that the installation was successful.

### Installing Ionic

Install Ionic and Cordova gloabally.

```
npm install -g ionic cordova
cd GC02_APP_Team6
```

### Getting the code

* Clone this report or fork it and clone the new fork. Navigate to the SDIVisualTools folder.

```
git clone https://github.com/kiily/GC02_APP_Team6.git
cd GC02_APP_Team6
```

###  Installing the dependencies (ensure you are in the project root folder)

```
npm install
```

### Serving the App to the Ionic Lab

Renders a view in Android, iOS and Windows Phone.

```
ionic serve --lab
```
