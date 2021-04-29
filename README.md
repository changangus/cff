# Community Fridge Finder

## Overview

Application for finding and getting directions to a community fridge near you.

## TECH STACK

  - React (Next.js)
  - AWS S3
  - Typescript
  - Graphql
  - Node
  - Express
  - Apollo 
  - MongoDB
  
## Using the application

###### Homepage

The homepage directly gives you access to the map with all the fridges from the database to get directions, information or social media links.

<img src="https://live.staticflickr.com/65535/51146552362_1dbffd0d32_b.jpg" width=500 alt="Homepage">

###### Register 

The button in the top right hand corner gives you access to the login form and a register link which will provide the form below to register as a user.

<img src="https://live.staticflickr.com/65535/51148010349_73e0685df5_c.jpg" width=500 alt="Register">

###### Login

Registering will log you in and start a session, but if your session expires or you logout you can log back in with the login form. 

<img src="https://media.giphy.com/media/fbso298DmmTYm1eihc/giphy.gif" width=500 alt="Login gif" >

###### Find a Fridge

To search for a fridge in your area all you need to do is enter your location into the search bar. The search bar provides autocomplete suggestions and the map will show you all fridges nearby your entered search. Click on a marker to see more information including directions and social media links.

<img src="https://media.giphy.com/media/I3yjgxCBxI2TxoZBaX/giphy.gif" width=500 alt="search for fridge gif" >

###### Access profile

Click on the profile icon in the corner to access your profile, here you can update any information on your account or delete your account entirely.

<img src="https://media.giphy.com/media/DBuBHeJAlaoefDizcH/giphy.gif" width=500 alt="edit profile gif" >

###### Add a Fridge

To add a fridge you must be logged in, click on the add a fridge button and fill out the form that is shown below. This form allows image file uploads which are connected to an s3 bucket on aws.

<img src="https://live.staticflickr.com/65535/51147226866_1f44873d46_c.jpg" width=500 alt="Add new fridge">

###### Edit or delete fridges

You can access all of the fridges you have added from your profile page. Click the edit or delete button to make changes to the fridges you have added.

<img src="https://media.giphy.com/media/dp7cK3nA4RNCsxRnfb/giphy.gif" width=500 alt="Edit/Delete fridge gif" >

## View Live 

Live version: https://cff-kctaciszl-changangus.vercel.app/

## Dependencies

  ###### Front end:
  
  - material-ui
  - urql 
  - formik
  - graphql
  - next
  - next-urql
  - react
  
  ###### Back end
  
  - apollo-server-express
  - argon2
  - aws-sdk
  - ioredis
  - express
  - express-session
  - graphql
  - mongoose
  - multer
  - multer-s3
  - nodemailer
  - reflectmetadata
  - typegraphql
  - typegoose
  - typescript
  - uuid



