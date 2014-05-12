cozyreddit - browser extension
====================
Highlights unread comments with synchronization between your devices (and a little more)

Read more: [cozyreddit.com](http://cozyreddit.com)

##Build:
###Dependencies:
 - [Add-on SDK](https://developer.mozilla.org/en-US/Add-ons/SDK) (that also requires [Python](https://www.python.org/). [Installation](https://developer.mozilla.org/en-US/Add-ons/SDK/Tutorials/Installation))
 - [Apache Ant](http://ant.apache.org/) (that also requires [JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html))

###How to:
 Just replace your paths in **'build.bat'** and run it!


##Code structure:
 **'/src'** directory contains all code of extension (for both browsers). 
 
 **'common'** directory is main directory of extension. It contains all browser-independent logic, that also names 'business logic'
 
 **'chrome'** and **'firefox'** directories contain all browser-dependent logic, such as context, that helps to make requests via HTTP.
 
 **'options'** directory contains sources of extension's preferences.
 ---
 If u want to use *your own data storage*, you need to change **persistense.js**, and maybe make some browser context logic for your API in **'browser_context.js'** for both browsers.

 **'background.js'** contains all logic, that content scripts can't use.
 
 **'manifest.json'** contains meta information.
 

More description will be added later.
