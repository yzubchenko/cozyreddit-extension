/**
 * Cozy Reddit - Improves Reddit usability and highlights new comments (with sync)
 * Author: Yury Zubchenko
 * Copyright (C) 2014  Yury Zubchenko
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * mailto: <yury.zubchenko@gmail.com>
 */
CozyReddit = {

    curCommentPos: -1,
    newCommentElems: null,
    newCommentsPadding: 10,
    newCommentsBackgroundColor : "#f6efd2",
    newCommentNumberColor : "#008000",
    navButtonsEnabled: true,
    redditUserName: null,
    arrowUpImgUrl: null,
    arrowDownImgUrl: null,
    now: new Date(),



    init: function () {
        var redditUserElem = document.getElementsByClassName("user")[0];
        if (!redditUserElem.getElementsByClassName("login-required").length) {
            CozyReddit.redditUserName = redditUserElem.getElementsByTagName("a")[0].innerHTML;
        }
        if (!CozyReddit.redditUserName) {
            //not logged in
            return;
        }

        var isCommentsPage = document.getElementsByClassName("comments-page").length;
        var isListingPage = document.getElementsByClassName("listing-page").length;

        if (!isCommentsPage && !isListingPage) {
            //no sense to do anything further. another pages is not implemented
            return;
        }
        //init persistence
        CozyRedditPersistence.init(CozyReddit.redditUserName);
        //request user from persistence. if everything is ok, start doing reddit cozier ^___^
        CozyRedditPersistence.requestRedditUser(
            function onSuccess() {
//                if (localStorage.getItem("new_comment_background_color") === null){
//                    localStorage.setItem("new_comment_background_color", "#f6efd2");
//                }
//
//                if (localStorage.getItem("new_comment_number_color") === null){
//                    localStorage.setItem("new_comment_number_color", "#008000");
//                }
//                if (localStorage.getItem("nav_buttons_enabled") === null){
//                    localStorage.setItem("nav_buttons_enabled", true);
//                }
//
//                CozyReddit.newCommentsBackgroundColor = localStorage.getItem("new_comment_background_color");
//                CozyReddit.newCommentNumberColor = localStorage.getItem("new_comment_number_color");
//                CozyReddit.navButtonsEnabled = (localStorage.getItem("nav_buttons_enabled") === "true");
                CozyReddit.addShortcuts();
                if (isCommentsPage) {
                    CozyReddit.onCommentsPage();
                } else if (isListingPage) {
                    CozyReddit.onListingPage();
                }

            },
            function onError() {
                console.error("Remote storage ERROR: User not available. Call 911... or write a letter to developer");
            }
        );
    },

    addShortcuts: function () {
        if (CozyRedditShortcut) {
            CozyRedditShortcut.add("Shift+Up", function () {
                CozyReddit.gotoPreviousComment(CozyReddit.curCommentPos);
            });
            CozyRedditShortcut.add("Shift+Down", function () {
                CozyReddit.gotoNextComment(CozyReddit.curCommentPos);
            });
        }
    },

    onCommentsPage: function () {
        var thing = document.getElementById("siteTable").getElementsByClassName("thing")[0].classList;
        var id = thing.toString().match(/_(.*?) /)[1];
        CozyRedditPersistence.requestPostLastUpdate('cc-' + id, function (postLastUpdate) {
            var count = document.getElementsByClassName("comments")[0].innerHTML.split(" ")[0];
            var commentElems = document.getElementsByClassName("noncollapsed");
            var commentTimeElem;
            var commentIdx;
            if (postLastUpdate) {
                postLastUpdate = postLastUpdate.split(',');
                for (commentIdx = 0; commentIdx < commentElems.length; commentIdx++) {
                    commentTimeElem = commentElems[commentIdx].getElementsByTagName("time");
                    if (commentTimeElem.length == 0) {
                        continue;
                    }
                    if (Date.parse(commentTimeElem[0].getAttribute("datetime")) > parseInt(postLastUpdate[0], 10)) {
                        commentElems[commentIdx].style.backgroundColor = CozyReddit.newCommentsBackgroundColor;
                        commentElems[commentIdx].className = commentElems[0].className + " newcozycomment";
                    }
                }
            } else {
                for (commentIdx = 0; commentIdx < commentElems.length; commentIdx++) {
                    commentTimeElem = commentElems[commentIdx].getElementsByTagName("time");
                    if (commentTimeElem.length == 0) {
                        continue;
                    }
                    commentElems[commentIdx].style.backgroundColor = CozyReddit.newCommentsBackgroundColor;
                    commentElems[commentIdx].className = commentElems[0].className + " newcozycomment";
                }
            }
            CozyRedditPersistence.setPostLastUpdate('cc-' + id, CozyReddit.now.getTime() + ',' + count);
            CozyReddit.newCommentElems = document.getElementsByClassName("newcozycomment");

            if (CozyReddit.newCommentElems.length > 0 && CozyReddit.navButtonsEnabled) {
                CozyReddit.appendNavButtons();    
            }
        });
    },

    onListingPage: function () {
        var thingElemList = document.getElementById("siteTable").getElementsByClassName("thing");
        var postIdArr = new Array(thingElemList.length);
        var i = 0;
        var thing, id;
        for (i; i < thingElemList.length; i++) {
            thing = thingElemList[i];
            id = thing.classList.toString().match(/_(.*?) /)[1];
            postIdArr[i] = 'cc-' + id;
        }

        CozyReddit.updatePostComments(postIdArr, thingElemList);
    },

    appendNavButtons: function() {
        var imgPrevElem = document.createElement('img');
        imgPrevElem.setAttribute("src", CozyReddit.arrowUpImgUrl);
        imgPrevElem.setAttribute("width", "24");
        imgPrevElem.setAttribute("style", "opacity:0.2; cursor: pointer;");

        var navPrevElem = document.createElement('div');
        navPrevElem.setAttribute("id","cozy-nav-prev");
        navPrevElem.addEventListener('click', function() {
            CozyReddit.gotoPreviousComment(CozyReddit.curCommentPos);
        });
        navPrevElem.addEventListener('mouseenter', function() {
            imgPrevElem.style.setProperty("opacity", "1");
        });
        navPrevElem.addEventListener('mouseleave', function() {
            imgPrevElem.style.setProperty("opacity", "0.2");
        });
        navPrevElem.appendChild(imgPrevElem);

        var imgNextElem = document.createElement('img');
        imgNextElem.setAttribute("src", CozyReddit.arrowDownImgUrl);
        imgNextElem.setAttribute("width", "24");
        imgNextElem.setAttribute("style", "opacity:0.2; cursor: pointer;");

        var navNextElem = document.createElement('div');
        navNextElem.setAttribute("id","cozy-nav-next");
        navNextElem.addEventListener('click', function() {
            CozyReddit.gotoNextComment(CozyReddit.curCommentPos);
        });
        navNextElem.addEventListener('mouseenter', function() {
            imgNextElem.style.setProperty("opacity", "1");
        });
        navNextElem.addEventListener('mouseleave', function() {
            imgNextElem.style.setProperty("opacity", "0.2");
        });
        navNextElem.appendChild(imgNextElem);

        var navElem = document.createElement('div');
        navElem.setAttribute("id","cozy-nav");
        navElem.setAttribute("style","position: fixed; bottom: 20px; right: 320px;");
        navElem.appendChild(navPrevElem);
        navElem.appendChild(navNextElem);

        document.getElementsByClassName("commentarea")[0].appendChild(navElem);
    },

    updatePostComments : function updatePostComments(postIdArr, thingElemList) {
        CozyRedditPersistence.requestPosts(postIdArr, function (knownPosts) {
            var updatedThingElems = CozyReddit.updateKnownPostComments(knownPosts, postIdArr, thingElemList);
            CozyReddit.updateUnknownPostComments(thingElemList, updatedThingElems);
        });
    },

    updateUnknownPostComments: function (thingElemList, updatedThings) {
        var thingElemIdx, commentsInnerText, commentsInnerSplit, commentsCount, newCommentsCount;
        for (thingElemIdx = 0; thingElemIdx < thingElemList.length; thingElemIdx++) {
            if (!updatedThings || updatedThings.indexOf(thingElemList[thingElemIdx]) < 0) {
                commentsInnerText = thingElemList[thingElemIdx].getElementsByClassName("comments")[0].innerHTML;
                commentsInnerSplit = commentsInnerText.split(" ");
                commentsCount = commentsInnerSplit.length == 2 ? commentsInnerSplit[0] : 0;
                if (commentsCount > 0) {
                    newCommentsCount = "(" + commentsCount + "&nbspnew)";
                    thingElemList[thingElemIdx].getElementsByClassName("comments")[0].innerHTML =
                        commentsInnerText + " <span style='color:"+ CozyReddit.newCommentNumberColor + ";'>" + newCommentsCount + "</span>";
                }
            }
        }
    },

    updateKnownPostComments: function (knownPosts, postIdArr, thingElemList) {
        if (knownPosts) {
            var updatedThingElems = new Array(knownPosts.length);
            var commentsInnerText, commentsInnerSplit, commentsCount, newCommentsCount;
            var postIdx;
            for (postIdx = 0; postIdx < knownPosts.length; postIdx++) {
                var postId = knownPosts[postIdx][0];
                var postLastUpdate = knownPosts[postIdx][1];
                var thingIdx = postIdArr.indexOf(postId);
                var thingElem = thingElemList[thingIdx];

                commentsInnerText = thingElem.getElementsByClassName("comments")[0].innerHTML;
                commentsInnerSplit = commentsInnerText.split(" ");
                commentsCount = commentsInnerSplit.length == 2 ? commentsInnerSplit[0] : 0;
                newCommentsCount = "";
                if (commentsCount > 0) {
                    if (postLastUpdate) {
                        var diff = (commentsCount - postLastUpdate.split(',')[1]);
                        if (diff > 0) {
                            newCommentsCount = "(" + diff + "&nbspnew)";
                        }
                    } else {
                        newCommentsCount = "(" + commentsCount + "&nbspnew)";
                    }
                }
                thingElem.getElementsByClassName("comments")[0].innerHTML =
                    commentsInnerText + " <span style='color:"+ CozyReddit.newCommentNumberColor + ";'>" + newCommentsCount + "</span>";
                updatedThingElems.push(thingElem);
            }
        }
        return updatedThingElems;
    },

    calculateCommentTopPos: function (comment) {
        var curTopPos = 0;
        if (comment.offsetParent) {
            do {
                curTopPos += comment.offsetTop;
            } while (comment = comment.offsetParent);

            return [curTopPos - CozyReddit.newCommentsPadding];
        }
    },

    gotoNextComment: function (pos) {
        if (CozyReddit.newCommentElems.length == 0) {
            return;
        }
        CozyReddit.curCommentPos = pos + 1;
        var comment = CozyReddit.newCommentElems[CozyReddit.curCommentPos];
        window.scrollTo(0, CozyReddit.calculateCommentTopPos(comment));

    },

    gotoPreviousComment: function (pos) {
        if (CozyReddit.newCommentElems.length == 0) {
            return;
        }
        if (pos > 0) {
            CozyReddit.curCommentPos = pos - 1;
        }
        var comment = CozyReddit.newCommentElems[CozyReddit.curCommentPos];
        window.scrollTo(0, CozyReddit.calculateCommentTopPos(comment));
    }
};

onMessage = function onMessage(message) {

    CozyReddit.arrowUpImgUrl = message[0][0];
    CozyReddit.arrowDownImgUrl = message[0][1];
    CozyReddit.newCommentsBackgroundColor = message[1][0];
    CozyReddit.newCommentNumberColor = message[1][1];
    CozyReddit.navButtonsEnabled = message[1][2];
};

CozyReddit.init();
