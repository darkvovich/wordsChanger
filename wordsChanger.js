/*!
 * wordsChanger - v0.1 - 2015-01-11
 * https://github.com/darkvovich/wordsChanger
 * Licensed MIT (https://github.com/darkvovich/wordsChanger/blob/master/LICENSE)
 */

(function ($) {

    $.fn.wordsChanger = function(options) {

        // default settings
        var settings = $.extend({
            chars    : 'абвгдежзийклмнопрстуфхцчшщьыъэюя',
            interval : 4000
        }, options);

        function getRandStr(len) {
            var alphabet = settings.chars,
                i, 
                str = '', 
                alp_len = alphabet.length;
            for (i = 0; i < len; i += 1) {
                str += alphabet[Math.round(Math.random() * (alp_len - 1))];
            }
            return str;
        }
        function replaceAt(str, index, character) {
            return str.substr(0, index) + character + str.substr(index+character.length);
        }
        function trimWord(word) {
            return word.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        }
        function changeWord(el, alphabet, freq, newWord, anim) {
            var chars = [],
                interval,
                clone = el.parentNode.querySelector('.js-word-changer-clone'),
                updWord = function() {
                    var rand = getRandStr(newWord.length, alphabet),
                        addChar = (freq - Math.random()) > 0,
                        resStr, char;

                    if (addChar) {
                        char = Math.round(Math.random() * (newWord.length - 1));
                        while(chars.indexOf(char) !== -1) {
                            char = Math.round(Math.random() * (newWord.length - 1));
                        }
                        chars.push(char);
                    }

                    for (var i = 0; i < chars.length; i ++) {
                        rand = replaceAt(rand, chars[i], newWord[chars[i]]);
                    }

                    el.textContent = rand;
                    if (chars.length === newWord.length) {
                        clearInterval(interval);
                    }
                };

            if (clone === null) {
                clone = el.cloneNode();
                el.parentNode.insertBefore(clone, el.nextSibling);

                clone.classList.add('js-word-changer-clone');
                clone.style.position = 'absolute';
                clone.style.left = '-9999px';
            }

            alphabet = alphabet.split('');

            //set final width for element
            clone.innerHTML = newWord;
            el.style.width = clone.offsetWidth + 'px';

            if (anim) {
                interval = setInterval(updWord, 30);
            } else {
                el.innerHTML = newWord;
            }
        }

        window.changeWord = changeWord;

        // each wordsChanger
        return this.each(function() {
            var wordsParsed = $(this).attr('data-words'),
                word = $(this).find('i'),
                alphabet = settings.chars;

            if (wordsParsed) {

                var wordsList = wordsParsed.split(','),
                    wordsLength = wordsList.length,
                    word_i = 1,
                    prev_t = 0;

                function changeLoop(t) {
                    requestAnimationFrame(changeLoop);

                    if (t - prev_t < 3000) {
                        return;
                    }

                    prev_t = t;

                    if (word_i >= wordsLength) {
                        word_i = 0;
                    }

                    changeWord(word[0], alphabet, 0.7, trimWord(wordsList[word_i]), true);
                    word_i ++;
                }
                changeWord(word[0], alphabet, 0, trimWord(wordsList[0]), false);
                requestAnimationFrame(changeLoop);

            }
        });

    };

}(jQuery));
