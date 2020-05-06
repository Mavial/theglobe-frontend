# TheGlobe_Frontend
The Globe (TG) is a Website, allowing you to browse news in a new way. We gather news through RSS Feeds from Newspapers, and display them on a WebGL globe. 

---

**Table of Contents**

- [Quick Start](#quick-start)
  - [Local Installation](#local-installation)
  - [Simulate deployment using docker](#simulate-deployment-using-docker)
- [Components](#components)
- [Project Structure](#structure)
- [Functions](#functions)

## Quick Start

### Local Installation
The following shows how to install the app on your local machine for development purpose.

#### Requirements
-  Node >= 8.10
-  npm >= 5.6

#### Clone Repo
```bash
$ git clone https://git.lrsv.de/globe/globe_frontend.git
$ cd globe_frontend
```

#### Initial Installation
The `package-lock.json` contains all the needed dev dependencies for this project. To install these:

```bash
$ npm install
```

#### Run the App
After the installation you can start the app in local network:

```bash
$ npm start
```
or if you've installed yarn
```bash
$ yarn start
```

After the development server started the app will be available under [localhost:3000](http://localhost:3000)

### Simulate deployment using docker

Since the app will be deployed with docker using the `Dockerfile` allows you to build and tag a Docker image:
```bash
$ docker build -t theglobe_frontend .
```
Run the container:
```bash
$ docker run -p 1337:80 theglobe_frontend
```

Navigate to [localhost:1337](http://localhost:1337) in your browser to view the app.

## Deployment

Please take a look at our [CI/CD system](https://git.lrsv.de/globe/management/-/blob/master/CICD.md), which we use to deploy our applications.

## Components

The Globe Frontend is a single-page application and was built with [ReactJS](https://reactjs.org/). Since The Globe Backend is only for fetching data we've used [Create React App](https://github.com/facebook/create-react-app). That gave us a ready-made environment so we didn't had to worry about the backbone of the frontend. 

**Main React Components**

- [React GlobeGL](https://github.com/vasturiano/react-globe.gl/)
  A React component for data visualization on a three-dimensional globe. The component itself uses [ThreeJS](https://threejs.org/) as rendering engine.

- [MDBootstrap](https://mdbootstrap.com/)
  A design framework used to shape the news feed.

**Other components**

- [react-loading-screen](https://www.npmjs.com/package/react-loading-screen)
- [react-clamp-lines](https://www.npmjs.com/package/react-clamp-lines)
- [source-map-explorer](https://www.npmjs.com/package/source-map-explorer)

## Structure

Components and CSS files are located inside the `src` folder, as well as assets, datasets or other files.

The `index.js` is the top-level render of the React app and imports the `<App />` component, which is the main app component. 

Inside `App.js` all self-produced components are being imported from `src/components/`.

The following describes the nested architecture of the app.

- `App.js`
  - `Globe.js`
  - `UpdateSize.js`
  - `Feed.js`
    - `Article.js`
    - `Country.js`

## Functions