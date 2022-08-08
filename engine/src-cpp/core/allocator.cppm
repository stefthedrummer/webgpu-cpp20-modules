
export module core.allocator;
import api.console;
export import core.meta;
export import core.types;
import core.wasm;
export{

struct Borrow;
struct Heap;

template<typename T, typename TAllocator>
struct Memory {
    using ElementType = T;
    using AllocatorHandle = typename TAllocator::Handle;

    static_assert(sizeof(AllocatorHandle) <= sizeof(size_t));
    
    AllocatorHandle allocatorHandle;
    u32 length;
    T* pElements;

    Memory() = default;

    Memory(u32 length, T* pElements) :
        length{ length },
        pElements{ pElements },
        allocatorHandle{} {}

    Memory(u32 length, AllocatorHandle allocatorHandle) :
        length{ length },
        pElements{ (T*)allocatorHandle.Alloc(length * sizeof(T)) },
        allocatorHandle{ allocatorHandle } {}

    ~Memory() {
        allocatorHandle.Free(&pElements);
    }

    Memory<T, TAllocator> Copy(AllocatorHandle copyAllocatorHandle = AllocatorHandle{}) {
        Memory<T, TAllocator> copy{ this->length, copyAllocatorHandle };
        __builtin_memcpy( copy.pElements, this->pElements, this->length * sizeof(T));
        return move(copy);
    }
};


template <typename T>
concept Allocator = requires(typename T::Handle ah, u32 size, void* pPtr) {
    typename T::Handle;
    ah.Alloc(size);
    ah.Free(pPtr);
};

template<typename T, Allocator TAllocator, template<typename...> typename TTemplate, typename... Tn>
struct Owned {
    using AllocatorHandle = typename TAllocator::Handle;
public:
    Memory<T, TAllocator> mem;
    Owned() = default;
    Owned(Owned&&) = default;
    Owned(Owned&) = delete;
    Owned(Memory<T, TAllocator> mem) : mem{mem} {};
    Owned& operator= (Owned&&) = default;

    Owned(u32 length, T* pElements) : mem{length, pElements} {}
    Owned(u32 length, AllocatorHandle allocatorHandle) : mem{length, allocatorHandle} {}


    TTemplate<Tn..., Heap> Copy() {
        TTemplate<Tn..., Heap> copy/*{}*/;
        __builtin_memcpy(&copy, this, sizeof(TTemplate<Tn..., TAllocator>));
        copy.mem = copy.mem.Copy();
        return move(copy);
    }
    
    operator TTemplate<Tn..., Borrow>() {
        TTemplate<Tn..., Borrow> borrow;
         __builtin_memcpy(&borrow, this, sizeof(TTemplate<Tn..., Borrow>));
         return move(borrow);
    }
};


template<typename T, Allocator TAllocator, template<typename...> typename TTemplate, typename... Tn>
struct Borrowed {
    using AllocatorHandle = typename TAllocator::Handle;
public:
    Memory<T, TAllocator> mem;
    Borrowed() = default;
    Borrowed(Memory<T, TAllocator> mem) : mem{mem} {};
    Borrowed(Borrowed&&) = default;
    Borrowed(Borrowed&) = default;

    Borrowed(u32 length, T* pElements) : mem{length, pElements} {}
    Borrowed(u32 length, AllocatorHandle allocatorHandle) : mem{length, allocatorHandle} {}

    operator TTemplate<Tn..., Borrow>() {
        TTemplate<Tn..., Borrow> borrow;
         __builtin_memcpy(&borrow, this, sizeof(TTemplate<Tn..., Borrow>));
         return move(borrow);
    }
};


struct Borrow {
    struct Handle {
        inline void* Alloc(u32 size) {
            Console::Panic("you called Borrow::Alloc()");
            return nullptr;
        }
        inline void Free(void* pPtr) {}
    };

    template<typename T, Allocator TAllocator, template<typename...> typename TTemplate, typename... Tn>
    using Base = Borrowed<T, TAllocator, TTemplate, Tn...>;
};

struct Heap {
    struct Handle {
        inline static void* Alloc(u32 size) { return malloc(size); }
        inline static void Free(void* pPtr) { free(pPtr); }
    };

    template<typename T, Allocator TAllocator, template<typename...> typename TTemplate, typename... Tn>
    using Base = Owned<T, TAllocator, TTemplate, Tn...>;
};

}

static_assert(Allocator<Borrow>);
static_assert(Allocator<Heap>);
