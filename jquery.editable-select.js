/**
 * jQuery Editable
 * by Indri Muska <indrimuska@gmail.com>
 *
 * Version 1.0
 * Source on GitHub @ https://github.com/indrimuska/jquery-editable-select
 *
 * File: jquery.editable-select.js
 */

(function ($) {
	$.extend($.expr[':'], {
		nicontains: function (elem, i, match, array) {
			return !((elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0);
		}
	});
	$.fn.editableSelect = function (options) {
		var defaults = { effect: 'default', duration: 'fast', onSelect: null };
		var select = this.clone(), input = $('<input type="text">'), list = $('<ul class="es-list">');
		options = $.extend({}, defaults, options);
		switch (options.effects) {
			case 'default': case 'fade': case 'slide': break;
			default: options.effects = 'default';
		}
		switch (options.duration) {
			case !isNaN(options.duration): case 'fast': case 'slow': break;
			default: options.duration = 'fast';
		}
		this.replaceWith($('<div class="es-container">').append(input));
		var EditableSelect = {
			init: function () {
				var es = this;
				es.copyAttributes(select, input);
				input.after(list);
				list.css({ top: input.position().top + input.outerHeight() - 1, left: input.position().left, width: input.innerWidth() });
				select.find('option').each(function () {
					var li = $('<li>');
					li.text($(this).text());
					es.copyAttributes(this, li);
					list.append(li);
					if ($(this).is(':selected')) es.setField(es);
				});
				input.on('focus input click', es.show);
				$(document).click(function (event) {
					if (!$(event.target).is(input) && !$(event.target).is(list)) es.hide();
				});
				es.initializeList();
				es.initializeEvents();
			},
			initializeList: function () {
				var es = this;
				list.find('li').each(function () {
					$(this).on('mousemove', function () {
						list.find('.selected').removeClass('selected');
						$(this).addClass('selected');
					});
					$(this).click(function () { es.setField.call(this, es); });
				});
				list.mouseenter(function () {
					list.find('li.selected').removeClass('selected');
				});
			},
			initializeEvents: function () {
				var es = this;
				input.bind('input keydown', function (event) {
					switch (event.keyCode) {
						case 40: // Down
							es.show();
							var selected = list.find('.selected').size() > 0 ? list.find('.selected:visible').next(':visible') : list.find(':visible:first');
							list.find('.selected').removeClass('selected');
							(selected.size() > 0 ? selected : list.find('li:visible:first')).addClass('selected');
							break;
						case 38: // Up
							es.show();
							var selected = list.find('.selected').size() > 0 ? list.find('.selected:visible').prev(':visible') : list.find(':visible:last');
							list.find('.selected').removeClass('selected');
							(selected.size() > 0 ? selected : list.find('li:visible:last')).addClass('selected');
							break;
						case 13: // Enter
							if (list.is(':visible')) {
								es.setField.call(list.find('.selected'), es);
								event.preventDefault();
							}
						case 9:  // Tab
						case 27: // Esc
							es.hide();
							break;
						default:
							es.show();
							break;
					}
				});
			},
			show: function () {
				list.find('li').show();
				var hidden = list.find('li:nicontains(' + input.val() + ')').hide().size();
				if (hidden == list.find('li').size()) list.hide();
				else
					switch (options.effects) {
						case 'fade':   list.fadeIn(options.duration); break;
						case 'slide':  list.slideDown(options.duration); break;
						default:       list.show(options.duration); break;
					}
			},
			hide: function () {
				switch (options.effects) {
					case 'fade':   list.fadeOut(options.duration); break;
					case 'slide':  list.slideUp(options.duration); break;
					default:       list.hide(options.duration); break;
				}
			},
			copyAttributes: function (from, to) {
				var attrs = $(from)[0].attributes;
				for (var i in attrs) $(to).attr(attrs[i].nodeName, attrs[i].nodeValue);
			},
			setField: function (es) {
				if (!$(this).is(':visible')) return false;
				input.val($(this).text());
				es.hide();
				if (options.onSelect) options.onSelect.call(this, input);
			}
		};
		EditableSelect.init();
	}
}) (jQuery);