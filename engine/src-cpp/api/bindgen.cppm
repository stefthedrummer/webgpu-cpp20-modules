export module api.bindgen;
import api.console;
import core.wasm;
import core.types;
import core.debug;
import core.array;
import core.buffer;
import core.allocator;
import core.initializer_list;

#define wasm_import(name) __attribute__((import_name(name)))
#define wasm_export(name) __attribute__((export_name(name)))

export
template<typename Ta, typename Tb>
inline constexpr bool InterfaceCompatibilityTable = false;
template<typename T>
inline constexpr bool InterfaceCompatibilityTable<T, T> = true;

export template<typename FromHandle, typename Tb>
concept CompatibleHandle = InterfaceCompatibilityTable<typename FromHandle::Type_T, Tb>;

struct ExternRefState {

    u32 const externrefSize;
    u32 const halfExternrefSize;

    u32 stackPointer{};
    u32* freePersistentHandleSlots{};
    u32 freePersistentHandlePointer{};

    ExternRefState() :
        externrefSize{externref_size()},
        halfExternrefSize{externref_size() / 2} {

        stackPointer = halfExternrefSize - 1;

        // List of free externref slots.
        freePersistentHandleSlots = new u32[halfExternrefSize];
        freePersistentHandlePointer = 0;

        for (u32 i = 0; i < halfExternrefSize; i++) {
            freePersistentHandleSlots[i] = halfExternrefSize + i;
        }
    }

    u32 PersistentHandleCount() {
        return freePersistentHandlePointer;
    }

    u32 AcquirePersistent() {
        if constexpr(DEBUG) {
            if (freePersistentHandlePointer >= halfExternrefSize) {
                Console::Panic("Out of persistent-handle space");
            }
        }
        
        u32 slot = freePersistentHandleSlots[freePersistentHandlePointer];
        freePersistentHandleSlots[freePersistentHandlePointer] = 0;
        freePersistentHandlePointer++;
        return slot;
    }

    void ReleasePersistent(u32 slot) {
        if constexpr(DEBUG) {
            if (freePersistentHandleSlots[slot] != 0) {
                Console::Panic("ReleasePersistent on non-acquired slot");
            }
        }
        externref_clear(slot);
        freePersistentHandleSlots[--freePersistentHandlePointer] = slot;
    }
};

struct VirtualStackState {
    u8* stackBegin;
    u8* stackPointer;
    u8* stackEnd;

    VirtualStackState(u32 virtualStackSize) {
        stackBegin = (u8*)malloc(virtualStackSize);
        stackPointer = stackBegin;
        stackEnd = stackBegin + virtualStackSize;
    }
};

ExternRefState g_externrefState{};
VirtualStackState g_virtualStackState{1024 * 1024 * 1};

wasm_export("cpp_acquirePersistent") u32 cpp_acquirePersistent() {
    return g_externrefState.AcquirePersistent();
}

export u32 PersistentHandleCount() {
    return g_externrefState.PersistentHandleCount();
}

export template<typename T>
struct LocalHandle;
export template<typename T>
struct PersistentHandle;

export template<typename T>
struct Handle {
    using Type_T = T;
    u32 handle;

    Handle() : handle{} {};
    Handle(u32 handle) : handle{ handle } {};

    template<CompatibleHandle<T> H>
    Handle(H h) : handle{ h.handle } {};

    template<CompatibleHandle<T> H>
    Handle<T>& operator =(H h) {
        handle = h.handle;
        return *this;
    }

    T* operator ->() const {
        return (T*)this;
    }
};

export template<typename T>
struct PersistentHandle {
    using Type_T = T;
    u32 handle;

    T* operator ->() const { return (T*)this; }
    operator Handle<T>() { return Handle<T>{ handle }; }
    Handle<T> operator ~() { return Handle<T>{ handle }; }

    void Release() {
        g_externrefState.ReleasePersistent(handle);
        handle = 0;
    }

    static PersistentHandle<T> Allocate() {
        return { g_externrefState.AcquirePersistent() };
    }

    void Set(Handle<T> handle) {
        externref_copy(this->handle, handle.handle);
    }
};

export template<typename T>
struct LocalHandle {
    using Type_T = T;
    u32 handle;

    T* operator ->() const { return (T*)this; }
    operator Handle<T>() { return Handle<T>{ handle }; }
    Handle<T> operator ~() { return Handle<T>{ handle }; }
    PersistentHandle<T> operator !() { return Persistent(); }

    PersistentHandle<T> Persistent() {
        //Console::Log(T::Name);
        u32 persistentHandle{ g_externrefState.AcquirePersistent() };
        externref_copy(persistentHandle, handle);
        return PersistentHandle<T>{ persistentHandle };
    }
};


export template<typename V>
struct RecordEntry {
    char const* key;
    V val;
};

export template<typename T>
struct Optional {
    bool isPresent;
    T val;

    constexpr Optional() :
        isPresent{ false },
        val{} {}

    constexpr Optional(T&& val) :
        isPresent{ true },
        val{ val } {
    }

    constexpr Optional(T& val) :
        isPresent{ true },
        val{ val } {
    }

    constexpr Optional(T const& val) :
        isPresent{ true },
        val{ val } {
    }
};

export struct Scope {
    template<typename T, Allocator TAllocator, template<typename...> typename TTemplate, typename... Tn>
    using TBase = Owned<T, TAllocator, TTemplate, Tn...>;

    struct ExternRefScope {
        u32 capacity;
        u32 stackPointer;
        u32 stackFrame;

        ExternRefScope(u32 capacity) :
            capacity{ capacity },
            stackFrame{ g_externrefState.stackPointer },
            stackPointer{ g_externrefState.stackPointer } {
            g_externrefState.stackPointer -= capacity;
        }
        ~ExternRefScope() {
            u32 ptr = stackPointer;
            while (ptr < stackFrame) {
                externref_clear(++ptr);
            }
            g_externrefState.stackPointer = stackFrame;
        }

        inline u32 AcquireLocal() {
            if constexpr (DEBUG) {
                if (stackPointer <= stackFrame - capacity) {
                    Console::Panic(ErrorCode::HandleStackOverflow);
                }
            }
            return stackPointer--;
        }
    };

    struct VirtualStackScope {

        u8* stackFrame;

        VirtualStackScope() {
            stackFrame = g_virtualStackState.stackPointer;

        }
        ~VirtualStackScope() {
            g_virtualStackState.stackPointer = stackFrame;
        }

        void* Alloc(u32 size) {
            if constexpr (DEBUG) {
                if (g_virtualStackState.stackEnd < g_virtualStackState.stackPointer + size) {
                    Console::Panic(ErrorCode::VirtualStackStackOverflow);
                }
            }
            void* ptr = g_virtualStackState.stackPointer;
            g_virtualStackState.stackPointer += size;
            return ptr;
        }
    };

    ExternRefScope externrefScope;
    VirtualStackScope virtualStackScope;

    Scope(Scope const&) = delete;
    Scope(Scope&&) = delete;

    Scope(u32 externRefCapacity = 0) : externrefScope{ externRefCapacity } {}

    struct Handle {
        friend class Scope;
        Scope* pScope;

        Handle() = delete;
        Handle(Scope* pScope) : pScope{ pScope } { }

        void* Alloc(u32 size) { return pScope->virtualStackScope.Alloc(size); }
        inline void Free(void* pPtr) { }
    };

    template<typename T>
    Array<T, Scope> operator[](std::initializer_list<T> init) {
        return Array<T, Scope>::From(init, Handle{ this });
    }

    template<typename T>
    Array<T, Scope> CreateArray(u32 length) {
        return Array<T, Scope>{length, Handle{ this }};
    }
};
static_assert(Allocator<Scope>);

