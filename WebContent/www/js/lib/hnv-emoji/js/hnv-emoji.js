function isTextBoxCanAddEmoji(element) {
	var tagName = element.tagName.toLowerCase();
	if (tagName === 'textarea') return true;
	if (tagName !== 'input') return false;
	var type = element.getAttribute('type').toLowerCase();
	var inputTypes = ['text'];
	return inputTypes.indexOf(type) >= 0;
}

function addText(textBox, text) {   
	var val = textBox.val();
	textBox.val(val + text);	
}

const do_gl_emoji = function (bouton, textBox) {
	var self 			= bouton;
	var $panel			= null;
	
	var KEY_ESC 		= 27;
	var KEY_TAB 		= 9;          
	var icons 			= {};
	var reverseIcons 	= {};

	var chunk = function (val, chunkSize) {
		var R = [];
		for (var i = 0; i < val.length; i += chunkSize)
			R.push(val.slice(i, i + chunkSize));
		return R;
	};


	var addListener = function () {
		self.on('mouseup', function(e) {                   
			if ($panel.is(":visible")) $panel.hide();
			else $panel.show();					
		});
		
		var $body = $('body');
		$body.on('keydown', function(e) {
			if (e.keyCode === KEY_ESC || e.keyCode === KEY_TAB) {
				$panel.hide();
			}
		});	

		$body.on('click', '.emoji-menu-tab', function (e) {
			e.stopPropagation();
			e.preventDefault();
			var index = 0;
			var curclass = $(this).attr("class").split(' ');
			curclass = curclass[1].split('-');
			if(curclass.length===3) return;
			curclass = curclass[0]+'-'+curclass[1];
			$('.emoji-menu-tabs td').each(function(i){
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
		
		$body.on('click', '.emoji-items a', function(){
			var emoji = $('.label', $(this)).text();
			if (document.emojiType === 'unicode') {
				addText ( textBox, colonToUnicode(emoji));
			} else {
				var $img = $(createdEmojiIcon(self.icons[emoji]));
				if ($img[0].attachEvent) {
					$img[0].attachEvent('onresizestart', function(e) {
						e.returnValue = false;
					}, false);
				}
				
				//addText ( textBox, self.icons[emoji][4]);
				//context.invoke('editor.insertNode', $img[0]);
				
				textBox[0].appendChild($img[0]);
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
				icons[':' + name + ':'] = [j, row, column, ':' + name + ':', dataItem[0]];
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
		var $items = $('.emoji-items');
		$items.html('');
		if(index > 0) {
			$.each(self.icons, function (key, icon) {
				if (self.icons.hasOwnProperty(key)
						&& icon[0] === (index - 1)) {
					$items.append('<a href="javascript:void(0)" title="'
							+ Config.htmlEntities(key) + ' data-code="" >'
							+ createdEmojiIcon(icon, true)
							+ '<span class="label">' + Config.htmlEntities(key)
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
								+ Config.htmlEntities(key) + '" data-code="'+ self.icons[key][4] + '" +>'
								+ createdEmojiIcon(self.icons[key], true)
								+ '<span class="label">' + Config.htmlEntities(key)
								+ '</span></a>');
					}
				}
			});
		}
		$panel.show();		
	};
	var createdEmojiIcon = function(emoji){
		var category 		= emoji[0];
		var row 			= emoji[1];
		var column 			= emoji[2];
		var name 			= emoji[3];
		
		if (!document.emojiSource) document.emojiSource = 'www/js/lib/hnv-emoji';
		
		var filename 		= document.emojiSource +'/img/emoji_spritesheet_!.png';
		var blankGifPath 	= document.emojiSource +'/img/blank.gif';
		var iconSize 		= 25;
		var xoffset 		= -(iconSize * column);
		var yoffset 		= -(iconSize * row);
		var scaledWidth 	= (Config.EmojiCategorySpritesheetDimens[category][1] * iconSize);
		var scaledHeight 	= (Config.EmojiCategorySpritesheetDimens[category][0] * iconSize);

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

	var initialize = function () {
		$panel = $('<div class="emoji-menu" style="top:-235px!important">\n' +
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
		'</div>');

		$panel.appendTo(bouton);

		loadEmojis();
		updateEmojisList(0);
		
		$panel.hide();
	};

	//--------------------------------------------------------------------------------------------
	initialize();
	addListener();
}

