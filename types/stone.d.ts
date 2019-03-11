/// <reference types="minecraft-scripting-types-server" />

type BlockPos = [number, number, number];
type Vec3 = [number, number, number];
type Vec2 = [number, number];

interface CommandOrigin {
  name: string;
  blockPos: BlockPos;
  worldPos: Vec3;
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
  position: Vec3;
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
  overloads: CommandOverload<IStoneServerSystem<TSystem> & TSystem>[];
}

interface ItemInstance {
  name: string;
  custom_name: string;
  count: number;
}

interface BlockInfo {
  type: "compound";
  value: {
    name: string;
    states: {
      type: "compound";
      value: any;
    };
  };
}

interface IStoneServerSystem<TSystem>
  extends IServerSystem<IStoneServerSystem<TSystem> & TSystem> {
  /**
   * Print somthing to server log
   * @param object objects to be printed
   */
  log(...object: any[]): void;

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
   */
  registerSoftEnum(name: string, values: string[]): void;

  /**
   * Update a soft enum
   * @param name soft enum name
   * @param values soft enum values
   */
  updateSoftEnum(name: string, values: string[]): void;

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
  openModalForm(player: IEntity, form: string): Promise<string>;

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

  checkAbility(
    callback: (
      player: IEntity,
      ability: string,
      result: boolean
    ) => boolean | void
  ): void;
  checkDestroy(
    callback: (
      player: IEntity,
      pos: BlockPos,
      result: boolean
    ) => boolean | void
  ): void;
  checkBuild(
    callback: (
      player: IEntity,
      pos: BlockPos,
      result: boolean
    ) => boolean | void
  ): void;
  checkUse(
    callback: (
      player: IEntity,
      item: ItemInstance,
      result: boolean
    ) => boolean | void
  ): void;
  checkUseBlock(
    callback: (
      player: IEntity,
      block: BlockInfo,
      pos: BlockPos,
      result: boolean
    ) => boolean | void
  ): void;
  checkUseOn(
    callback: (
      player: IEntity,
      item: ItemInstance,
      pos: BlockPos,
      vec: Vec3,
      result: boolean
    ) => boolean | void
  ): void;
  checkInteract(
    callback: (
      player: IEntity,
      target: IEntity,
      vec: Vec3,
      result: boolean
    ) => boolean | void
  ): void;
  checkAttack(
    callback: (
      player: IEntity,
      target: IEntity,
      result: boolean
    ) => boolean | void
  ): void;
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

declare class SQLite3 {
  constructor(path: string);
  readonly valid: boolean;
  close(): void;
  exec(
    sql: string,
    callback?: (line: { [index: string]: string }) => void
  ): number;
  query(sql: string, params: SQLite3Param): Iterable<{ [index: string]: any }>;
  update(sql: string, params: SQLite3Param): number;
}

declare const globalThis: object;
