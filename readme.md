CSS Usage
=========

Overview
--------

This is a script that will iterate over the document.styleSheets object and determine what was actually used on the current page.
Additionally it will loop over the DOM and determine any inline styles.

#### Why did you make this

On the layout team we had ways of knowing, thanks to the Bing crawler, what properties were declared on sites. This however doesn't help us know which ones were actually
used on the site. Because of this we had to devise a way to get this information. Now you may be thinking, "Why not just build that into your browser," and we are but we
wanted a way to run this on any browser and leverage that vendor's CSS parser to show interop differences.

What it does and doesn't do
---------------------------

It will iterate on the current top level page (this means that it will not parse stylesheets inside of an iframe) and and provide usage by taking the selectorText 
and querying to see if there are any elements that would have needed to render this property. This of course leaves holes, here are some:

* It can't actually determine the what would have won without building out a full CSS parser in JS, which defeats part of the reasons we made this, so take the counts with a grain of salt. At minimum it would have been 1.
* It currently can't track properties and values that are inside of the @keyframes rule ([view issue](https://github.com/gregwhitworth/css-usage/issues/3))
* It doesn't get anything behind authentication

Contributing
------------

#### Getting Started

We highly recommend any advancements that you can make to the script, we only expect it to get better with the community providing pull requests. To get started you'll need
to install [node](https://nodejs.org/) and [git](http://www.git-scm.com/) then do the following:

1. Open the git bash and clone the repo by typing `git clone https://github.com/gregwhitworth/css-usage.git`
2. Then `cd css-usage`
3. Then type `npm install`
4. Finally build the application `grunt`

This will get you underway, you'll see the dependancies installed if you already haven't already installed them and the page should launch to the test page.

#### Making a change

We don't want the main focus of this to change and we want the data provided on [SITE NAME HERE](http://modern.status.ie) to not be affected by errors provided by contributors. So 
if you are going to make a change you need to follow this process:

1. Make the change
2. Write a unit test under \tests\test.js for your change if it is necessary
3. Run the tests in Chrome/Firefox/IE/Edge and ensure that they still pass
4. Submit a pull request