(function() {
    function Input() {
        var pressedKeys = {};
        function _setKey(event, status) {
            var code = event.keyCode;
            var key;
            //console.log('dat key' , code);
            switch(code) {
            case 32:
                key = 'SPACE'; break;
            case 37:
                key = 'LEFT'; break;
            case 38:
                key = 'UP'; break;
            case 39:
                key = 'RIGHT'; break;
            case 40:
                key = 'DOWN'; break;
            case 68:
                key = 'D'; break;
            case 83:
                key = 'S'; break;
            case 65:
                key = 'A'; break;
            case 87:
                key = 'W'; break;
            default:
                // Convert ASCII codes to letters
                key = String.fromCharCode(code);
            }
            pressedKeys[key] = status;
        }

        // this should be a singleton probably
        document.addEventListener('keydown', function(e) {
            _setKey(e, true);
        });

        document.addEventListener('keyup', function(e) {
            _setKey(e, false);
        });

        window.addEventListener('blur', function() {
            pressedKeys = {};
        });

        return {
            isDown: function(key) {
                return pressedKeys[key.toUpperCase()];
            }
        };
    }

    window.Input = Input;
})();
