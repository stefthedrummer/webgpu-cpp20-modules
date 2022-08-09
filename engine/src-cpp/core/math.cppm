
export module core.math;
import core.types;

export template<typename T>
struct vec2 {
    T x;
    T y;

    inline vec2<T> operator +(vec2<T> const& o) const
    {
        return vec2<T>{x + o.x, y + o.y};
    }

    inline vec2<T> operator -(vec2<T> const& o) const
    {
        return vec2<T>{x - o.x, y - o.y};
    }

    template<typename S>
    inline vec2<T> operator *(S  s) const
    {
        return vec2<T>{x* s, y* s};
    }

    template<typename S>
    inline vec2<T> operator +(S const& o) const
    {
        return vec2<T>{x + o, y + o};
    }

    template<typename C>
    inline explicit operator vec2<C>() {
        return vec2<C> { (C)x, (C)y };
    }

    template<typename C>
    inline constexpr vec2<C> Map(C(fn)(T s)) {
        return { fn(this->x), fn(this->y)  };
    }
};

export inline constexpr u32 nextPowOf2(u32 v) {
    return 1 << (32 - __builtin_clz(v - 1));
}

export inline f32 floor(f32 v) { return  __builtin_floorf(v); }
export inline vec2<f32> floor(vec2<f32> const& v) { return vec2<f32>{__builtin_floorf(v.x), __builtin_floorf(v.y)}; }



export template<typename T>
struct rgba {
    union {
        T val[4];
        struct {
            T r;
            T g;
            T b;
            T a;
        };
    };

    T& operator[](u32 index) {
        return val[index];
    } 
};

export struct f16 {
private:
    u16 _bits;
    f16(u16 _bits) : _bits{_bits} {}
public:
    static inline f16 From_f32(float val_f32) {
        u32 val = *((u32*)&val_f32);
        return {(u16)(((val & 0xC0000000) >> 16) | ((val & 0x7FFE000) >> 13))};
    }
};
static_assert(sizeof(f16) == 2);
static_assert(alignof(f16) == 2);

export struct snorm8 {
private:
    i8 _bits;
    snorm8(i8 _bits) : _bits{_bits} {}
public:
    static inline snorm8 From_f32_Clamped(float val_f32) {
        return {(i8)__builtin_fmaxf(-128.0f, __builtin_fminf(val_f32 * 127.0f, +127.0f))};
    }

    static inline snorm8 From_i8(i8 val_i8) {
        return {val_i8};
    }
};