
export module core.debug;
import api.console;

#define DEBUG true
export{

#if DEBUG
template<typename T>
inline constexpr void CHECK_BOUNDS(T v, T min, T max) {
    if(v < min || v >= max) Console::Error(ErrorCode::IndexOutOfBounds);
}

template<typename T>
inline constexpr void CHECK_BOUNDS_INC(T v, T min, T max) {
    if(v < min || v > max) Console::Error(ErrorCode::IndexOutOfBounds);
}
#else 
template<typename T>
inline constexpr void CHECK_BOUNDS(T v, T min, T max) {
}
template<typename T>
inline constexpr void CHECK_BOUNDS_INC(T v, T min, T max) {
}
#endif

}