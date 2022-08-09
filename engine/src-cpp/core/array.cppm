
export module core.array;
import core.debug;
export import core.types;
export import core.meta;
export import core.allocator;
export import core.initializer_list;

export{


template<typename T, Allocator TAllocator = Borrow>
struct Array : TAllocator::template TBase<T, TAllocator, Array, T>  {
    using TAllocatorHandle = typename TAllocator::Handle;
    using TBase = typename TAllocator::template TBase<T, TAllocator, Array, T>;

    inline constexpr Array() :
        TBase{} {}

    inline constexpr Array(u32 length, T* pElements, TAllocatorHandle allocatorHandle = TAllocatorHandle{}) :
        TBase{ length, pElements } {}

    inline constexpr Array(u32 length, TAllocatorHandle allocatorHandle = TAllocatorHandle{}) :
        TBase{ length, allocatorHandle } {}

    static inline constexpr Array<T, TAllocator> From(std::initializer_list<T> init, TAllocatorHandle allocatorHandle = TAllocatorHandle{}) {
        Array<T, TAllocator> array{ init.size(), allocatorHandle };
        __builtin_memcpy(array.pElements, init.begin(), init.size() * sizeof(T));
        return array;
    }

    inline constexpr u32 Length() { return this->length; }

    inline constexpr T& operator [] (u32 index) {
        CHECK_BOUNDS<u32>(index, 0, this->length);
        return this->pElements[index];
    }
};

}