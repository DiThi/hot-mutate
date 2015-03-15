/*
hot-mutate

Copyright (C) 2015, Alberto Torres <kungfoobar@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.
*/

'use strict';

module.exports = function(module){
    if(module.hot){
        var old_exports = module.hot.data && module.hot.data.old_exports
        module.hot.accept();
        module.hot.dispose(function(data){
            data.old_exports = old_exports||module.exports;
        });
        // If there is no old_exports, it patches the wrapper functions
        // to itself the first time that is loaded
        patch_functions(old_exports||module.exports, module.exports);
    }
}

function patch_functions(old_ob, new_ob){
    for(var f in new_ob){
        var old_f = old_ob[f] && old_ob[f]._$f;
        var new_f = new_ob[f];
        if(typeof new_f === "function"){
            // If there's no function or it wasn't wrapped,
            // create wrapper function
            if(!old_f){
                old_ob[f] = eval(
                    '(function '+f+'(){\n'+
                    '    return '+f+'._$f.apply(this, arguments);\n'+
                    '})'
                );
            }
            // Copy the function
            old_ob[f]._$f = new_f;
            // Copy the wrapper (just in case the module is required() again)
            new_ob[f] = old_ob[f];
            // If the function is a class, copy the methods too
            if(typeof old_f === "function"){
                patch_functions(old_f.prototype, new_f.prototype);
            }
        }
    }
}
