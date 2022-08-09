
export module core.array2d;
import core.debug;
export import core.types;
export import core.meta;
export import core.allocator;
export import core.initializer_list;
export import core.math;

export{

template<typename T, template<typename...> typename TGenericSelf, Allocator TAllocator = Borrow>
struct Array2DBase : TAllocator::template TBase<T, TAllocator, TGenericSelf>  {
    using TAllocatorHandle = typename TAllocator::Handle;
    using TBase = typename TAllocator::template TBase<T, TAllocator, TGenericSelf>;

    vec2<u32> const size;

    inline constexpr Array2DBase() :
        TBase{},
        size{ } {}

    inline constexpr Array2DBase(vec2<u32> size, T* pElements, TAllocatorHandle allocatorHandle = TAllocatorHandle{}) :
        TBase{ size.x*size.y, pElements },
        size{ size } {}

    inline constexpr Array2DBase(vec2<u32> size, TAllocatorHandle allocatorHandle = TAllocatorHandle{}) :
        TBase{ size.x*size.y, allocatorHandle },
        size{ size } {}

    inline constexpr u32 Width() const { return this->width; }
    inline constexpr u32 Height() const { return this->height; }

    inline T& Get(u32 x, u32 y) const {
        return this->pElements[y * size.x + x];
    }
};

template<typename T, Allocator TAllocator = Borrow>
struct Array2D : Array2DBase<T, Array2D, TAllocator>  {
    using Array2DBase<T, Array2D, TAllocator>::Array2DBase;
};

}