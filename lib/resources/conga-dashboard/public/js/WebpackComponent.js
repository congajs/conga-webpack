import Vue from 'vue';

export default Vue.extend({
    template: `
        <div>
            <h1 class="is-size-1">Webpack</h1>

            <div class="tabs is-boxed">
                <ul>
                    <li><a>Routes</a></li>
                    <li><a>Services</a></li>
                </ul>
            </div>

            <div class="content">
                <router-view></router-view>
            </div>

        </div>
    `,

    components: {
        //'navbar-component': NavbarComponent
    }
});
