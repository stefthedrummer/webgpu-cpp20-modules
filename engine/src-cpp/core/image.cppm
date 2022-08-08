
export module core.image;
import api.resources;
import api.format;
import core.wasm;
import core.types;
import core.allocator;

export struct Texel {
    u8 r;
    u8 g;
    u8 b;
    u8 a;
};

export template<Allocator TAllocator>
struct Image : TAllocator::template Base<Texel, TAllocator, Image>  {
    template<Allocator> friend class ImageImpl;

    using AllocatorHandle = typename TAllocator::Handle;

    u32 width;
    u32 height;
    Memory<Texel, TAllocator> mem;

    Image(Image&) = default;
    Image(Image&&) = default;

    Image(u32 width, u32 height, Texel* pTexels) :
        width{ width },
        height{ height },
        mem{ width * height, pTexels } { }

    Image(u32 width, u32 height, AllocatorHandle allocatorHandle = AllocatorHandle{}) :
        width{ width },
        height{ height },
        mem{ width * height, allocatorHandle } { }

    inline Texel& Get(u32 x, u32 y) {
        return mem.pElements[y * width + x];
    }

    Image<Heap> CreateSubImage(u32 dx, u32 dy, u32 w, u32 h, bool flipVertically) {
        if (dx < 0 || dy < 0 || dx + w > this->width || dy + h > this->height)
            Format::Panic(__FUNCTION__, ": sub-image overflows src-image");

        Image<Heap> dest{ w, h };

        if (flipVertically) {
            for (u32 y = 0; y < h; y++) {
                memcpy(&dest.Get(0, h - y - 1), &this->Get(dx, dy + y), w * sizeof(Texel));
            }
        }
        else {
            for (u32 y = 0; y < h; y++) {
                memcpy(&dest.Get(0, y), &this->Get(dx, dy + y), w * sizeof(Texel));
            }

        }

        return move(dest);
    }
};

export namespace Images {
    Image<Borrow> FromResourceDescriptor(ResourceDescriptor* pResourceDescriptor) {
        return Image<Borrow>{ pResourceDescriptor->width, pResourceDescriptor->height, (Texel*)pResourceDescriptor->pData };
    }
}