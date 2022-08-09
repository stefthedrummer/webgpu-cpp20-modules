
export module core.image;
import api.resources;
import api.format;
import core.meta;
import core.math;
import core.types;
import core.allocator;
import core.array2d;

export template<Allocator TAllocator = Borrow>
struct Image : Array2DBase<rgba<u8>, Image, TAllocator>  {
  
    using Array2DBase<rgba<u8>, Image, TAllocator>::Array2DBase;

    Image(ResourceDescriptor* pResourceDescriptor) :
        Image{ {pResourceDescriptor->width, pResourceDescriptor->height}, (rgba<u8>*)pResourceDescriptor->pData } {
            static_assert(meta::type<TAllocator, Borrow>);
        }

    Image<Heap> CreateSubImage(u32 dx, u32 dy, u32 w, u32 h, bool flipVertically) const {
        if (dx < 0 || dy < 0 || dx + w > this->size.x || dy + h > this->size.y)
            Format::Panic(__FUNCTION__, ": sub-image overflows src-image");

        Image<Heap> dest{ {w, h} };

        if (flipVertically) {
            for (u32 y = 0; y < h; y++) {
                memcpy(&dest.Get(0, h - y - 1), &this->Get(dx, dy + y), w * sizeof(rgba<u8>));
            }
        }
        else {
            for (u32 y = 0; y < h; y++) {
                memcpy(&dest.Get(0, y), &this->Get(dx, dy + y), w * sizeof(rgba<u8>));
            }

        }

        return dest;
    }
};