
export module game.game;
export import api;
export import core;
export import rendering;

import game.ui_event_handler; 

export struct Game {
    PersistentHandle<GPUDevice> hDevice{};
    PersistentHandle<GPUCanvasContext> hCanvasContext{};

    ResourceManager resourceManager{};
    Renderer renderer{};
    UIEventHandler uiEventHandler{&renderer};
};