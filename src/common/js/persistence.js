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

CozyReddit.Persistence = (function(BrowserContext) {
    var module = {},
        redditUserName = null;

    module.init = function (userName) {
        BrowserContext.apiUrl = 'http://api.cozyreddit.com/';
        redditUserName = userName;
    };

    module.setPostLastUpdate = function (postId, lastUpdate) {
        BrowserContext.apiRequest('savePost', {owner: redditUserName, postId: postId, lastUpdate : lastUpdate});
    };

    module.requestPostLastUpdate = function (postId, onComplete) {
        BrowserContext.apiRequest('findPost', {owner: redditUserName, postId: postId},
            function (response) {
                if (response.post) {
                    onComplete(response.post.lastUpdate);
                } else {
                    onComplete(null);
                }
            }
        );
    };

    module.requestPosts = function (postIdArr, pnComplete) {
        BrowserContext.apiRequest('findPosts', {owner: redditUserName, postIds : postIdArr },
            function (response) {
                if (response.posts.length > 0) {
                    var postIdx,
                        post,
                        postArr = new Array(response.posts.length);
                    for (postIdx=0; postIdx<response.posts.length; postIdx++) {
                        post = response.posts[postIdx];
                        postArr[postIdx] = [post.postId, post.lastUpdate];
                    }
                    pnComplete(postArr);
                } else {
                    pnComplete(null);
                }
            }
        );
    };

    return module;
}(CozyReddit.BrowserContext));