
export module core.type_info;
import core.types;

export namespace std {

    class type_info;
    class bad_cast;
    class bad_typeid;

    class type_info {
    public:
        virtual ~type_info();
        constexpr bool operator==(const type_info& rhs) const noexcept;
        bool before(const type_info& rhs) const noexcept;
        size_t hash_code() const noexcept;
        const char* name() const noexcept;
    
        type_info(const type_info&) = delete;                   // cannot be copied
        type_info& operator=(const type_info&) = delete;        // cannot be copied
    };
}