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
CozyReddit.Options = (function(OptionsBrowserContext) {
    var module = {};
    var saveButtonElem, resetButtonElem;
    var newCommentBackgroundColorInputElem, newCommentNumberColorInputElem, newCommentStyleInputElem, navButtonsEnabledInputElem;
    var defaults = {
        newCommentBackgroundColor : 'f6efd2',
        newCommentNumberColor : '008000',
        newCommentStyle: 'solid',
        navButtonsEnabled: 'true'
    };
    module.init = function() {
        window.addEventListener('load', function() {
            newCommentBackgroundColorInputElem = document.getElementById('new_comment_background_color');
            newCommentNumberColorInputElem = document.getElementById('new_comment_number_color');
            newCommentStyleInputElem = document.getElementById('new_comment_style');
            navButtonsEnabledInputElem = document.getElementById('nav_buttons_enabled');


            saveButtonElem = document.getElementById('save_button');

            resetButtonElem = document.getElementById('reset_button');

            module.restoreOptions();

            saveButtonElem.addEventListener('click', module.saveOptions);
            resetButtonElem.addEventListener('click', module.resetDefaults);
        });
    };

    module.saveOptions = function () {
        OptionsBrowserContext.localStorage.set('new_comment_background_color', newCommentBackgroundColorInputElem.value);
        OptionsBrowserContext.localStorage.set('new_comment_number_color', newCommentNumberColorInputElem.value);
        OptionsBrowserContext.localStorage.set('new_comment_style', newCommentStyleInputElem.value);
        OptionsBrowserContext.localStorage.set('nav_buttons_enabled', navButtonsEnabledInputElem.checked);
        alert('Settings saved successfully!');
    };

    module.resetDefaults = function () {
        newCommentBackgroundColorInputElem.color.fromString(defaults.newCommentBackgroundColor);
        newCommentNumberColorInputElem.color.fromString(defaults.newCommentNumberColor);
        newCommentStyleInputElem.value = defaults.newCommentStyle;
        navButtonsEnabledInputElem.checked = defaults.navButtonsEnabled;
    };

    module.restoreOptions = function () {

        OptionsBrowserContext.localStorage.get(
            ['new_comment_background_color', 'new_comment_number_color', "new_comment_style", 'nav_buttons_enabled'],
            function (response) {
                var storageNewCommentBackgroundColor = response.data[0] ? response.data[0] : defaults.newCommentBackgroundColor;
                var storageNewCommentNumberColor = response.data[1] ? response.data[1] : defaults.newCommentNumberColor;
                var storageNewCommentStyle = response.data[2] ? response.data[2] : defaults.newCommentStyle;
                var storageNavButtonsEnabled = response.data[3] ? response.data[3] : defaults.newCommentNumberColor;

                newCommentBackgroundColorInputElem.color.fromString(storageNewCommentBackgroundColor);
                newCommentNumberColorInputElem.color.fromString(storageNewCommentNumberColor);
                newCommentStyleInputElem.value = storageNewCommentStyle;
                navButtonsEnabledInputElem.checked = (storageNavButtonsEnabled === 'true' || storageNavButtonsEnabled === true);
            }
        );
    };

    return module;
}(CozyReddit.OptionsBrowserContext));

CozyReddit.Options.init();