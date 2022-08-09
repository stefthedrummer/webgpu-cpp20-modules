
export module core.debug;
import api.console;

export{

constexpr bool DEBUG = true;

template<typename T>
inline constexpr void CHECK_BOUNDS(T v, T min, T max) {
    if constexpr (DEBUG) {
        if(v < min || v >= max) Console::Panic(ErrorCode::IndexOutOfBounds);
    }
}

template<typename T>
inline constexpr void CHECK_BOUNDS_INC(T v, T min, T max) {
    if constexpr (DEBUG) {
        if(v < min || v > max) Console::Panic(ErrorCode::IndexOutOfBounds);
    }
}

}