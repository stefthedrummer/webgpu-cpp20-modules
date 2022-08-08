
export module core.buffer;
import core.debug;
import core.wasm;
import core.types;
import core.memory;
import core.math;
import core.meta;
import api.console;
export import core.initializer_list;

template<typename T>
class Buffer {
private:
    u32 _capacity;
    u32 _size;
    T* _pElement;

public:

    Buffer() :
        _pElement{ nullptr },
        _size{ 0 },
        _capacity{ 0 } {
    }

    Buffer(u32 initialCapacity, u32 initialSize = 0) :
        _pElement{ (T*)malloc(initialCapacity * sizeof(T)) },
        _size{ initialSize },
        _capacity{ initialCapacity } {
        CHECK_BOUNDS_INC<u32>(initialSize, 0, initialCapacity);
    }

    ~Buffer() {
        free(_pElement);
#if DEBUG
        __builtin_memset(this, 0, sizeof(Buffer));
#endif
    }

    u32 Size() const { return _size; }

    T* Pointer(u32 offset = 0) const {
        CHECK_BOUNDS_INC<u32>(offset, 0, _capacity);
        return &_pElement[offset];
    }

    T& operator[] (u32 index) const {
        CHECK_BOUNDS<u32>(index, 0, _size);
        return _pElement[index];
    }

    void EnsureCapacity(u32 ensureCapacity) {
        if (_capacity >= ensureCapacity)
            return;

        u32 newCapacity = nextPowOf2(ensureCapacity);
        T* pNewElements = (T*)malloc(newCapacity * sizeof(T));

        copy(pNewElements, _pElement, _capacity);
        free(_pElement);

        _capacity = newCapacity;
        _pElement = pNewElements;
    }

    void Push(T const& element) {
        EnsureCapacity(_size + 1);
        _pElement[_size++] = element;
    }

    T* Push() {
        EnsureCapacity(_size + 1);
        return &_pElement[_size++];
    }

    void Clear() {
        _size = 0;
    }

    void Resize(u32 size) {
        EnsureCapacity(size);
        _size = size;
    }
};

template<u32 Capacity >
class String {
private:
    char elements[Capacity];

public:
    u32 const capacity;
    u32 const length;

    constexpr String() :
        capacity{ Capacity },
        length{ 0 } {}

    constexpr String(char const* pChars, u32 length) :
        capacity{ Capacity },
        length{ length } {

        CHECK_BOUNDS_INC<u32>(length, 0, capacity);
        __builtin_strcpy(elements, pChars);
    }
};

