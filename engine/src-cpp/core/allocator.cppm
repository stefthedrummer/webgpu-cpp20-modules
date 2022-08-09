
export module core.allocator;
import api.console;
export import core.meta;
export import core.types;
import core.wasm;
import core.debug;

export{

struct Borrow;
struct Heap;

template<typename T>
struct Memory {
    u32 length;
    T* pElements;

    Memory() = default;

    Memory(u32 length, T* pElements) :
        length{ length },
        pElements{ pElements } {}
    
    inline constexpr Memory<u8> AsRawMemory() const {
        return Memory<u8>{ this->length * sizeof(T), (u8*)this->pElements };
    }
};

template<typename T, typename TAllocator>
struct ManagedMemory : Memory<T> {
    using ElementType = T;
    using AllocatorHandle = typename TAllocator::Handle;
    static_assert(sizeof(AllocatorHandle) <= sizeof(size_t));

protected:
    ManagedMemory(ManagedMemory&) = default;
    ManagedMemory(ManagedMemory&&) = delete;
    ManagedMemory& operator= (ManagedMemory&) = default;
    ManagedMemory& operator= (ManagedMemory&&) = delete;

public:
    AllocatorHandle allocatorHandle;

    ManagedMemory() = default;

    ManagedMemory(u32 length, T* pElements) :
        Memory<T>{ length, pElements },
        allocatorHandle{} {}

    ManagedMemory(u32 length, AllocatorHandle allocatorHandle) :
        Memory<T>{ length, (T*)allocatorHandle.Alloc(length * sizeof(T)) },
        allocatorHandle{ allocatorHandle } {}

    ~ManagedMemory() {
        this->allocatorHandle.Free(this->pElements);
        this->pElements = nullptr;
        this->length = 0;
    }
};


template <typename T>
concept Allocator = requires(typename T::Handle ah, u32 size, void* pPtr) {
    typename T::Handle;
    ah.Alloc(size);
    ah.Free(pPtr);
};

template<typename T, Allocator TAllocator, template<typename...> typename TGenericSelf, typename... Tn>
struct Owned : ManagedMemory<T, TAllocator> {
    using TAllocatorHandle = typename TAllocator::Handle;
    using TBorrow = TGenericSelf<Tn..., Borrow>;
    using THeap = TGenericSelf<Tn..., Heap>;

protected:
    Owned(Owned&) = default;
    Owned(Owned&&) = delete;
    Owned& operator= (Owned&) = default;
    Owned& operator= (Owned&&) = delete;

public:
    Owned() = default;
    Owned(u32 length, T* pElements) : ManagedMemory<T, TAllocator>{length, pElements} {}
    Owned(u32 length, TAllocatorHandle allocatorHandle) : ManagedMemory<T, TAllocator>{length, allocatorHandle} {}

    /*THeap Copy() {
        THeap copy{};
        __builtin_memcpy(&copy, this, sizeof(TGenericSelf<Tn..., TAllocator>));
        copy.pElements = (T*)TAllocatorHandle{}.Alloc(this->length * sizeof(T));
        __builtin_memcpy(copy.pElements, this->pElements, this->length * sizeof(T));
        return move(copy);
    }*/

    operator TBorrow() {
        TBorrow borrow{};
        __builtin_memcpy(&borrow, this, sizeof(TBorrow));
        return borrow;
    }
    
    TBorrow operator ~() {
        return (TBorrow)*this;
    }

    TBorrow* operator &() {
        return reinterpret_cast<TBorrow*>(this);
    }

    void operator <=(Owned&& o) {
        this->allocatorHandle.Free(this->pElements);
        
        //this->pElements = nullptr; (overridden anyways)
        //this->length = 0; (overridden anyways)
        __builtin_memcpy(this, &o, sizeof(Owned));

        o.pElements = nullptr;
        o.length = 0;
    }
};


template<typename T, Allocator TAllocator, template<typename...> typename TGenericSelf, typename... Tn>
struct Borrowed : ManagedMemory<T, TAllocator> {
    using TAllocatorHandle = typename TAllocator::Handle;
    using TBorrow = TGenericSelf<Tn..., Borrow>;

public:
    Borrowed() = default;
    Borrowed(Borrowed&&) = default;
    Borrowed(Borrowed&) = default;

    Borrowed(u32 length, T* pElements) : ManagedMemory<T, TAllocator>{length, pElements} {}
    Borrowed(u32 length, TAllocatorHandle allocatorHandle) : ManagedMemory<T, TAllocator>{length, allocatorHandle} {}
};


struct Borrow {
    struct Handle {
        inline void* Alloc(u32 size) {
            Console::Panic("you called Borrow::Alloc()");
            return nullptr;
        }
        inline void Free(void* pPtr) {}
    };

    template<typename T, Allocator TAllocator, template<typename...> typename TGenericSelf, typename... Tn>
    using TBase = Borrowed<T, TAllocator, TGenericSelf, Tn...>;
};

struct AllocatorDebugToken {
    u32 token0;
    u32 _padding0;
};

struct Heap {
    struct Handle {
        inline static void* Alloc(u32 size) {
            if constexpr (DEBUG) {
                void* pDebugPtr = malloc(sizeof(AllocatorDebugToken) + size);
                AllocatorDebugToken* pToken = (AllocatorDebugToken*)pDebugPtr;
                pToken->token0 = 0xDBDBDBDB;
                void* pPtr = (u8*)pDebugPtr + sizeof(AllocatorDebugToken);
                return pPtr;

            } else {
                return malloc(size);
            }
        }
        inline static void Free(void* pPtr) {
            if constexpr (DEBUG) {
                if(pPtr == nullptr) {
                } else {
                    void* pDebugPtr = (u8*)pPtr - sizeof(AllocatorDebugToken);
                    AllocatorDebugToken* pToken = (AllocatorDebugToken*)pDebugPtr;
                    if(pToken->token0 != 0xDBDBDBDB) {
                        Console::Panic(ErrorCode::MemoryAlreadyFreed);
                    }
                    pToken->token0 = 0;
                    free(pDebugPtr);
                }
            } else {
                free(pPtr);
            }
        }
    };

    template<typename T, Allocator TAllocator, template<typename...> typename TGenericSelf, typename... Tn>
    using TBase = Owned<T, TAllocator, TGenericSelf, Tn...>;
};

}

static_assert(Allocator<Borrow>);
static_assert(Allocator<Heap>);
