
<img src="https://github.com/stefthedrummer/webgpu-cpp20-modules/blob/main/.github/banner.png" height="200" />

# WebGPU with C++20 Modules - Game Framework

This project enables developing games with Web-GPU and C++20-Modules.
- A ```bind-generator``` that generates C++ to javascript bindings.
- A very minimal build-tool I called **clang-make** that can build C++20 Modules and generate metadata for the ```clangd``` language server (intelli-sense).
  It can compile cppm, cpp, wat (Web-Assembly-Text-Files) and link them together.
- A minimal ```Core Library``` that contributes stuff like Arrays, Js-Handles, move-support, initializer-list-support
- A a little sample that displays a texture on the screen

# Setup
_(Tested on Windows/Linux and VS-Code)_

Requirements:
| Item                | Minimum Version | Build | IDE | Execution |                                                      |
| ------------------- | --------------- | ----- | --- | --------- | ---------------------------------------------------- |
| Chrome              | v94             |       |     | X         |                                                      |
| Clang/LLvmm         | 14.0.6          | X     |     |           |                                                      |
| npm                 |                 | X     | X   |           |                                                      |
| node                | 16              | X     | X   |           |                                                      |
| ts-node             | 10.7.0          | X     | X   |           |                                                      |
| VS-Code             | any             |       | X   |           |                                                      |
| VS-Code::LiveServer | any             |       | X   |           |                                                      |
| VS-Code::Clangd     | any             |       | X   |           |                                                      |
| WABT Binary Toolkit | any             | X     |     |           | [link](https://github.com/WebAssembly/wabt/releases) |


Steps:
- clone
- execute ```bash setup.sh``` _(on Windows use git-bash)_ 
- fire up Vs-Code
- fire up LiveServer
- navigate ```http://localhost/bin/```
  
_(must be ```localhost``` not ```127.0.0.1``` because the webgpu-feature is enabled with a origin-trial meta-tag ```<meta http-equiv="origin-trial" ...>```)_ that is only valid for the ```localhost``` url. This will not be needed anymore, once the webgpu is fully released.

<img src="https://github.com/stefthedrummer/webgpu-cpp20-modules/blob/main/.github/screenshot.png" height="300" />

# Build

Since we're civilized by using C++ Modules cmake is out - for now. But I have written an incremental build-tool, that lies under ./clang-make/.
Under VS-Code it is configured as the default build step.

- The build tool automaticaly generates a ./compile_commands.Json file that gets used by the clangd language server. It provides highlighting and auto-complete.
- Sometimes clangd hickups but it can be restarted with ```CTRL+SHIFT+P``` > "clangd restart ..."
- To Make a clean build - delete ```./bin/build/clang-make-cache.Json```

To start a build run:
- ```ts-node clang-make/clang-make.ts```
- or press ```CTRL+B``` in VS-Code

<img src="https://github.com/stefthedrummer/webgpu-cpp20-modules/blob/main/.github/clang-make.png" height="200" />

Clang-Make finds all sources automatically and is configured under ```./clang-make/clang-make.ts```.

# Folder Structure

| File/Dir                                | Explanation                                                                     |
| --------------------------------------- | ------------------------------------------------------------------------------- |
| ```./app   ```                          | Your C++ code                                                                   |
| ```./bin/assets```                      | Your assets                                                                     |
| ```./bin/build/bin```                   | output for object-files                                                         |
| ```./bin/build/modules```               | output for precompiled-module-files                                             |
| ```./bin/build/clang-make-cache.Json``` | build-tool cache                                                                |
| ```./bindgen```                         | the c++ to Js binding generator used to generate the webgpu api and other stuff |
| ```./clang-make```                      | src of the build-tool                                                           |
| ```./engine```                          | library code                                                                    |

# Core-Library :: Memory-Management

The library makes use of allocators. Currently there are 3:

| Allocator    | Explanation                     |
| ------------ | ------------------------------- |
| ```Borrow``` | a borowed object - like in rust |
| ```Heap```   | a heap-allocated object         |
| ```Scope```  | a stack-allocated object        |

By default every memory-managed object uses the ```Borrow``` allocator when not specified,
this is usefull because a lot of occurences are parameters, and we most likely wanna borrow the object. 

```cpp
Array<u32> /*same as */ Array<u32, Borrow>
```

I tried to make the code as save as possible by not allowing implicit copies of non-borrowed resources.

```cpp
Array<u32, Heap> myArray{16};
Array<u32>       myOtherArray0{myArray}; // allowed!
Array<u32>       myOtherArray0 = myArray; // allowed!
Array<u32, Heap> myOtherArray1{myArray}; // compilation error!
Array<u32, Heap> myOtherArray2 = myArray; // compilation error!
Array<u32, Heap> myOtherArray4 = myArray.Copy(); // allowed!
Array<u32, Heap> myOtherArray5 = move(myArray); // allowed!
```

# Core-Library :: Scopes Chapter 1 :: Stack-Allocation 

I really like the simplicity of high-level-languages, but only if it doesn't cost me performance.
When we pass deeply nested structures with some arrays to the js-side, we get a problem in vanilla C++.
- The bind-generator only accepts ```Array<T>```s, because it wants to know about the ```length``` and the ```allocator``` of that array - So a ```T*``` doesn't cut it.
- Also, Defining arrays inline is a must feature IMHO, so I hacked out the following:

By defining a ```Scope``` the library has deterministic way of handling **stack allocations**.
For convenience, I put an overload of the ```[] operator``` on Scope, so we can easily stack-allocated some arrays.
When the Scope goes "out of scope" - hence the name -  the stack-space is reclaimed. (= when ```Scope::~Scope``` gets called)

```cpp
Array<u32, Scope> intArray = scope[{1, 2, 3}];
```

Notice, that the returned array knows that it has been allocated by a scope.
Here another example:

```cpp
Scope scope{};

this->hBindGroupLayout0 = !hDevice->CreateBindGroupLayout(
    GPUBindGroupLayoutDescriptor{
    .entries = scope[{ //  stack-allocated array
        GPUBindGroupLayoutEntry{
            .binding = 0,
            .visibility = GPUShaderStageFlags::VERTEX | GPUShaderStageFlags::FRAGMENT,
            .sampler = GPUSamplerBindingLayout{}
        },
        GPUBindGroupLayoutEntry{
            .binding = 1,
            .visibility = GPUShaderStageFlags::VERTEX | GPUShaderStageFlags::FRAGMENT,
            .texture = GPUTextureBindingLayout{.viewDimension = GPUTextureViewDimension::_2d_Array }
        } ,
        GPUBindGroupLayoutEntry{
            .binding = 2,
            .visibility = GPUShaderStageFlags::VERTEX | GPUShaderStageFlags::FRAGMENT,
            .buffer = GPUBufferBindingLayout{
                .type = GPUBufferBindingType::Uniform
            }
        }
        }] }, & scope);
```

# Core-Library :: Scopes Chapter 2 :: Js-References

Holding onto Js-references is a little bit more involved.
It is technically not possible to hold onto Js-objects from the web-assembly heap - but - it is possible to allocate a special ```externref-table``` that can store such references. These can be referenced from inside a wasm-module by just holding an index.
In the framework a reference to an Js-object is called a ```Handle```.

Thankfully this is abstracted away. We only have to tell the framework whether a handler is temporary or persistent.
There are 2 types of handles:

| Handle                    | Explanation                                                |
| ------------------------- | ---------------------------------------------------------- |
| ```LocalHandle<T>```      | temporary handle, gets gc-ed at the end of the ```scope``` |
| ```PersistentHandle<T>``` | persistent handle, doesn't get gc-ed                       |
| (```Handle<T>```)         | used in parameters - means any handle                      |

Everytime a C++-to-Js-Call returns a Js-object, the 
bind-generator gives us a Handle instead.
Therefore space has to be allocated in the ```externref-table``` - this is what ```scope{1}``` does.
_(Allocating space in the extern-ref table is always O(1), no matter the size, since a stack-allocation technique is used )_

The LocalHandle is valid until ```Scope::~Scope``` is called. So everythin cleans itself - just by C++ lifetime-rules.

```cpp
Scope scope{1 /*Allocate 1 slot in the extern-ref table*/};
LocalHandle<GPUCommandEncoder> hCommandEncoder = hDevice->CreateCommandEncoder(&scope);
```

To make a handle persistent, one can use
- the ```.Persistent()``` method
- or the ```"!" operator```

```cpp
Scope scope{1};
PersistentHandle<GPUCommandEncoder> hCommandEncoder = hDevice->CreateCommandEncoder(&scope).Persistent();
// or
PersistentHandle<GPUCommandEncoder> hCommandEncoder = !hDevice->CreateCommandEncoder(&scope);
```

Furthermore every handle is implicitly convertible to just ```Handle<T>```.
Some times - when the compiler cannot infer that conversion - e.g. when using templated functions or so - you can **weaken**
a handle explicitly with the ```"~" operator```.

```cpp
PersistentHandle<GPUCommandEncoder> hCommandEncoder;
SomeFunctionCall(~hCommandEncoder);
```

# more coming soon ...
