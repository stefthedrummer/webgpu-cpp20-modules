
export module core.meta;
import core.types;

namespace detail {
    /**************************************************/
    template<typename Ta, typename Tb>
    inline constexpr bool type = false;
    template<typename T>
    inline constexpr bool type<T, T> = true;

    /**************************************************/
    template<typename F>
    struct field_pointer_type;

    template<typename T, typename C>
    struct field_pointer_type<T C::*> {
        using type = T;
    };

    /**************************************************/
    template<typename T>
    struct remove_reference { using type = T; };
    template<typename U>
    struct remove_reference<U&> { using type = U; };
    template<typename U>
    struct remove_reference<U&&> { using type = U; };

    /**************************************************/
    template<int index, auto... Tn>
    inline constexpr void* nth = nullptr;

    template<auto T0, auto... Tr>
    inline constexpr auto nth<0, T0, Tr...> = T0;
    template<auto T0, auto T1, auto T2, auto T3, auto... Tr>
    inline constexpr auto nth<0, T0, T1, T2, T3, Tr...> = T0;
    template<auto T0, auto T1, auto... Tr>
    inline constexpr auto nth<1, T0, T1, Tr...> = T1;
    template<auto T0, auto T1, auto T2, auto T3, auto... Tr>
    inline constexpr auto nth<1, T0, T1, T2, T3, Tr...> = T1;
    template<auto T0, auto T1, auto T2, auto... Tr>
    inline constexpr auto nth<2, T0, T1, T2, Tr...> = T2;
    template<auto T0, auto T1, auto T2, auto T3, auto... Tr>
    inline constexpr auto nth<2, T0, T1, T2, T3, Tr...> = T2;
    template<auto T0, auto T1, auto T2, auto T3, auto... Tr>
    inline constexpr auto nth<3, T0, T1, T2, T3, Tr...> = T3;

    template<int index, auto T0, auto T1, auto T2, auto T3, auto... Tr>
    inline constexpr auto nth<index, T0, T1, T2, T3, Tr...> = nth<index-4, Tr...>;
};

export namespace meta
{
    struct any {};

    /**************************************************/
    template<bool B>
    inline constexpr bool negate = false;
    template<>
    inline constexpr bool negate<true> = false;
    template<>
    inline constexpr bool negate<false> = true;

    /**************************************************/
    template<typename Ta, typename Tb>
    concept type = detail::type<Ta, Tb>;

    template<typename T, typename TTo>
    concept convertible_to = requires (T e) {
        (TTo)e;
    };

    template<typename T, typename... TTon>
    concept convertible_to_union = (convertible_to<T, TTon> || ...); 

    /**************************************************/
    template <typename T, typename... TOfn>
    concept union_type = (type<T, TOfn> || ...); 

    /**************************************************/
    template<auto F>
    using field_pointer_type = typename detail::field_pointer_type<decltype(F)>::type;
 
     /**************************************************/
    template<typename T>
    using remove_reference = typename detail::template remove_reference<T>::type;

    /**************************************************/
    template<int index, auto... Tn>
    inline constexpr auto nth = detail::nth<index, Tn...>;

    /**************************************************/
    template<class... TLambdas> struct overloads : TLambdas... { using TLambdas::operator()...; };
    template<class... TLambdas> overloads(TLambdas...) -> overloads<TLambdas...>;
};

export template<typename T>
inline constexpr meta::remove_reference<T>&& move(T&& expr) {
    return (meta::remove_reference<T>&&)expr;
}

export template<typename T, typename E>
inline constexpr u32 offsetOf(E T::* pOffset) {
    return (u32)&(((T*)nullptr)->*pOffset);
}