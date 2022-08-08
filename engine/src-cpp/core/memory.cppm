
export module core.memory;
import core.types;
export {

template<typename T>
concept is_word_aligned = alignof(T) == 2;
template<typename T>
concept is_dword_aligned = alignof(T) == 4;
template<typename T>
concept is_qword_aligned = alignof(T) == 8;

template<typename T>
void copy(T* pDest, const T* pSrc, size_t num) {
    size_t length = num * sizeof(T);
#pragma clang loop unroll(enable)
    for (size_t i = 0; i < length; i++) {
        ((u8*)pDest)[i] = ((u8*)pSrc)[i];
    }
}

template<is_word_aligned T>
void copy(T* pDest, const T* pSrc, size_t num) {
    size_t length = num * (sizeof(T) / 2);
#pragma clang loop unroll(enable)
    for (size_t i = 0; i < length; i++) {
        ((u16*)pDest)[i] = ((u16*)pSrc)[i];
    }
}

template<is_dword_aligned T>
void copy(T* pDest, const T* pSrc, size_t num) {
    size_t length = num * (sizeof(T) / 4);
#pragma clang loop unroll(enable)
    for (size_t i = 0; i < length; i++) {
        ((u32*)pDest)[i] = ((u32*)pSrc)[i];
    }
}

template<is_qword_aligned T>
void copy(T* pDest, const T* pSrc, size_t num) {
    size_t length = num * (sizeof(T) / 8);
#pragma clang loop unroll(enable)
    for (size_t i = 0; i < length; i++) {
        ((u64*)pDest)[i] = ((u64*)pSrc)[i];
    }
}

}