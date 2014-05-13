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

var CozyReddit = CozyReddit || {};

/**
 * Required modules: Persistence, Widgets, Shortcut, BrowserContext
 */
CozyReddit.Main = (function(Persistence, Widgets, Shortcut, BrowserContext) {
    var module = {},
        curCommentPos = -1,
        newCommentElems = null,
        newCommentsPadding = 10,
        newCommentsBackgroundColor = '#f6efd2',
        newCommentNumberColor = '#008000',
        newCommentStyle = 'line',
        navButtonsEnabled = true,
        navButtonsDisplayed = false,
        navButtons = null,
        redditUserName = null,
        pageType = null,
        now = new Date();

    module.init = function () {
        BrowserContext.init();
        checkUpdate(function(update) {
            document.getElementsByTagName('body')[0].appendChild(
                Widgets.buildUpdateNews(update)
            );
        });
        //check logged in
        if (!acquireUserName()) {
            return;
        }
        //check page type
        if (!acquirePageType()) {
            return;
        }

        Persistence.init(redditUserName);
        //start doing reddit cozier ^____^
        processPage();
    };

    function checkUpdate(onUpdated) {
        //request update JSON
        BrowserContext.getResourceUrl('res/json/update_info.json', function(updateInfoUrl) {
            BrowserContext.requestJson(updateInfoUrl, function(json) {
                //check last update index
                BrowserContext.localStorage.get(
                    ['update_index'],
                    function (response) {
                        if (response.data[0] != null) {
                            var curUpdateIndex = parseInt(response.data[0],10);
                            if (curUpdateIndex !== json.index) {
                                onUpdated(json);
                            }
                        }
                        BrowserContext.localStorage.set('update_index', json.index);
                    }
                );
            });

        });

    }

    function acquireUserName () {
        var redditUserElem = document.getElementsByClassName('user')[0];
        if (!redditUserElem.getElementsByClassName('login-required').length) {
            redditUserName = redditUserElem.getElementsByTagName('a')[0].textContent;
            return true;
        }
        return false;
    }

    function acquirePageType () {
        if (document.getElementsByClassName('comments-page').length > 0) {
            pageType = 'comment-page';
            return true;
        } else if (document.getElementsByClassName('listing-page').length && document.getElementsByClassName('comments').length) {
            pageType = 'listing-page';
            return true;
        } else {
            return false;
        }
    }

    function processPage () {
        BrowserContext.localStorage.get(
            ['new_comment_background_color', 'new_comment_number_color', "new_comment_style", 'nav_buttons_enabled'],
            function (response) {
                newCommentsBackgroundColor = response.data[0];
                newCommentNumberColor = response.data[1];
                newCommentStyle = response.data[2];
                navButtonsEnabled = (response.data[3] === 'true' || response.data[3] === true);

                addShortcuts();
                if (pageType === 'comment-page') {
                    onCommentsPage();
                } else if (pageType === 'listing-page') {
                    onListingPage();
                }
            }
        );
    }

    function addShortcuts () {
        Shortcut.add('Shift+Up', function () {
            gotoPreviousComment();
        });
        Shortcut.add('Shift+Down', function () {
            gotoNextComment();
        });
    }

    function showNavButtons() {
        BrowserContext.getResourceUrl('res/img/arrow-up.png', function (arrowUpUrl) {
            BrowserContext.getResourceUrl('res/img/arrow-down.png', function (arrowDownUrl) {
                navButtons = Widgets.buildNavButtons(
                    arrowUpUrl,
                    arrowDownUrl,
                    gotoPreviousComment,
                    gotoNextComment
                );
                document.getElementsByClassName('commentarea')[0].appendChild(navButtons);
                navButtonsDisplayed = true;
            });
        });
    }

    function onCommentsPage () {
        var thing = document.getElementById('siteTable').getElementsByClassName('thing')[0].classList;
        var postId = thing.toString().match(/_(.*?) /)[1];
        Persistence.requestPostLastUpdate('cc-' + postId, function (postLastUpdate) {
            var commentCount = parseInt(document.getElementsByClassName('comments')[0].textContent.split(' ')[0]) || 0;
            var commentElems = document.getElementsByClassName('comment');
            var commentIdx, commentElem, commentTimeElem, postLastUpdateTime, commentTime;
            var postLastUpdateCount = 0;
            if (postLastUpdate) {
                var postLAstUpdateArr = postLastUpdate.split(',');
                postLastUpdateTime =  parseInt(postLAstUpdateArr[0], 10);
                try {
                    postLastUpdateCount = parseInt(postLAstUpdateArr[1], 10);
                } catch (ex) {
                    //do nothing count===0, html parse in old versions bug
                }
            }
            for (commentIdx = 0; commentIdx < commentElems.length; commentIdx++) {
                handleComment(postLastUpdateTime, commentElems[commentIdx]);
            }
            newCommentElems = document.getElementsByClassName('cozy-newcomment');
            if (commentCount > postLastUpdateCount) {
                Persistence.setPostLastUpdate('cc-' + postId, now.getTime() + ',' + commentCount);
            }

            if (newCommentElems.length > 0) {
                if (navButtonsEnabled) {
                    showNavButtons();
                }
                if (postLastUpdateTime && !isScrolledIntoView(newCommentElems[0])) {
                    gotoNextComment();
                }
            }
            observePageChildList(commentCount, postId, postLastUpdateTime);
        });

    }

    function onListingPage () {
        var commentsElemList = document.getElementById('siteTable').getElementsByClassName('comments');
        var postIdArr = new Array(commentsElemList.length);
        var i = 0;
        var thingElemList = document.getElementById('siteTable').getElementsByClassName('thing');
        var id, counter = 0;
        for (i; i < thingElemList.length; i++) {
            if (thingElemList[i].getElementsByClassName('comments').length > 0) {
                id = thingElemList[i].classList.toString().match(/_(.*?) /)[1];
                postIdArr[counter] = 'cc-' + id;
                counter++;
            }
        }

        updatePostComments(postIdArr, commentsElemList);
    }

    function handleComment (postLastUpdateTime, commentElem) {
        var commentTimeElem, commentTime, noncollapsed, entry;
        noncollapsed = commentElem.getElementsByClassName("noncollapsed")[0];
        commentTimeElem = noncollapsed.getElementsByTagName('time');
        if (commentTimeElem.length == 0) {
            return;
        }
        commentTime = Date.parse(commentTimeElem[0].getAttribute('datetime'));
        if (!postLastUpdateTime || commentTime > postLastUpdateTime) {
            if (newCommentStyle === 'solid') {
                noncollapsed.style.backgroundColor = newCommentsBackgroundColor;
                noncollapsed.className = noncollapsed.className + ' cozy-newcomment';
            } else if (newCommentStyle === 'line') {
                entry = commentElem.getElementsByClassName("entry")[0];
                entry.style.borderLeft = "4px solid" + newCommentsBackgroundColor;
                entry.style.borderRadiusTopleft = "4px";
                entry.style.borderRadiusBottomleft = "4px";
                entry.style.paddingLeft = "4px";
                entry.className = entry.className + ' cozy-newcomment';
            } else {
                console.error("Unknown comment style");
            }
            return true;
        }
        return false;

    }

    function observePageChildList (commentCount, id, postLastUpdateTime) {
        var noncollapsedCommentCount = document.getElementsByClassName('noncollapsed').length;
        var commentArea = document.getElementsByClassName('commentarea')[0];
        var observer = new MutationObserver(function (mutations) {
            var i, node, commentTimeElem, commentTime, commentElem;
            var needSave = false;
            var needShowNavButtons = false;
            mutations.forEach(function (mutation) {
                if (mutation.addedNodes) {
                    for (i = 0; i < mutation.addedNodes.length; ++i) {
                        node = mutation.addedNodes[i];
                        if (node instanceof Element) {
                            if (isNewCommentElem(node)) {
                                if (document.getElementsByClassName('noncollapsed').length > noncollapsedCommentCount) {
                                    commentCount++;
                                    noncollapsedCommentCount++;
                                    needSave = true;
                                }
                            } else if (isExpandedComment(node)) {
                                needShowNavButtons = needShowNavButtons || handleComment(postLastUpdateTime, node);
                            }
                        }
                    }
                }
            });
            if (needSave) {
                now = new Date();
                Persistence.setPostLastUpdate('cc-' + id, now.getTime() + ',' + commentCount);
                needSave = false;
            }
            if (needShowNavButtons && navButtonsEnabled && !navButtonsDisplayed) {
                showNavButtons();
            }
        });
        observer.observe(commentArea, { subtree: true, childList: true });
    }

    function isNewCommentElem (elem) {
        return elem.classList.contains('thing') &&
            elem.classList.contains('odd') &&
            elem.classList.contains('comment');
    }

    function isExpandedComment (elem) {
        return elem.classList.contains('thing') &&
            !elem.classList.contains('odd') &&
            elem.classList.contains('comment');
    }

    function isScrolledIntoView (elem) {
        var docViewTop = window.screenTop;
        var docViewBottom = docViewTop + window.innerHeight;

        var elemTop = elem.offsetTop;
        var elemBottom = elemTop + elem.offsetHeight;

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }

    function updatePostComments(postIdArr, commentsElemList) {
        Persistence.requestPosts(postIdArr, function (knownPosts) {
            var updatedCommentsElems = updateKnownPostComments(knownPosts, postIdArr, commentsElemList);
            updateUnknownPostComments(commentsElemList, updatedCommentsElems);
        });
    }

    function updateKnownPostComments (knownPosts, postIdArr, commentsElemList) {
        if (knownPosts) {
            var updatedCommentsElems = new Array(knownPosts.length);
            var commentsTextContent, commentsInnerSplit, commentsCount, newCommentsCount;
            var postIdx;
            for (postIdx = 0; postIdx < knownPosts.length; postIdx++) {
                var postId = knownPosts[postIdx][0];
                var postLastUpdate = knownPosts[postIdx][1];
                var idx = postIdArr.indexOf(postId);
                var commentsElem = commentsElemList[idx];

                commentsTextContent = commentsElem.textContent;
                commentsInnerSplit = commentsTextContent.split(' ');
                commentsCount = commentsInnerSplit.length == 2 ? commentsInnerSplit[0] : 0;
                newCommentsCount = '';
                if (commentsCount > 0) {
                    if (postLastUpdate) {
                        var diff = (commentsCount - postLastUpdate.split(',')[1]);
                        if (diff > 0) {
                            newCommentsCount = ' (' + diff + ' new)';
                        }
                    } else {
                        newCommentsCount = ' (' + commentsCount + ' new)';
                    }
                }

                var unreadNumberSpan = document.createElement('span');
                unreadNumberSpan.style.setProperty("color", newCommentNumberColor, "");
                unreadNumberSpan.textContent = newCommentsCount;
                commentsElem.appendChild(unreadNumberSpan);

                updatedCommentsElems.push(commentsElem);
            }
        }
        return updatedCommentsElems;
    }

    function updateUnknownPostComments (commentsElemList, updatedCommentsElemList) {
        var idx, commentsInnerText, commentsInnerSplit, commentsCount, newCommentsCount;
        for (idx = 0; idx < commentsElemList.length; idx++) {
            if (!updatedCommentsElemList || updatedCommentsElemList.indexOf(commentsElemList[idx]) < 0) {
                commentsInnerText = commentsElemList[idx].textContent;
                commentsInnerSplit = commentsInnerText.split(' ');
                commentsCount = commentsInnerSplit.length == 2 ? commentsInnerSplit[0] : 0;
                if (commentsCount > 0) {
                    newCommentsCount = ' (' + commentsCount + ' new)';
                    var unreadNumberSpan = document.createElement('span');
                    unreadNumberSpan.style.setProperty("color", newCommentNumberColor, "");
                    unreadNumberSpan.textContent = newCommentsCount;
                    commentsElemList[idx].appendChild(unreadNumberSpan);
                }
            }
        }
    }



    function calculateCommentTop (comment) {
        var curTopPos = 0;
        if (comment.offsetParent) {
            do {
                curTopPos += comment.offsetTop;
            } while (comment = comment.offsetParent);

            return [curTopPos - newCommentsPadding];
        }
    }

    function gotoNextComment () {
        if (!newCommentElems || newCommentElems.length == 0) {
            return;
        }
        if (curCommentPos < (newCommentElems.length-1)) {
            curCommentPos++;
        }
        var comment = newCommentElems[curCommentPos];
        if (!comment) {
            return;
        }
        var commentTop = calculateCommentTop(comment);
        window.scrollTo(0, commentTop);

    }

    function gotoPreviousComment () {
        if (!newCommentElems || newCommentElems.length == 0) {
            return;
        }
        if (curCommentPos > 0) {
            curCommentPos--;
        }
        var comment = newCommentElems[curCommentPos];
        if (!comment) {
            return;
        }
        var commentTop = calculateCommentTop(comment);
        window.scrollTo(0, commentTop);
    }

    return module;
}(CozyReddit.Persistence, CozyReddit.Widgets, CozyReddit.Shortcut, CozyReddit.BrowserContext));

CozyReddit.Main.init();