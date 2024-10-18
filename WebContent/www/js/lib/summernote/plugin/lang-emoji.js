(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('jquery'));
    } else {
        factory(window.jQuery);
    }
}(function ($) {
    $.extend($.summernote.plugins, {
        'emoji': function (context) {
            var self = this;
            var KEY_ESC = 27;
            var KEY_TAB = 9;
            var ui = $.summernote.ui;
            var icons = {};
            var reverseIcons = {};
            var editorId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            var chunk = function (val, chunkSize) {
                var R = [];
                for (var i = 0; i < val.length; i += chunkSize)
                    R.push(val.slice(i, i + chunkSize));
                return R;
            };
            /*IE polyfill*/
            if (!Array.prototype.filter) {
                Array.prototype.filter = function (fun /*, thisp*/) {
                    var len = this.length >>> 0;
                    if (typeof fun != "function")
                        throw new TypeError();

                    var res = [];
                    var thisp = arguments[1];
                    for (var i = 0; i < len; i++) {
                        if (i in this) {
                            var val = this[i];
                            if (fun.call(thisp, val, i, this))
                                res.push(val);
                        }
                    }
                    return res;
                };
            }

            var addListener = function () {
                var $body = $('body');
                $body.on('keydown', function(e) {
                    if (e.keyCode === KEY_ESC || e.keyCode === KEY_TAB) {
                        self.$panel.hide();
                    }
                });
                $body.on('mouseup', function(e) {
                    e = e.originalEvent || e;
                    var target = e.target || window;
                    if ($(target).hasClass('emoji-picker') || $(target).hasClass('emoji-menu-tab')) {
                        return;
                    }
                    self.$panel.hide();
                });
                $body.on('click', '.' + editorId + ' .emoji-menu-tab', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var index = 0;
                    var curclass = $(this).attr("class").split(' ');
                    curclass = curclass[1].split('-');
                    if(curclass.length===3) return;
                    curclass = curclass[0]+'-'+curclass[1];
                    $('.' + editorId + ' .emoji-menu-tabs td').each(function(i){
                        var $a = $(this).find('a');
                        var aclass = $a.attr("class").split(' ');
                        aclass = aclass[1].split('-');
                        aclass = aclass[0]+'-'+aclass[1];
                        if(curclass === aclass){
                            $a.attr('class', 'emoji-menu-tab '+aclass+'-selected');
                            index = i;
                        }else{
                            $a.attr('class', 'emoji-menu-tab '+aclass);
                        }
                    });
                    updateEmojisList(index);
                });
                $(document).on('click', '.' + editorId + ' .emoji-items a', function(){
                    var emoji = $('.label', $(this)).text();
                    if (document.emojiType === 'unicode') {
                        context.invoke('editor.insertText', colonToUnicode(emoji));
                    } else {
                        var $img = $(createdEmojiIcon(self.icons[emoji]));
                        if ($img[0].attachEvent) {
                            $img[0].attachEvent('onresizestart', function(e) {
                                e.returnValue = false;
                            }, false);
                        }
                        context.invoke('editor.insertNode', $img[0]);
                    }
                    ConfigStorage.get('emojis_recent', function(curEmojis) {
                        curEmojis = curEmojis || Config.defaultRecentEmojis || [];
                        var pos = curEmojis.indexOf(emoji);
                        if (!pos) {
                            return false;
                        }
                        if (pos !== -1) {
                            curEmojis.splice(pos, 1);
                        }
                        curEmojis.unshift(emoji);
                        if (curEmojis.length > 42) {
                            curEmojis = curEmojis.slice(42);
                        }
                        ConfigStorage.set({
                            emojis_recent : curEmojis
                        });
                    });
                });
            };
            var loadEmojis = function () {
                var column, dataItem, hex, i, icons, j, name, reverseIcons, row, totalColumns;
                i = void 0;
                j = void 0;
                hex = void 0;
                icons = {};
                reverseIcons = {};
                name = void 0;
                dataItem = void 0;
                row = void 0;
                column = void 0;
                totalColumns = void 0;
                j = 0;
                while (j < Config.EmojiCategories.length) {
                    totalColumns = Config.EmojiCategorySpritesheetDimens[j][1];
                    i = 0;
                    while (i < Config.EmojiCategories[j].length) {
                        dataItem = Config.Emoji[Config.EmojiCategories[j][i]];
                        name = dataItem[1][0];
                        row = Math.floor(i / totalColumns);
                        column = i % totalColumns;
                        icons[':' + name + ':'] = [j, row, column, ':' + name + ':'];
                        reverseIcons[name] = dataItem[0];
                        i++;
                    }
                    j++;
                }
                self.icons = icons;
                self.reverseIcons = reverseIcons;
                if (!Config.rx_codes) {
                    Config.init_unified();
                }
            };
            var updateEmojisList = function (index) {
                var $items = $('.' + editorId + ' .emoji-items');
                $items.html('');
                if(index > 0) {
                    $.each(self.icons, function (key, icon) {
                        if (self.icons.hasOwnProperty(key)
                            && icon[0] === (index - 1)) {
                            $items.append('<a href="javascript:void(0)" title="'
                                + Config.htmlEntities(key) + '">'
                                + createdEmojiIcon(icon, true)
                                + '<span class="label hidden">' + Config.htmlEntities(key)
                                + '</span></a>');
                        }
                    });
                }else{
                    ConfigStorage.get('emojis_recent', function(curEmojis) {
                        curEmojis = curEmojis || Config.defaultRecentEmojis || [];
                        var key, i;
                        for (i = 0; i < curEmojis.length; i++) {
                            key = curEmojis[i];
                            if (self.icons[key]) {
                                $items.append('<a href="javascript:void(0)" title="'
                                    + Config.htmlEntities(key) + '">'
                                    + createdEmojiIcon(self.icons[key], true)
                                    + '<span class="label hidden">' + Config.htmlEntities(key)
                                    + '</span></a>');
                            }
                        }
                    });
                }
            };
            var createdEmojiIcon = function(emoji){
                var category = emoji[0];
                var row = emoji[1];
                var column = emoji[2];
                var name = emoji[3];
                var filename = document.emojiSource + '/emoji_spritesheet_!.png';
                var blankGifPath =document.emojiSource + '/blank.gif';
                var iconSize = 25;
                var xoffset = -(iconSize * column);
                var yoffset = -(iconSize * row);
                var scaledWidth = (Config.EmojiCategorySpritesheetDimens[category][1] * iconSize);
                var scaledHeight = (Config.EmojiCategorySpritesheetDimens[category][0] * iconSize);

                var style = 'display:inline-block;';
                style += 'width:' + iconSize + 'px;';
                style += 'height:' + iconSize + 'px;';
                style += 'background:url(\'' + filename.replace('!', category) + '\') '
                    + xoffset + 'px ' + yoffset + 'px no-repeat;';
                style += 'background-size:' + scaledWidth + 'px ' + scaledHeight
                    + 'px;';
                return '<img src="' + blankGifPath + '" class="img" style="'
                    + style + '" alt="' + Config.htmlEntities(name) + '">';
            };
            var colonToUnicode = function(emoij) {
                return emoij.replace(Config.rx_colons, function(m) {
                    var val;
                    val = Config.mapcolon[m];
                    if (val) {
                        return val;
                    } else {
                        return '';
                    }
                });
            };

            context.memo('button.emoji', function () {
                if(document.emojiButton === undefined)
                    document.emojiButton = 'fa fa-smile';
                var button = ui.button({
                    contents: '<i class="' + document.emojiButton + ' emoji-picker-container emoji-picker"></i>',
                    click: function () {
                        if(document.emojiSource === undefined)
                            document.emojiSource = '';
                        if(document.emojiType === undefined)
                            document.emojiType = '';

                        var width = self.$panel.width();
                        if(width > self.$panel.position().left){
                            self.$panel.css({left: '0', top: '100%'});
                        }

                        self.$panel.show();
                    }
                });
                self.emoji = button.render();
                return self.emoji;
            });

            // This events will be attached when editor is initialized.
            this.events = {
                'summernote.init': function (we, e) {
                    addListener();
                }
            };
            this.initialize = function () {
                this.$panel = $('<div class="emoji-menu ' + editorId + '">\n' +
                    '    <div class="emoji-items-wrap1">\n' +
                    '        <table class="emoji-menu-tabs">\n' +
                    '            <tbody>\n' +
                    '            <tr>\n' +
                    '                <td><a class="emoji-menu-tab icon-recent-selected"></a></td>\n' +
                    '                <td><a class="emoji-menu-tab icon-smile"></a></td>\n' +
                    '                <td><a class="emoji-menu-tab icon-flower"></a></td>\n' +
                    '                <td><a class="emoji-menu-tab icon-bell"></a></td>\n' +
                    '                <td><a class="emoji-menu-tab icon-car"></a></td>\n' +
                    '                <td><a class="emoji-menu-tab icon-grid"></a></td>\n' +
                    '            </tr>\n' +
                    '            </tbody>\n' +
                    '        </table>\n' +
                    '        <div class="emoji-items-wrap mobile_scrollable_wrap">\n' +
                    '            <div class="emoji-items"></div>\n' +
                    '        </div>\n' +
                    '    </div>\n' +
                    '</div>').hide();
                if (typeof this.emoji !== 'undefined') {
                    this.$panel.appendTo(this.emoji.parent());
                   loadEmojis();
                    updateEmojisList(0);
                }
            };
            this.destroy = function () {
                this.$panel.remove();
                this.$panel = null;
            };
        }
    });
    
    
    $.extend($.summernote.lang, {
		'fr': {
			font: {
				bold: 'Gras',
				italic: 'Italique',
				underline: 'Souligné',
				clear: 'Effacer la mise en forme',
				height: 'Interligne',
				name: 'Famille de police',
				strikethrough: 'Barré',
				superscript: 'Exposant',
				subscript: 'Indice',
				size: 'Taille de police',
			},
			image: {
				image: 'Image',
				insert: 'Insérer une image',
				resizeFull: 'Taille originale',
				resizeHalf: 'Redimensionner à 50 %',
				resizeQuarter: 'Redimensionner à 25 %',
				floatLeft: 'Aligné à gauche',
				floatRight: 'Aligné à droite',
				floatNone: 'Pas d\'alignement',
				shapeRounded: 'Forme: Rectangle arrondi',
				shapeCircle: 'Forme: Cercle',
				shapeThumbnail: 'Forme: Vignette',
				shapeNone: 'Forme: Aucune',
				dragImageHere: 'Faites glisser une image ou un texte dans ce cadre',
				dropImage: 'Lachez l\'image ou le texte',
				selectFromFiles: 'Choisir un fichier',
				maximumFileSize: 'Taille de fichier maximale',
				maximumFileSizeError: 'Taille maximale du fichier dépassée',
				url: 'URL de l\'image',
				remove: 'Supprimer l\'image',
				original: 'Original',
			},
			video: {
				video: 'Vidéo',
				videoLink: 'Lien vidéo',
				insert: 'Insérer une vidéo',
				url: 'URL de la vidéo',
				providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion ou Youku)',
			},
			link: {
				link: 'Lien',
				insert: 'Insérer un lien',
				unlink: 'Supprimer un lien',
				edit: 'Modifier',
				textToDisplay: 'Texte à afficher',
				url: 'URL du lien',
				openInNewWindow: 'Ouvrir dans une nouvelle fenêtre',
			},
			table: {
				table: 'Tableau',
				addRowAbove: 'Ajouter une ligne au-dessus',
				addRowBelow: 'Ajouter une ligne en dessous',
				addColLeft: 'Ajouter une colonne à gauche',
				addColRight: 'Ajouter une colonne à droite',
				delRow: 'Supprimer la ligne',
				delCol: 'Supprimer la colonne',
				delTable: 'Supprimer le tableau',
			},
			hr: {
				insert: 'Insérer une ligne horizontale',
			},
			style: {
				style: 'Style',
				p: 'Normal',
				blockquote: 'Citation',
				pre: 'Code source',
				h1: 'Titre 1',
				h2: 'Titre 2',
				h3: 'Titre 3',
				h4: 'Titre 4',
				h5: 'Titre 5',
				h6: 'Titre 6',
			},
			lists: {
				unordered: 'Liste à puces',
				ordered: 'Liste numérotée',
			},
			options: {
				help: 'Aide',
				fullscreen: 'Plein écran',
				codeview: 'Afficher le code HTML',
			},
			paragraph: {
				paragraph: 'Paragraphe',
				outdent: 'Diminuer le retrait',
				indent: 'Augmenter le retrait',
				left: 'Aligner à gauche',
				center: 'Centrer',
				right: 'Aligner à droite',
				justify: 'Justifier',
			},
			color: {
				recent: 'Dernière couleur sélectionnée',
				more: 'Plus de couleurs',
				background: 'Couleur de fond',
				foreground: 'Couleur de police',
				transparent: 'Transparent',
				setTransparent: 'Définir la transparence',
				reset: 'Restaurer',
				resetToDefault: 'Restaurer la couleur par défaut',
			},
			shortcut: {
				shortcuts: 'Raccourcis',
				close: 'Fermer',
				textFormatting: 'Mise en forme du texte',
				action: 'Action',
				paragraphFormatting: 'Mise en forme des paragraphes',
				documentStyle: 'Style du document',
				extraKeys: 'Touches supplémentaires',
			},
			help: {
				'insertParagraph': 'Insérer paragraphe',
				'undo': 'Défaire la dernière commande',
				'redo': 'Refaire la dernière commande',
				'tab': 'Tabulation',
				'untab': 'Tabulation arrière',
				'bold': 'Mettre en caractère gras',
				'italic': 'Mettre en italique',
				'underline': 'Mettre en souligné',
				'strikethrough': 'Mettre en texte barré',
				'removeFormat': 'Nettoyer les styles',
				'justifyLeft': 'Aligner à gauche',
				'justifyCenter': 'Centrer',
				'justifyRight': 'Aligner à droite',
				'justifyFull': 'Justifier à gauche et à droite',
				'insertUnorderedList': 'Basculer liste à puces',
				'insertOrderedList': 'Basculer liste ordonnée',
				'outdent': 'Diminuer le retrait du paragraphe',
				'indent': 'Augmenter le retrait du paragraphe',
				'formatPara': 'Changer le paragraphe en cours en normal (P)',
				'formatH1': 'Changer le paragraphe en cours en entête H1',
				'formatH2': 'Changer le paragraphe en cours en entête H2',
				'formatH3': 'Changer le paragraphe en cours en entête H3',
				'formatH4': 'Changer le paragraphe en cours en entête H4',
				'formatH5': 'Changer le paragraphe en cours en entête H5',
				'formatH6': 'Changer le paragraphe en cours en entête H6',
				'insertHorizontalRule': 'Insérer séparation horizontale',
				'linkDialog.show': 'Afficher fenêtre d\'hyperlien',
			},
			history: {
				undo: 'Annuler la dernière action',
				redo: 'Restaurer la dernière action annulée',
			},
			specialChar: {
				specialChar: 'Caractères spéciaux',
				select: 'Choisir des caractères spéciaux',
			},
			file: {
				file: 'Fichier',
				btn: 'Fichier',
				insert: 'Insérer un fichier',
				selectFromFiles: 'Sélectionner depuis les fichiers',
				url: 'URL du fichier',
				maximumFileSize: 'Taille maximum du fichier',
				maximumFileSizeError: 'Taille maximum dépassé.'
			}
		},
	});

	$.extend($.summernote.lang, {
		'en': {
			"font": {
				"bold": "Bold",
				"italic": "Italic",
				"underline": "Underline",
				"clear": "Remove Font Style",
				"height": "Line Height",
				"name": "Font Family",
				"strikethrough": "Strikethrough",
				"subscript": "Subscript",
				"superscript": "Superscript",
				"size": "Font Size",
				"sizeunit": "Font Size Unit"
			},
			"image": {
				"image": "Picture",
				"insert": "Insert Image",
				"resizeFull": "Resize full",
				"resizeHalf": "Resize half",
				"resizeQuarter": "Resize quarter",
				"resizeNone": "Original size",
				"floatLeft": "Float Left",
				"floatRight": "Float Right",
				"floatNone": "Remove float",
				"shapeRounded": "Shape: Rounded",
				"shapeCircle": "Shape: Circle",
				"shapeThumbnail": "Shape: Thumbnail",
				"shapeNone": "Shape: None",
				"dragImageHere": "Drag image or text here",
				"dropImage": "Drop image or Text",
				"selectFromFiles": "Select from files",
				"maximumFileSize": "Maximum file size",
				"maximumFileSizeError": "Maximum file size exceeded.",
				"url": "Image URL",
				"remove": "Remove Image",
				"original": "Original"
			},
			"video": {
				"video": "Video",
				"videoLink": "Video Link",
				"insert": "Insert Video",
				"url": "Video URL",
				"providers": "(YouTube, Vimeo, Vine, Instagram, DailyMotion or Youku)"
			},
			"link": {
				"link": "Link",
				"insert": "Insert Link",
				"unlink": "Unlink",
				"edit": "Edit",
				"textToDisplay": "Text to display",
				"url": "To what URL should this link go?",
				"openInNewWindow": "Open in new window",
				"useProtocol": "Use default protocol"
			},
			"table": {
				"table": "Table",
				"addRowAbove": "Add row above",
				"addRowBelow": "Add row below",
				"addColLeft": "Add column left",
				"addColRight": "Add column right",
				"delRow": "Delete row",
				"delCol": "Delete column",
				"delTable": "Delete table"
			},
			"hr": {
				"insert": "Insert Horizontal Rule"
			},
			"style": {
				"style": "Style",
				"p": "Normal",
				"blockquote": "Quote",
				"pre": "Code",
				"h1": "Header 1",
				"h2": "Header 2",
				"h3": "Header 3",
				"h4": "Header 4",
				"h5": "Header 5",
				"h6": "Header 6"
			},
			"lists": {
				"unordered": "Unordered list",
				"ordered": "Ordered list"
			},
			"options": {
				"help": "Help",
				"fullscreen": "Full Screen",
				"codeview": "Code View"
			},
			"paragraph": {
				"paragraph": "Paragraph",
				"outdent": "Outdent",
				"indent": "Indent",
				"left": "Align left",
				"center": "Align center",
				"right": "Align right",
				"justify": "Justify full"
			},
			"color": {
				"recent": "Recent Color",
				"more": "More Color",
				"background": "Background Color",
				"foreground": "Text Color",
				"transparent": "Transparent",
				"setTransparent": "Set transparent",
				"reset": "Reset",
				"resetToDefault": "Reset to default",
				"cpSelect": "Select"
			},
			"shortcut": {
				"shortcuts": "Keyboard shortcuts",
				"close": "Close",
				"textFormatting": "Text formatting",
				"action": "Action",
				"paragraphFormatting": "Paragraph formatting",
				"documentStyle": "Document Style",
				"extraKeys": "Extra keys"
			},
			"help": {
				"insertParagraph": "Insert Paragraph",
				"undo": "Undoes the last command",
				"redo": "Redoes the last command",
				"tab": "Tab",
				"untab": "Untab",
				"bold": "Set a bold style",
				"italic": "Set a italic style",
				"underline": "Set a underline style",
				"strikethrough": "Set a strikethrough style",
				"removeFormat": "Clean a style",
				"justifyLeft": "Set left align",
				"justifyCenter": "Set center align",
				"justifyRight": "Set right align",
				"justifyFull": "Set full align",
				"insertUnorderedList": "Toggle unordered list",
				"insertOrderedList": "Toggle ordered list",
				"outdent": "Outdent on current paragraph",
				"indent": "Indent on current paragraph",
				"formatPara": "Change current block's format as a paragraph(P tag)",
				"formatH1": "Change current block's format as H1",
				"formatH2": "Change current block's format as H2",
				"formatH3": "Change current block's format as H3",
				"formatH4": "Change current block's format as H4",
				"formatH5": "Change current block's format as H5",
				"formatH6": "Change current block's format as H6",
				"insertHorizontalRule": "Insert horizontal rule",
				"linkDialog.show": "Show Link Dialog"
			},
			"history": {
				"undo": "Undo",
				"redo": "Redo"
			},
			"specialChar": {
				"specialChar": "SPECIAL CHARACTERS",
				"select": "Select Special characters"
			},
			"output": {
				"noSelection": "No Selection Made!"
			},
			file: {
				file: 'File',
				btn: 'File',
				insert: 'Insert File',
				selectFromFiles: 'Select from files',
				url: 'File URL',
				maximumFileSize: 'Maximum file size',
				maximumFileSizeError: 'Maximum file size exceeded.'
			}
		}
	});

	$.extend($.summernote.lang, {
		'vi': {
			font: {
				bold: 'In Đậm',
				italic: 'In Nghiêng',
				underline: 'Gạch dưới',
				clear: 'Bỏ định dạng',
				height: 'Chiều cao dòng',
				name: 'Phông chữ',
				strikethrough: 'Gạch ngang',
				subscript: 'Subscript',
				superscript: 'Superscript',
				size: 'Cỡ chữ',
			},
			image: {
				image: 'Hình ảnh',
				insert: 'Chèn',
				resizeFull: '100%',
				resizeHalf: '50%',
				resizeQuarter: '25%',
				floatLeft: 'Trôi về trái',
				floatRight: 'Trôi về phải',
				floatNone: 'Không trôi',
				shapeRounded: 'Shape: Rounded',
				shapeCircle: 'Shape: Circle',
				shapeThumbnail: 'Shape: Thumbnail',
				shapeNone: 'Shape: None',
				dragImageHere: 'Thả Ảnh ở vùng này',
				dropImage: 'Drop image or Text',
				selectFromFiles: 'Chọn từ File',
				maximumFileSize: 'Maximum file size',
				maximumFileSizeError: 'Maximum file size exceeded.',
				url: 'URL',
				remove: 'Xóa',
				original: 'Original',
			},
			video: {
				video: 'Video',
				videoLink: 'Link đến Video',
				insert: 'Chèn Video',
				url: 'URL',
				providers: '(YouTube, Vimeo, Vine, Instagram, DailyMotion và Youku)',
			},
			link: {
				link: 'Link',
				insert: 'Chèn Link',
				unlink: 'Gỡ Link',
				edit: 'Sửa',
				textToDisplay: 'Văn bản hiển thị',
				url: 'URL',
				openInNewWindow: 'Mở cửa sổ mới',
				useProtocol: "Sử dụng phương thức chuẩn"
			},
			table: {
				table: 'Bảng',
				addRowAbove: 'Thêm dòng phía trên',
				addRowBelow: 'Thêm dòng phía dưới',
				addColLeft: 'Thêm cột bên trái',
				addColRight: 'Thêm cột bên phải',
				delRow: 'Xóa dòng',
				delCol: 'Xóa cột',
				delTable: 'Xóa bảng',
			},
			hr: {
				insert: 'Chèn',
			},
			style: {
				style: 'Kiểu chữ',
				p: 'Chữ thường',
				blockquote: 'Đoạn trích',
				pre: 'Mã Code',
				h1: 'H1',
				h2: 'H2',
				h3: 'H3',
				h4: 'H4',
				h5: 'H5',
				h6: 'H6',
			},
			lists: {
				unordered: 'Liệt kê danh sách',
				ordered: 'Liệt kê theo thứ tự',
			},
			options: {
				help: 'Trợ giúp',
				fullscreen: 'Toàn Màn hình',
				codeview: 'Xem Code',
			},
			paragraph: {
				paragraph: 'Canh lề',
				outdent: 'Dịch sang trái',
				indent: 'Dịch sang phải',
				left: 'Canh trái',
				center: 'Canh giữa',
				right: 'Canh phải',
				justify: 'Canh đều',
			},
			color: {
				recent: 'Màu chữ',
				more: 'Mở rộng',
				background: 'Màu nền',
				foreground: 'Màu chữ',
				transparent: 'trong suốt',
				setTransparent: 'Nền trong suốt',
				reset: 'Thiết lập lại',
				resetToDefault: 'Trở lại ban đầu',
			},
			shortcut: {
				shortcuts: 'Phím tắt',
				close: 'Đóng',
				textFormatting: 'Định dạng Văn bản',
				action: 'Hành động',
				paragraphFormatting: 'Định dạng',
				documentStyle: 'Kiểu văn bản',
				extraKeys: 'Extra keys',
			},
			help: {
				'insertParagraph': 'Insert Paragraph',
				'undo': 'Undoes the last command',
				'redo': 'Redoes the last command',
				'tab': 'Tab',
				'untab': 'Untab',
				'bold': 'Set a bold style',
				'italic': 'Set a italic style',
				'underline': 'Set a underline style',
				'strikethrough': 'Set a strikethrough style',
				'removeFormat': 'Clean a style',
				'justifyLeft': 'Set left align',
				'justifyCenter': 'Set center align',
				'justifyRight': 'Set right align',
				'justifyFull': 'Set full align',
				'insertUnorderedList': 'Toggle unordered list',
				'insertOrderedList': 'Toggle ordered list',
				'outdent': 'Outdent on current paragraph',
				'indent': 'Indent on current paragraph',
				'formatPara': 'Change current block\'s format as a paragraph(P tag)',
				'formatH1': 'Change current block\'s format as H1',
				'formatH2': 'Change current block\'s format as H2',
				'formatH3': 'Change current block\'s format as H3',
				'formatH4': 'Change current block\'s format as H4',
				'formatH5': 'Change current block\'s format as H5',
				'formatH6': 'Change current block\'s format as H6',
				'insertHorizontalRule': 'Insert horizontal rule',
				'linkDialog.show': 'Show Link Dialog',
			},
			history: {
				undo: 'Lùi lại',
				redo: 'Làm lại',
			},
			specialChar: {
				specialChar: 'SPECIAL CHARACTERS',
				select: 'Select Special characters',
			},
			file: {
				file: 'Tập tin',
				btn: '...',
				insert: 'Thêm vào',
				selectFromFiles: 'Chọn từ',
				url: 'URL của tập tin',
				maximumFileSize: 'Dung lượng tối đa cho phép',
				maximumFileSizeError: 'Tập tin có dung lượng lớn hơn cho phép.'
			}
		},
	});
}));