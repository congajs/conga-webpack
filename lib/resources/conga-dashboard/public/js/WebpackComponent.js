import Vue from 'vue';

export default Vue.extend({

    template: `

        <div>

            <hero>

                <span slot="hero-title">Webpack</span>
                <span slot="hero-subtitle"></span>

                <div class="container" slot="hero-foot">

                    <tab-container>
                        <tab route="webpack" label="Configurations"></tab>
                    </tab-container>

                </div>

            </hero>

            <main-section>

                <div class="content">
                    <router-view></router-view>
                </div>

            </main-section>

        </div>

    `,

    data: function() {
        return {
            $route: this.$route
        }
    }
});
