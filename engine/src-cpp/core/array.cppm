
export module core.array;
import core.debug;
export import core.types;
export import core.meta;
export import core.allocator;
export import core.initializer_list;

export{


template<typename T, Allocator TAllocator = Borrow>
struct Array : TAllocator::template Base<T, TAllocator, Array, T>  {
    template<typename, Allocator> friend class Array;

    using AllocatorHandle = typename TAllocator::Handle;
    using Base = typename TAllocator::template Base<T, TAllocator, Array, T>;

    inline constexpr Array() :
        Base{} {}

    inline constexpr Array(u32 length, T* pElements, AllocatorHandle allocatorHandle = AllocatorHandle{}) :
        Base{ length, pElements } {}

    inline constexpr Array(u32 length, AllocatorHandle allocatorHandle = AllocatorHandle{}) :
        Base{ length, allocatorHandle } {}

    inline constexpr Array(std::initializer_list<T> init, AllocatorHandle allocatorHandle = AllocatorHandle{}) :
        Base{ init.size(), allocatorHandle } {

        __builtin_memcpy(this->mem.pElements, init.begin(), init.size() * sizeof(T));
    }

    inline constexpr u32 length() { return this->mem.length; }

    inline constexpr T& operator [] (u32 index) {
        CHECK_BOUNDS<u32>(index, 0, this->mem.length);
        return this->mem.pElements[index];
    }

    Array<T, Borrow> operator ~() {
         return move((Array<T, Borrow>)*this);
    }
};

}