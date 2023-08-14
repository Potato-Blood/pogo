// package: pogo.events
// file: event.proto

import * as jspb from "google-protobuf";

export class KeyboardEvent extends jspb.Message {
  getState(): PRESS_RELEASEMap[keyof PRESS_RELEASEMap];
  setState(value: PRESS_RELEASEMap[keyof PRESS_RELEASEMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KeyboardEvent.AsObject;
  static toObject(includeInstance: boolean, msg: KeyboardEvent): KeyboardEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: KeyboardEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KeyboardEvent;
  static deserializeBinaryFromReader(message: KeyboardEvent, reader: jspb.BinaryReader): KeyboardEvent;
}

export namespace KeyboardEvent {
  export type AsObject = {
    state: PRESS_RELEASEMap[keyof PRESS_RELEASEMap],
  }
}

export class MouseMoveEvent extends jspb.Message {
  getDeltax(): number;
  setDeltax(value: number): void;

  getDeltay(): number;
  setDeltay(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MouseMoveEvent.AsObject;
  static toObject(includeInstance: boolean, msg: MouseMoveEvent): MouseMoveEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MouseMoveEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MouseMoveEvent;
  static deserializeBinaryFromReader(message: MouseMoveEvent, reader: jspb.BinaryReader): MouseMoveEvent;
}

export namespace MouseMoveEvent {
  export type AsObject = {
    deltax: number,
    deltay: number,
  }
}

export class MousePressEvent extends jspb.Message {
  getState(): PRESS_RELEASEMap[keyof PRESS_RELEASEMap];
  setState(value: PRESS_RELEASEMap[keyof PRESS_RELEASEMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MousePressEvent.AsObject;
  static toObject(includeInstance: boolean, msg: MousePressEvent): MousePressEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MousePressEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MousePressEvent;
  static deserializeBinaryFromReader(message: MousePressEvent, reader: jspb.BinaryReader): MousePressEvent;
}

export namespace MousePressEvent {
  export type AsObject = {
    state: PRESS_RELEASEMap[keyof PRESS_RELEASEMap],
  }
}

export class MouseEvent extends jspb.Message {
  hasMousemoveevent(): boolean;
  clearMousemoveevent(): void;
  getMousemoveevent(): MouseMoveEvent | undefined;
  setMousemoveevent(value?: MouseMoveEvent): void;

  hasMousepressevent(): boolean;
  clearMousepressevent(): void;
  getMousepressevent(): MousePressEvent | undefined;
  setMousepressevent(value?: MousePressEvent): void;

  getEventCase(): MouseEvent.EventCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MouseEvent.AsObject;
  static toObject(includeInstance: boolean, msg: MouseEvent): MouseEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MouseEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MouseEvent;
  static deserializeBinaryFromReader(message: MouseEvent, reader: jspb.BinaryReader): MouseEvent;
}

export namespace MouseEvent {
  export type AsObject = {
    mousemoveevent?: MouseMoveEvent.AsObject,
    mousepressevent?: MousePressEvent.AsObject,
  }

  export enum EventCase {
    EVENT_NOT_SET = 0,
    MOUSEMOVEEVENT = 1,
    MOUSEPRESSEVENT = 2,
  }
}

export class VoiceEvent extends jspb.Message {
  getVoiceevent(): VoiceEvent.VOICE_EVENTMap[keyof VoiceEvent.VOICE_EVENTMap];
  setVoiceevent(value: VoiceEvent.VOICE_EVENTMap[keyof VoiceEvent.VOICE_EVENTMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VoiceEvent.AsObject;
  static toObject(includeInstance: boolean, msg: VoiceEvent): VoiceEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VoiceEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VoiceEvent;
  static deserializeBinaryFromReader(message: VoiceEvent, reader: jspb.BinaryReader): VoiceEvent;
}

export namespace VoiceEvent {
  export type AsObject = {
    voiceevent: VoiceEvent.VOICE_EVENTMap[keyof VoiceEvent.VOICE_EVENTMap],
  }

  export interface VOICE_EVENTMap {
    ON: 0;
    OFF: 1;
  }

  export const VOICE_EVENT: VOICE_EVENTMap;
}

export class HatEvent extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HatEvent.AsObject;
  static toObject(includeInstance: boolean, msg: HatEvent): HatEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HatEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HatEvent;
  static deserializeBinaryFromReader(message: HatEvent, reader: jspb.BinaryReader): HatEvent;
}

export namespace HatEvent {
  export type AsObject = {
  }
}

export class Event extends jspb.Message {
  hasKeyboardevent(): boolean;
  clearKeyboardevent(): void;
  getKeyboardevent(): KeyboardEvent | undefined;
  setKeyboardevent(value?: KeyboardEvent): void;

  hasMouseevent(): boolean;
  clearMouseevent(): void;
  getMouseevent(): MouseEvent | undefined;
  setMouseevent(value?: MouseEvent): void;

  hasVoiceevent(): boolean;
  clearVoiceevent(): void;
  getVoiceevent(): VoiceEvent | undefined;
  setVoiceevent(value?: VoiceEvent): void;

  hasHatevent(): boolean;
  clearHatevent(): void;
  getHatevent(): HatEvent | undefined;
  setHatevent(value?: HatEvent): void;

  getEventCase(): Event.EventCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Event.AsObject;
  static toObject(includeInstance: boolean, msg: Event): Event.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Event, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Event;
  static deserializeBinaryFromReader(message: Event, reader: jspb.BinaryReader): Event;
}

export namespace Event {
  export type AsObject = {
    keyboardevent?: KeyboardEvent.AsObject,
    mouseevent?: MouseEvent.AsObject,
    voiceevent?: VoiceEvent.AsObject,
    hatevent?: HatEvent.AsObject,
  }

  export enum EventCase {
    EVENT_NOT_SET = 0,
    KEYBOARDEVENT = 1,
    MOUSEEVENT = 2,
    VOICEEVENT = 3,
    HATEVENT = 4,
  }
}

export interface PRESS_RELEASEMap {
  PRESSED: 0;
  RELEASED: 1;
}

export const PRESS_RELEASE: PRESS_RELEASEMap;

