const Controller = require('@conga/framework').Controller;

/**
 * @Route("/")
 */
module.exports = class DefaultController extends Controller {

    /**
     * @Route("/", name="default.index", methods=["GET"])
     */
    index(req, res) {
        res.send(`
            <html>
            <head>
                <title>Webpack Test</title>
            </head>
            <body>
                <h1>Webpack Test</h1>
                <script src="/build/bundle.js"></script>
            </body>
            </html>
        `);
    }

}
