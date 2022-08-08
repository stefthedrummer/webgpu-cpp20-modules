(module
  (func $externref_get (param $idx i32) (result externref)
    local.get $idx
    table.get $externref_table
  )
  (func $externref_set (param $idx i32) (param $ref externref)
    local.get $idx
    local.get $ref
    table.set $externref_table
  )
  (func $externref_copy (param $idxDest i32) (param $idxSrc i32)
    local.get $idxDest
    local.get $idxSrc
    table.get $externref_table
    table.set $externref_table
  )
  (func $externref_clear (param $idx i32)
    local.get $idx
    ref.null extern
    table.set $externref_table
  )
  (func $externref_size (result i32)
    table.size $externref_table
  )
  (func $externref_grow (param $size i32)
    ref.null extern
    local.get $size
    table.grow $externref_table
    drop
  )
  (table $externref_table 1024 externref)
  (export "externref_table" (table $externref_table))
  (export "externref_get" (func $externref_get))
  (export "externref_set" (func $externref_set))
  (export "externref_clear" (func $externref_clear))
  (export "externref_grow" (func $externref_grow))
)