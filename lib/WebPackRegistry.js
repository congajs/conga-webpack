module.exports = class WebpackRegistry {

    setup(assets, base) {

        this.assets = {};

        for (let name in assets) {
            this.assets[name] = base + assets[name]['js'];
        }

    }

    get(name) {
        return this.assets[name];
    }
}
