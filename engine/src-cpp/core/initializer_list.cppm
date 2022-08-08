
export module core.initializer_list;
import core.types;

export namespace std {
    template <class E>
    class initializer_list {
    public:
        using value_type = E;
        using reference = const E&;
        using const_reference = const E&;
        using __SIZE_TYPE__ype = __SIZE_TYPE__;

        using iterator = const E*;
        using const_iterator = const E*;

        constexpr initializer_list() noexcept : _First(nullptr), _Last(nullptr) {}

        constexpr initializer_list(const E* _First_arg, const E* _Last_arg) noexcept
            : _First(_First_arg), _Last(_Last_arg) {}

        [[nodiscard]] constexpr const E* begin() const noexcept {
            return _First;
        }

        [[nodiscard]] constexpr const E* end() const noexcept {
            return _Last;
        }

        [[nodiscard]] constexpr __SIZE_TYPE__ size() const noexcept {
            return static_cast<__SIZE_TYPE__>(_Last - _First);
        }

    private:
        const E* _First;
        const E* _Last;
    };

    template <class E>
    [[nodiscard]] constexpr const E* begin(initializer_list<E> _Ilist) noexcept {
        return _Ilist.begin();
    }

    template <class E>
    [[nodiscard]] constexpr const E* end(initializer_list<E> _Ilist) noexcept {
        return _Ilist.end();
    }
}
