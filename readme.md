CSS Usage
=========

Overview
--------

This is a script that will iterate over the document.styleSheets object and determine what was actually used from the linked stylesheets.

#### Why did you make this?

In order to help in planning decisions, it can be useful to know which feature or bug fix will make the biggest impact.
Up until this point we knew what CSS was declared but not necessarily what was actually used by the browser.

What it does and doesn't do
---------------------------

There are pros and cons to any approach you take to gather telemetry.
This is not the only approach we will take and think it is a good starting point to providing our telemetry externally
for partners, other UAs, standards bodies, and web developers.

Contributing
------------

#### Getting Started

We highly recommend any advancements that you can make to the script. We expect it to only get better with the community providing pull requests.
To get started you'll need to install [node](https://nodejs.org/) and [git](http://www.git-scm.com/) then do the following:

1. Fork the repo (see this page for [help](https://help.github.com/articles/fork-a-repo/))
2. Clone your repo
3. Change directories into the root of your cloned directory
4. Then type `npm install`
5. Finally build the application `grunt`

#### Making a change

1. Make the change
2. Write a unit test under `\tests\unit-tests\test.js` for your change if it is necessary
3. Run the tests in Chrome/Firefox/Edge and ensure that they still pass
4. Submit a pull request

#### Legal

You will **need** to complete a [Contributor License Agreement (CLA)](https://cla.microsoft.com) before your pull request can be accepted. This agreement testifies that you are granting us permission to use the source code you are submitting, and that this work is being submitted under appropriate license that we can use it. The process is very simple as it just hooks into your Github account. Once we have received the signed CLA, we'll review the request. You will only need to do this once.

#### Tips on getting a successful pull request

**Usefulness**

One very important question to ask yourself before you write any code is
> Will anyone actually use this?

There are many reasons for this:
  * We want this data to be useful to many different demographics (Standards Bodies, Browser Vendors, Web Developers, etc)
  * We don't want to provide too much data that the site becomes unusable
  * There is overhead on Microsoft to add the new data to the site in a meaningful and intutive way so every change will have to answer this question (so be prepared to defend it)

### Code of Conduct
This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
