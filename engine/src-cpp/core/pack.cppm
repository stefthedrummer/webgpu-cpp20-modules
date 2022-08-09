
export module core.pack;
import core.types;
import core.allocator;
import core.array;

export struct Void {};

export template<typename... Tn>
struct Pack;

template<typename T0, typename... Tr>
constexpr Pack<T0, Tr...> Chain(T0 e, Pack<Tr...> n) { return Pack<T0, Tr...>{ e, n }; }

export template<>
struct Pack<> {
    template<typename Fn>
    constexpr auto Transform(Fn fn) const { return *this; }
    template<typename Fn, u32 startIndex = 0>
    constexpr auto TransformIndiced(Fn fn) const { return *this; }
    constexpr auto RemoveVoid() const { return *this; }

    template<typename T, Allocator TAllocator>
    constexpr void ToArray(Array<T, TAllocator>& array, u32 startIndex = 0) const {}

    constexpr u32 Length() const { return 0; }

    template<u32 i, typename TAdd>
    constexpr auto Add(TAdd e) {
        if constexpr(i==0) return Pack<TAdd>{e, {}};
        else return Chain(Void{}, this->template Add<i-1, TAdd>(e));
    }
};

export template<typename T0, typename... Tr>
struct Pack<T0, Tr...> {
    T0 _element;
    Pack<Tr...> _next;

    template<u32 i>
    auto& Get() {
        if constexpr (i==0) return _element;
        else return _next.template Get<i-1>();
    }

    template<typename Fn>
    constexpr auto Transform(Fn fn) const {
        return Chain( fn(_element), _next.Transform(fn) );
    }

    template<typename Fn, u32 startIndex = 0>
    constexpr auto TransformIndiced(Fn fn) const {
        return Chain( fn(_element, startIndex), _next.template TransformIndiced<Fn, startIndex+1>(fn));
    }

    constexpr auto RemoveVoid() const {
        if constexpr(meta::type<T0, Void>) {
            return _next.RemoveVoid();
        } else {
            return Chain(_element, _next.RemoveVoid());
        }
    }

    constexpr u32 Length() const { return 1 + _next.Length(); }

    template<typename T, Allocator TAllocator>
    constexpr void ToArray(Array<T, TAllocator>& array, u32 startIndex = 0) const {
        array[startIndex] = (T)_element;
        _next.ToArray(array, startIndex+1);
    }

    template<typename T, Allocator TAllocator>
    constexpr Array<T, TAllocator> ToArray(typename TAllocator::Handle allocatorHandle = {}) const {
        Array<T, TAllocator> array{ Length(), allocatorHandle };
        ToArray(array);
        return array;
    }

    template<u32 i, typename TAdd>
    constexpr auto Add(TAdd e) {
        if constexpr(i==0)  return Pack<TAdd, Tr...>{ e, _next};
        else return Chain(_element, _next.template Add<i-1, TAdd>(e) );
    }

    template<u32 i, typename TAdd>
    constexpr auto Set(TAdd e) {
        if constexpr(i==0)  return Pack<TAdd, Tr...>{ e, _next};
        else return Chain(_element, _next.template Add<i-1, TAdd>(e) );
    }
};

template<typename... Tn>
struct CreatePackImpl;
template<>
struct CreatePackImpl<> {
    static constexpr auto CreatePack() { return Pack<>{}; }
};
template<typename T0, typename... Tr>
struct CreatePackImpl<T0, Tr...> {
    static constexpr auto CreatePack(T0 e0, Tr... er) { return Pack<T0, Tr...>{ e0, CreatePackImpl<Tr...>::CreatePack(er...) }; }
};

export template<typename... Tn>
auto CreatePack(Tn... en) { return CreatePackImpl<Tn...>::CreatePack(en...); }
