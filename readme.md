CSS Usage
=========

Overview
--------

This is a script that will iterate over the document.styleSheets object and determine what was actually used from the linked stylesheets.

#### Why did you make this?

In order to help in planning decisions, it can be useful to know which feature or bug fix will make the biggest impact.
We, up until this point, we able to know
via a variety of different sources, what CSS was declared but not necessarily what was actually used by the browser.

What it does and doesn't do
---------------------------

There are pros and cons to any approach you take to gather telemetry.
This is not the only approach we will take but thought this is a good starting point to providing our telemetry externally
for partners, other UAs, standards bodies, and web developers.

Contributing
------------

#### Getting Started

We highly recommend any advancements that you can make to the script, we only expect it to get better with the community providing pull requests.
To get started you'll need to install [node](https://nodejs.org/) and [git](http://www.git-scm.com/) then do the following:

1. Fork the repo (see this page for [help]())
2. Clone your repo
3. Change directories into the root of your cloned directory
4. Then type `npm install`
5. Finally build the application `grunt`

This will get you underway, you'll see the dependancies installed if you already haven't installed them and the page should launch to the test page.

#### Making a change

We don't want the main focus of this to change and we want the data provided on [API Usage](http://modern.status.ie) to not be affected by errors provided by contributors.
So if you are going to make a change you need to follow this process:

1. Make the change
2. Write a unit test under `\tests\unit-tests\test.js` for your change if it is necessary
3. Run the tests in Chrome/Firefox/IE/Edge and ensure that they still pass
4. Submit a pull request

#### Tips on getting a successful pull request

**Usefulness**

One very important question to ask yourself before you write any code is
> Will anyone actually use this?

There are many reasons for this:
  * We want this data to be useful to many different demographics (Standards Bodies, Browser Vendors, Web Developers, etc)
  * We don't want to provide too much data that the site becomes unusable
  * There is overhead on Microsoft to add the new data to the site in a meaningful and intutive way so every change will have to answer this question (so be prepared to defend it)
