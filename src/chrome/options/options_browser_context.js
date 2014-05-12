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

CozyReddit.OptionsBrowserContext = (function() {
    var module = {};

    module.localStorage = {
        get : function (keys, onResponse) {
            var i, data;
            if (keys) {
                data = new Array(keys.length);
                for (i = 0; i < keys.length; i++) {
                    data[i] = localStorage[keys[i]];
                }
                onResponse({data: data});
            }
        },

        set : function (key, value) {
            if (key) {
                localStorage.setItem(key, value);
            }
        }
    };

    return module;
}());
