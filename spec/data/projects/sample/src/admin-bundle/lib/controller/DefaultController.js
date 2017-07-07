const Controller = require('@conga/framework').Controller;

/**
 * @Route("/")
 */
module.exports = class DefaultController extends Controller {

    /**
     * @Route("/admin", name="admin.index", methods=["GET"])
     */
    index(req, res) {
        res.send(`
            <html>
            <head>
                <title>Webpack Admin Test</title>
            </head>
            <body>
                <h1>Webpack Admin Test</h1>
                <script src="/build/admin.bundle.js"></script>
            </body>
            </html>
        `);
    }

}
