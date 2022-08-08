import { generate_resources } from "./generate-resources-api";
import { generate_sprite_atlas } from "./generate-sprite-atlas-api";
import { generate_uiEvents } from "./generate-ui-events";
import { generate_web_gpu } from "./generate-webgpu-api";

generate_resources();
generate_sprite_atlas();
generate_web_gpu();
generate_uiEvents();