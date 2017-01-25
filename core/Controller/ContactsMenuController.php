<?php

/**
 * @author Christoph Wurst <christoph@winzerhof-wurst.at>
 * @copyright Christoph Wurst <christoph@winzerhof-wurst.at>
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

namespace OC\Core\Controller;

use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\JSONResponse;
use OCP\IRequest;

class ContactsMenuController extends Controller {

	public function __construct(IRequest $request) {
		parent::__construct('core', $request);
	}

	/**
	 * @NoAdminRequired
	 *
	 * @param int $page
	 * @return JSONResponse
	 */
	public function index($page = 0) {
		return [
			[
				'id' => 123,
				'displayName' => 'Björn Schießle',
				'actions' => [
					
				],
				'lastMessage' => '',
			],
			[
				'id' => 321,
				'displayName' => 'Frank Karlitschek',
				'actions' => [
					[
						'id' => 'mail',
						'icon' => 'icon-mail',
						'hyperlink' => '/apps/mail/12345'
					],
					[
						'id' => 'call',
						'icon' => 'icon-call',
						'hyperlink' => '/apps/spreed/12345'
					],
				],
				'lastMessage' => 'See you later, crocodile!',
			],
			[
				'id' => 345,
				'displayName' => 'Jos Poortvliet',
				'actions' => [
					
				],
				'lastMessage' => 'Animi corrupti non et similique maxime soluta provident. Debitis eveniet architecto fuga culpa ea et. Quae occaecati ipsum suscipit. Ipsum quo unde et tempora architecto ex magnam. Quaerat cumque ad aut. Perferendis id est cumque.'
			],
			[
				'id' => 543,
				'displayName' => 'Jan-Christoph Borchardt',
				'actions' => [
					
				],
				'lastMessage' => 'Es keat oanfach viel mehr gschmust',
			],
		];
	}

}
