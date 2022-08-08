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

    u32 const externrefSize = externref_size();

    u32 stackPointer{};
    u32* freePersistentHandleSlots{};
    u32 freePersistentHandlePointer{};

    ExternRefState() {
        u32 const halfExternrefSize = externrefSize / 2;

        stackPointer = halfExternrefSize - 1;

        // List of free externref slots.
        freePersistentHandleSlots = new u32[halfExternrefSize];
        freePersistentHandlePointer = 0;

        for (u32 i = 0; i < halfExternrefSize; i++) {
            freePersistentHandleSlots[i] = halfExternrefSize + i;
        }
    }

    u32 AcquirePersistent() {
        if (freePersistentHandlePointer >= externrefSize) {
            Console::Panic("Out of persistent-handle space");
        }
        u32 slot = freePersistentHandleSlots[freePersistentHandlePointer];
        freePersistentHandleSlots[freePersistentHandlePointer] = 0;
        freePersistentHandlePointer++;
        return slot;
    }

    void ReleasePersistent(u32 slot) {
#if DEBUG
        if (freePersistentHandleSlots[slot] != 0) {
            Console::Panic("ReleasePersistent on non-acquired slot");
        }
#endif
        externref_clear(slot);
        freePersistentHandleSlots[--freePersistentHandlePointer] = slot;
    }
};

struct VirtualStackState {
    u8* stackBegin;
    u8* stackPointer;

    VirtualStackState(u32 virtualStackSize) {
        stackBegin = (u8*)malloc(virtualStackSize);
        stackPointer = stackBegin;
    }
};

ExternRefState g_externrefState{};
VirtualStackState g_virtualStackState{1024 * 4};

wasm_export("cpp_acquirePersistent") u32 cpp_acquirePersistent() {
    return g_externrefState.AcquirePersistent();
}

export template<typename T>
struct LocalHandle;
export template<typename T>
struct PersistentHandle;

export template<typename T>
struct Handle {
    using Type_T = T;
    u32 handle;

    Handle(u32 handle) : handle{ handle } {};

    template<CompatibleHandle<T> H>
    Handle(H h) : handle{ h.handle } {};

    template<CompatibleHandle<T> H>
    Handle<T>& operator =(H h) {
        handle = h.handle;
        return *this;
    }

    T* operator ->() {
        return (T*)this;
    }
};

export template<typename T>
struct PersistentHandle {
    using Type_T = T;
    u32 handle;

    T* operator ->() { return (T*)this; }
    operator Handle<T>() { return Handle<T>{ handle }; }
    Handle<T> operator ~() { return Handle<T>{ handle }; }

    void Release() {
        g_externrefState.ReleasePersistent(handle);
        handle = 0;
    }
};

export template<typename T>
struct LocalHandle {
    using Type_T = T;
    u32 handle;

    T* operator ->() { return (T*)this; }
    operator Handle<T>() { return Handle<T>{ handle }; }
    Handle<T> operator ~() { return Handle<T>{ handle }; }
    PersistentHandle<T> operator !() { return Persistent(); }

    PersistentHandle<T> Persistent() {
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
    bool const isPresent;
    T val;

    constexpr Optional() :
        isPresent{ false },
        val{} {}

    constexpr Optional(T&& val) :
        isPresent{ true },
        val{ val } {
    }
};

export struct Scope {
    template<typename T, Allocator TAllocator, template<typename...> typename TTemplate, typename... Tn>
    using Base = Borrowed<T, TAllocator, TTemplate, Tn...>;

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
#if DEBUG
            if (stackPointer <= stackFrame - capacity) {
                Console::Error(ErrorCode::HandleStackOverflow);
            }
#endif
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
            void* ptr = g_virtualStackState.stackPointer;
            g_virtualStackState.stackPointer += size;
            return ptr;
        }
    };

    ExternRefScope externrefScope;
    VirtualStackScope virtualStackScope;

    Scope(Scope const&) = delete;
    Scope(Scope&&) = delete;

    Scope(u32 externRefCapacity) : externrefScope{ externRefCapacity } {}

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
        return Array<T, Scope>{init, Handle{ this }};
    }
};
static_assert(Allocator<Scope>);

