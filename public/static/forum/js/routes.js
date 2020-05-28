//dont need react router is so non-light-weight
//ES5 only whitout BABEL
var routes = {
    ['all']: '/static/forum/js/forum.jsx',
    ['one']: '/static/forum/js/post.jsx',
    ['create']: '/static/forum/js/createpost.jsx'
};
; (function () {
        $(document).ready(ready)

        function ready() {

            function injectJS(hash, successCB) {
                //Core impletation
                $.ajax({
                    url: routes[hash], method: "GET", success: function (res) {
                        var code = Babel.transform(res, { presets: ['es2015', 'stage-2', 'react'] });
                        eval(code.code)
                    }
                })
            }
            function onHashchange() {
                let hash = this.location.hash.replace('#', '');
                //fix bugs
                if(!routes[hash]){
                    return
                }
                injectJS(hash);
            }
            window.addEventListener('hashchange', onHashchange)
            onHashchange()
        }
})();