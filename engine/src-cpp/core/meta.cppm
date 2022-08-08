
export module core.meta;

namespace detail {
    template<typename... Tn>
    struct get_same;
    template<typename T>
    struct get_same<T> {
        using type = T;
    };
    template<typename T>
    struct get_same<T, T> {
        using type = T;
    };
    template<typename Ta, typename Tb>
    struct get_same<Ta, Tb> {
        using type = void;
    };
    template<typename T, typename... Tn>
    struct get_same<T, Tn...> {
        using type = typename get_same<T, typename get_same<Tn...>::type>::type;
    };

    template<typename F>
    struct field_pointer_type;

    template<typename T, typename C>
    struct field_pointer_type<T C::*> {
        using type = T;
    };

    template<typename T>
    struct remove_reference {
        using type = T;
    };

    template<typename U>
    struct remove_reference<U&> {
        using type = U;
    };
};

export namespace meta
{
    struct any {};

    template<bool B>
    inline constexpr bool negate = false;
    template<>
    inline constexpr bool negate<true> = false;
    template<>
    inline constexpr bool negate<false> = true;

    template<typename... Tn>
    using get_same = typename detail::get_same<Tn...>::type;

    template<typename Ta, typename Tb>
    inline constexpr bool is_same = false;
    template<typename T>
    inline constexpr bool is_same<T, T> = true;

    template<typename Ta, typename Tb>
    concept IsSame = is_same<Ta, Tb>;

    template<auto F>
    using field_pointer_type = typename detail::field_pointer_type<decltype(F)>::type;
 
    template<typename T>
    using remove_reference = typename detail::template remove_reference<T>::type;
};

export template<typename T>
inline constexpr meta::remove_reference<T>&& move(T&& expr) {
    return (meta::remove_reference<T>&&)expr;
}
