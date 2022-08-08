import { cpp_decode_Array, cpp_decode_String } from "./bindgen-api";
import { Engine } from "./engine";

enum ArgType {
    Int = 1,
    Chars = 2
};

class Arg {
    constructor(
        public readonly type: ArgType,
        public readonly val: number) { }
};

type LoggerFn = (msg: string) => void;
const g_loggerFns: LoggerFn[] = [
    console.log,
    console.error
];

export class Console {

    static cpp_logNumber(v: number) {
        console.log(`[WASM] ${v}`);
    }

    static cpp_logString(pMsg: number) {
        console.log(cpp_decode_String(pMsg));
    }

    static cpp_errorString(pMsg: number) {
        console.error(cpp_decode_String(pMsg));
    }


    static cpp_format(loggerFn: number, pArgs: number) {
        const args = cpp_decode_Array(pArgs, 8, ptr => new Arg(
            Engine.mem_u32[(ptr + 0) >> 2],
            Engine.mem_u32[(ptr + 4) >> 2]
        ))

        g_loggerFns[loggerFn](args.map(arg => {
            switch (arg.type) {
                case ArgType.Int: {
                    return arg.val;
                }
                case ArgType.Chars: {
                    return cpp_decode_String(arg.val);
                }
                default: {
                    return "?";
                }
            }
        }).join(" "));
    }
}