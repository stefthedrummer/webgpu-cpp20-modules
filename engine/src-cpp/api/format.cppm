
export module api.format;
import core.types;
import core.allocator;
import core.array;

#define wasm_import(name) __attribute__((import_name(name)))

export {
namespace Format {

    enum class ArgType : u32 {
        Int = 1,
        Float = 2,
        Chars = 3
    };

    template<typename T>   inline constexpr ArgType arg_type = ArgType::Int;
    template<>             inline constexpr ArgType arg_type<float> = ArgType::Float;
    template<>             inline constexpr ArgType arg_type<char const*> = ArgType::Chars;

    struct Arg {
        ArgType const type;
        size_t val;
    };

    wasm_import("cpp_format") void cpp_format(u32 loggerFn, Array<Arg, Borrow>* pArgs);

    namespace impl {
        template<typename... Tn>
        inline void Format(u32 loggerFn, Tn... args) {
            constexpr u32 numArgs = sizeof...(Tn);

            Arg wrappedArgs[numArgs] = { Arg{arg_type<Tn>, *((size_t*)&args)}... };

            Array<Arg, Borrow> array{ numArgs, wrappedArgs };
            cpp_format(loggerFn, &array);
        }
    }

    template<typename... Tn>
    inline void Log(Tn... args) { impl::Format(0, args...); }

    template<typename... Tn>
    inline void Error(Tn... args) { impl::Format(1, args...); }

    template<typename... Tn>
    inline void Panic(Tn... args) { impl::Format(1, args...); __builtin_trap(); }
}

}