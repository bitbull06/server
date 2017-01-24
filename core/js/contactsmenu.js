/* global OC.Backbone, Handlebars, Promise */

/**
 * @copyright 2017 Christoph Wurst <christoph@winzerhof-wurst.at>
 *
 * @author 2017 Christoph Wurst <christoph@winzerhof-wurst.at>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

(function(OC, $, Handlebars) {
	'use strict';

	var LOADING_TEMPLATE = '<div class="icon-loading"></div>';
	var CONTACT_TEMPLATE = '<span class="avatar"></span> {{contact.displayName}}';

	/**
	 * @class Contact
	 */
	var Contact = OC.Backbone.Model.extend({
		defaults: {
			name: 'Fritz'
		}
	});

	/**
	 * @class ContactCollection
	 */
	var ContactCollection = OC.Backbone.Collection.extend({
		model: Contact
	});

	/**
	 * @class ContactsListView
	 */
	var ContactsListView = OC.Backbone.View.extend({

		/** @type {ContactsCollection} */
		_collection: undefined,

		/**
		 * @param {object} options
		 * @returns {undefined}
		 */
		initialize: function(options) {
			this._collection = options.collection;
		},

		/**
		 * @returns {self}
		 */
		render: function() {
			var self = this;
			console.log('render contacts list', self._collection);
			self.$el.html('');

			self._collection.forEach(function(contact) {
				var item = new ContactsListItemView({
					model: contact
				});
				item.render();
				self.$el.append(item.$el);
			});

			return self;
		}
	});

	/**
	 * @class CotnactsListItemView
	 */
	var ContactsListItemView = OC.Backbone.View.extend({

		/** @type {string} */
		className: 'contact',

		/** @type {undefined|function} */
		_template: undefined,

		/** @type {Contact} */
		_model: undefined,

		/**
		 * @param {object} data
		 * @returns {undefined}
		 */
		template: function(data) {
			if (!this._template) {
				this._template = Handlebars.compile(CONTACT_TEMPLATE);
			}
			return this._template(data);
		},

		/**
		 * @param {object} options
		 * @returns {undefined}
		 */
		initialize: function(options) {
			this._model = options.model;
		},

		/**
		 * @returns {self}
		 */
		render: function() {
			console.log('render contacts list item', this._model);

			this.$el.html(this.template({
				contact: this._model.toJSON()
			}));

			this.$('.avatar').imageplaceholder(this._model.get('displayName', 'displayName'));

			return this;
		}
	});

	/**
	 * @class ContactsMenuView
	 */
	var ContactsMenuView = OC.Backbone.View.extend({

		/** @type {undefined|function} */
		_template: undefined,

		/**
		 * @param {object} data
		 * @returns {undefined}
		 */
		template: function(data) {
			if (!this._template) {
				this._template = Handlebars.compile(LOADING_TEMPLATE);
			}
			return this._template(data);
		},

		/**
		 * @param {object} options
		 * @returns {undefined}
		 */
		initialize: function(options) {
			this.options = options;
		},

		/**
		 * @returns {undefined}
		 */
		showLoading: function() {
			console.log('show loading');
			this.render({
				loading: true
			});
		},

		/**
		 * @param {Backbone.Collection} contacts
		 * @returns {undefined}
		 */
		showContacts: function(contacts) {
			console.log('show contacts');
			this.render({
				loading: false,
				contacts: contacts
			});
		},

		/**
		 * @param {object} data
		 * @returns {self}
		 */
		render: function(data) {
			console.log('render contacts menu');

			if (!!data.loading) {
				this.$el.html(this.template(data));
			} else {
				var list = new ContactsListView({
					collection: data.contacts
				});
				list.render();
				this.$el.html(list.$el);
			}

			return this;
		}

	});

	/**
	 * @param {array} options
	 * @class ContactsMenu
	 */
	var ContactsMenu = function(options) {
		this.initialize(options);
	};

	ContactsMenu.prototype = {
		/** @type {jQuery} */
		$el: undefined,

		/** @type {jQuery} */
		_$trigger: undefined,

		/** @type {boolean} */
		_open: false,

		/** @type {ContactsMenuView} */
		_view: undefined,

		/** @type {Promise} */
		_contactsPromise: undefined,

		/**
		 * @param {array} options
		 * @returns {undefined}
		 */
		initialize: function(options) {
			var self = this;

			self.$el = options.el;
			self._$trigger = options.trigger;

			this._view = new ContactsMenuView({
				el: self.$el
			});

			this._$trigger.click(function(event) {
				event.preventDefault();
				self._toggleVisibility();
			});
		},

		/**
		 * @returns {undefined}
		 */
		_toggleVisibility: function() {
			if (!this._open) {
				console.log('open');
				this._loadContacts();
				this.$el.addClass('open');
				this._open = true;
			} else {
				console.log('close');
				this.$el.removeClass('open');
				this._open = false;
			}
		},

		_getContats: function() {
			var url = OC.generateUrl('/contactsmenu/contacts');
			return Promise.resolve($.ajax(url, {
				method: 'GET'
			})).then(function(data) {
				// Convert to Backbone collection
				return new ContactCollection(data);
			});
		},

		_loadContacts: function() {
			var self = this;

			if (!self._contactsPromise) {
				self._contactsPromise = self._getContats();
			}

			self._view.showLoading();
			self._contactsPromise.then(function(contacts) {
				console.log('contacts loaded!');
				self._view.showContacts(contacts);
			}, function(e) {
				console.error('could not load contacts', e);
			});
		}
	};

	OC.ContactsMenu = ContactsMenu;

})(OC, $, Handlebars);
