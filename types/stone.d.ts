/// <reference types="minecraft-scripting-types-server" />

declare namespace Server {
  interface CommandOrigin {
    name: string;
    blockPos: [number, number, number];
    worldPos: [number, number, number];
    entity: IEntity;
    permissionLevel: 0 | 1 | 2 | 3 | 4;
  }
  type CommandTypes = {
    message: string;
    string: string;
    "soft-enum": string;
    int: number;
    block: object;
    float: number;
    bool: boolean;
    text: string;
    position: [number, number, number];
    selector: IEntity[];
    json: object;
    "player-selector": IEntity[];
  };
  type CommandArgument =
    | {
        name: string;
        type: Exclude<keyof CommandTypes, "soft-enum">;
        optional?: true;
      }
    | {
        name: string;
        type: "soft-enum";
        enum: string;
        optional?: true;
      };
  interface CommandOverload<TSystem> {
    parameters: CommandArgument[];
    handler: (this: TSystem, ...args: any[]) => void;
  }
  interface ActorInfo {
    name: string;
    identifier: IEntity["__identifier__"];
    pos: [number, number, number];
    dim: number;
    permission?: number;
    uuid?: string;
    xuid?: string;
  }

  interface ChatEventParameters {
    sender: IEntity;
    content: string;
  }

  interface CommandDefinition<TSystem> {
    description: string;
    permission: 0 | 1 | 2 | 3 | 4;
    overloads: CommandOverload<IStoneServerSystem<TSystem>>[];
  }

  interface IStoneServerSystem<TSystem>
    extends IServerSystem<IStoneServerSystem<TSystem>> {
    /** Broadcast a message (ExtAPI test), should same as broadcastEvent("minecraft:display_chat_event", message)  */
    broadcastMessage(message: string): void;

    /** Get current CommandOrigin inside Command Handler */
    currentCommandOrigin(): CommandOrigin;

    /**
     * Execute command as current command origin
     * @param command Command string (includes the slash)
     * @returns command execution result
     */
    invokeCommand(command: string): void;

    /**
     * Execute command as entity
     * @param entity the origin entity
     * @param command Command string (includes the slash)
     * @returns command execution result
     */
    invokeCommand(entity: IEntity, command: string): string;

    /**
     * Execute command as console
     * @param name console name
     * @param command Command string (includes the slash)
     * @returns command execution result
     */
    invokeConsoleCommand(name: string, command: string): string;

    /**
     * Execute command as entity (bypass the permission check)
     * @param entity the origin entity
     * @param command Command string (includes the slash)
     * @returns command execution result
     */
    invokePrivilegedCommand(entity: IEntity, command: string): string;

    /**
     * Register a global command
     * @param name command name
     * @param desc command description
     * @param level command permission level
     * @param overloads command overloads
     */
    registerCommand(name: string, overloads: CommandDefinition<TSystem>): void;

    /**
     * Register a soft enum
     * @param name soft enum name
     * @param values soft enum values
     * @param case_sensitive
     */
    registerSoftEnum(
      name: string,
      values: string[],
      case_sensitive?: boolean
    ): void;

    /**
     * Transfer player to host:port (/transferserver)
     * @param player target player
     * @param host target server hostname
     * @param port target server port
     */
    transferPlayer(player: IEntity, host: string, port: number): void;

    /**
     * Open a modal form for specify player
     * @param player target player
     * @param form form json string
     */
    openModalForm(
      player: IEntity,
      form: string
    ): Promise<null | Array<string | number | boolean | null> | string>;

    /**
     * Query actor info
     * @param actor target actor
     */
    actorInfo(actor: IEntity): ActorInfo;

    /**
     * mute the chat so that you can provide a alternative chat handler
     * @param flag unmute chat if false
     */
    muteChat(flag?: false): void;

    /**
     * Broadcast event to external program
     * @param name event name
     * @param data event data
     */
    broadcastExternalEvent(name: string, data: string): void;

    checkAbility(callback: (player: IEntity, ability: string, prev_result: boolean) => boolean | undefined): void
  }

  interface IVanillaServerSystemBase {
    /**
     * This event is triggered whenever a player send chat message.
     */
    listenForEvent(
      eventIdentifier: "stoneserver:chat_received",
      params: ChatEventParameters
    ): boolean | null;
  }

  type SQLite3Param =
    | {
        [index: string]: any;
      }
    | Array<any>;

  class SQLite3 {
    constructor(path: string);
    readonly valid: boolean;
    close(): void;
    exec(
      sql: string,
      callback?: (line: { [index: string]: string }) => void
    ): number;
    query(
      sql: string,
      params: SQLite3Param
    ): Iterable<{ [index: string]: any }>;
    update(sql: string, params: SQLite3Param): number;
  }

  const globalThis: object;
}
