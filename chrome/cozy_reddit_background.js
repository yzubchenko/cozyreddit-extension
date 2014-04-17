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
if (localStorage.getItem("new_comment_background_color") === null){
    localStorage.setItem("new_comment_background_color", "#f6efd2");
}

if (localStorage.getItem("new_comment_number_color") === null){
    localStorage.setItem("new_comment_number_color", "#008000");
}
if (localStorage.getItem("nav_buttons_enabled") === null){
    localStorage.setItem("nav_buttons_enabled", true);
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.method == "getLocalStorage") {
        var i, data;
        if (request.keys) {
            data = new Array(request.keys.length);
            for (i = 0; i < request.keys.length; i++) {
                data[i] = localStorage[request.keys[i]];
            }
            sendResponse({data: data});
        }
    } else {
        sendResponse({});
    }
});