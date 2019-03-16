/// <reference types="./types/stone" />

checkApiLevel(1);

type MSystem = SystemType;

const system = server.registerSystem<MSystem>(0, 0);

system.initialize = function() {
  this.registerCommand("test", {
    description: "test command",
    permission: 0,
    overloads: [
      {
        parameters: [
          {
            type: "string",
            name: "str"
          }
        ],
        handler(origin, [str]) {}
      } as CommandOverload<MSystem, ["string"]>,
      {
        parameters: [
          {
            type: "player-selector",
            name: "str"
          }, {
            type: "message",
            name: "boom"
          }
        ],
        handler(origin, [players, message]) {}
      } as CommandOverload<MSystem, ["player-selector", "message"]>,
    ]
  });
};
