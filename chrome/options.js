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
function saveOptions() {
    var newCommentBackgroundColorInput = document.getElementById("new_comment_background_color");
    var newCommentNumberColorInput = document.getElementById("new_comment_number_color");
    var navButtonsEnabled = document.getElementById("nav_buttons_enabled");

    localStorage["new_comment_background_color"] = newCommentBackgroundColorInput.value;
    localStorage["new_comment_number_color"] = newCommentNumberColorInput.value;
    localStorage["nav_buttons_enabled"] = navButtonsEnabled.checked;
    alert("Settings saved successfully!");
}

function restoreOptions() {
    var newCommentBackgroundColorInput = document.getElementById("new_comment_background_color");
    var newCommentNumberColorInput = document.getElementById("new_comment_number_color");
    var navButtonsEnabled = document.getElementById("nav_buttons_enabled");

    newCommentBackgroundColorInput.value = localStorage["new_comment_background_color"];
    newCommentNumberColorInput.value = localStorage["new_comment_number_color"];
    navButtonsEnabled.checked = localStorage["nav_buttons_enabled"] === "true";
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save_button').addEventListener('click', saveOptions);