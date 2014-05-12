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

CozyReddit.Widgets = (function() {
    var module = {};

    module.buildNavButtons = function(arrowUpImgUrl, arrowDownImgUrl, onPrevButtonCick, onNextButtonCick) {
        var imgPrevElem = document.createElement('img');
        imgPrevElem.setAttribute("src", arrowUpImgUrl);
        imgPrevElem.setAttribute("width", "24");
        imgPrevElem.setAttribute("style", "opacity:0.2; cursor: pointer;");

        var navPrevElem = document.createElement('div');
        navPrevElem.setAttribute("id","cozy-nav-prev");
        navPrevElem.addEventListener('click', function() {
            onPrevButtonCick();
        });
        navPrevElem.addEventListener('mouseenter', function() {
            imgPrevElem.style.setProperty("opacity", "1");
        });
        navPrevElem.addEventListener('mouseleave', function() {
            imgPrevElem.style.setProperty("opacity", "0.2");
        });
        navPrevElem.appendChild(imgPrevElem);

        var imgNextElem = document.createElement('img');
        imgNextElem.setAttribute("src", arrowDownImgUrl);
        imgNextElem.setAttribute("width", "24");
        imgNextElem.setAttribute("style", "opacity:0.2; cursor: pointer;");

        var navNextElem = document.createElement('div');
        navNextElem.setAttribute("id","cozy-nav-next");
        navNextElem.addEventListener('click', function() {
            onNextButtonCick();
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

        return navElem;
    };

    module.buildUpdateNews = function (update) {
        var updateElem = document.createElement('div');
        updateElem.setAttribute("id", "cozy-update");
        updateElem.setAttribute("style",
                "width: 300px; height: 200px; background-color: #fff; position: fixed; " +
                "padding: 20px 5px 5px 5px; bottom: 0; left: 0; border: 1px solid #c0c0c0; " +
                "box-shadow: 3px -3px 5px 0px rgba(50, 50, 50, 0.4);"
        );

        var updateHeaderElem = document.createElement('p');
        updateHeaderElem.setAttribute("id", "cozy-update-header");
        updateHeaderElem.setAttribute("style", "font: bold 20px 'Courier new'; line-height: 20px;");
        updateHeaderElem.innerHTML = "Cozy Reddit updated!";
        updateElem.appendChild(updateHeaderElem);

        var updateSubHeaderElem = document.createElement('p');
        updateSubHeaderElem.setAttribute("id", "cozy-update-subheader");
        updateSubHeaderElem.setAttribute("style", "font: 15px 'Courier new'; line-height: 40px;");
        updateSubHeaderElem.innerHTML = "version: " + update.version;
        updateElem.appendChild(updateSubHeaderElem);

        var updateSubSubHeaderElem = document.createElement('p');
        updateSubSubHeaderElem.setAttribute("id", "cozy-update-subsubheader");
        updateSubSubHeaderElem.setAttribute("style", "font: bold 15px 'Courier new'; line-height: 20px;");
        updateSubSubHeaderElem.innerHTML = "What's new: ";
        updateElem.appendChild(updateSubSubHeaderElem);

        var updateTextAreaElem = document.createElement('textarea');
        updateTextAreaElem.setAttribute("id", "cozy-update-textarea");
        updateTextAreaElem.setAttribute("readonly", "true");
        updateTextAreaElem.setAttribute("style", "width: 295px; height: 115px; resize: none; font: 12px 'Courier new';");
        var i, updateNews = "";
        for (i = 0; i < update.news.length; i++) {
            updateNews += update.news[i] + "\n";
        }
        updateTextAreaElem.value = updateNews;
        updateElem.appendChild(updateTextAreaElem);

        var closeElem = document.createElement('div');
        closeElem.setAttribute("style",
            "position: absolute; right: 5px; top: 5px; font: 15px 'Courier new'; color: #0000ff; cursor: pointer;"
        );
        closeElem.innerHTML = "[close]";
        closeElem.addEventListener('click', function() {
            updateElem.remove();
        });

        updateElem.appendChild(closeElem);
        return updateElem;
    };

    return module;

}());