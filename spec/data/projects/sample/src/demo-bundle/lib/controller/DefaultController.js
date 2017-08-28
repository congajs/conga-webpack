/*
 * This file is part of the conga-full-demo project
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const Controller = require('@conga/framework').Controller;

/**
 * The DefaultController defines the default actions and routes
 *
 * @Route("/")
 */
module.exports = class DefaultController extends Controller {

    /**
     * @Route("/",
     *    name="default.index",
     *    methods=["GET"]
     * )
     *
     * @Template
     */
    index(req, res) {
        res.return();
    }

}
