
export module api.console;
import core.wasm;
import core.types;

#define wasm_import(name) __attribute__((import_name(name)))
export {

namespace ErrorCode {
    constexpr char const* IndexOutOfBounds = "[WASM] IndexOutOfBounds";
    constexpr char const* HandleStackOverflow = "[WASM] HandleStackOverflow";
    constexpr char const* VirtualStackStackOverflow = "[WASM] VirtualStackStackOverflow";
    constexpr char const* ResourceAlreadyReleased = "[WASM] ResourceAlreadyReleased";
    constexpr char const* MemoryAlreadyFreed = "[WASM] MemoryAlreadyFreed";
}

namespace Console {

    wasm_import("cpp_logNumber") void Log(u32 v);
    wasm_import("cpp_logNumber") void Log(f32 v);
    wasm_import("cpp_logNumber") void Log(f64 v);
    wasm_import("cpp_logString") void Log(char const* pMessage);
    wasm_import("cpp_errorString") void Error(char const* pMessage);

    inline void Panic(char const* pMessage) {
        Error(pMessage);
        __builtin_trap();
    }
}
}