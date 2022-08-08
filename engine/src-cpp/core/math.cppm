
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
};

export inline constexpr u32 nextPowOf2(u32 v) {
    return 1 << (32 - __builtin_clz(v - 1));
}

export inline f32 floor(f32 v) { return  __builtin_floorf(v); }
export inline vec2<f32> floor(vec2<f32> const& v) { return vec2<f32>{__builtin_floorf(v.x), __builtin_floorf(v.y)}; }
