export default [

    {
        //name: "webpack",
        path: "/webpack",
        component: require('./WebpackComponent').default,

        children: [
            {
                name: "webpack",
                path: "",
                component: require('./ConfigurationComponent').default
            }
        ]
    }

];
