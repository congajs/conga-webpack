import Vue from 'vue';

export default Vue.extend({

    template: `

        <div class="">

            <article class="message is-primary">
                <div class="message-body">
                    These are the webpack configurations defined in your project.
                </div>
            </article>

            <table class="table">
                <thead>
                    <th>Path</th>
                </thead>
                <tbody>
                    <tr v-for="configuration in configurations">
                        <td>{{ configuration.path }}</td>
                    </tr>
                </tbody>
            </table>

        </div>

    `,

    data: function() {
        return {
            configurations: []
        }
    },

    created: function() {
        this.$http.get('_conga/webpack/configurations').then((response) => {
            this.configurations = response.body.configurations;
        }, (response) => {

        });
    }
});
