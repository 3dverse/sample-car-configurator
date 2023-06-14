/** TYPE DEFINITIONS */

type Entity = {
  getComponent(name: string): any;
  setComponent(name: string, value: any): void;
};

type AssetDescription = {
  dataJson: {
    albedo?: [number, number, number];
    clearCoatRoughness?: number;
    clearCoatStrength?: number;
    emissionIntensity?: number;
  };
};

type Viewport = {
  getCamera(): Entity;
};

type Vec3 = [number, number, number];
type Vec4 = [number, number, number, number];

type SessionUser = {
  client_id?: string;
  client_type?: "user" | "guest";
  user_id: string;
  username: string;
};

type SessionInfo = {
  session_id: string;
  scene_name: string;
  folder_id: string;
  max_users: number;
  creator_user_id: string;
  created_at: string;
  country_code: string;
  continent_code: string;
  clients: SessionUser[];
};

/** GLOBAL VAR DECLARATIONS */

declare var SDK3DVerse_ClientDisplay_Ext: {
  showClientAvatars(params: {
    radius: number;
    getClientAvatarSrc(clientAvatarOpts: {
      client: { clientUUID: string };
      color: string;
    }): string;
    getClientDisplayName(client: { clientUUID: string }): string;
  }): void;
};

declare var SDK3DVerse: {
  notifier: EventEmitter;
  webAPI: {
    apiURL: string;
  };
  engineAPI: {
    cameraAPI: {
      currentViewportEnabled?: Viewport;
      getActiveViewports(): Viewport[];
      travel(
        viewport: Viewport,
        destPosition: Vec3,
        destOrientation: Vec4,
        speed: number,
      ): void;
    };
    findEntitiesByNames(...names: string[]): Promise<Entity[]>;
    setEntityVisibility(entity: Entity, isVisible: boolean): void;
    playAnimationSequence(sequenceUUID: string): void;
    pauseAnimationSequence(sequenceUUID: string): void;
    stopAnimationSequence(sequenceUUID: string): void;
    commitChanges(): void;
    propagateChanges(): void;
  };
  utils: {
    invalidUUID: string;
  };
  controller_type: {
    none: number;
    fps: number;
    orbit: number;
    fixed: number;
    editor: number;
  };
  findSessions(params: {
    userToken: string;
    sceneUUID: string;
  }): Promise<SessionInfo[]>;
  startSession(params: {
    sceneUUID: string;
    userToken: string;
    canvas: HTMLCanvasElement;
    isTransient?: boolean;
    connectToEditor?: boolean;
    viewportProperties?: object;
    maxDimension?: number;
    onStartingStreamer?: () => void;
    onConnectingToEditor?: () => void;
  }): Promise<void>;
  joinSession(params: {
    sessionId: string;
    userToken: string;
    canvas: HTMLCanvasElement;
    isTransient?: boolean;
    connectToEditor?: boolean;
    viewportProperties?: object;
    maxDimension?: number;
    onStartingStreamer?: () => void;
    onConnectingToEditor?: () => void;
  }): Promise<void>;
  joinOrStartSession(params: {
    sceneUUID: string;
    userToken: string;
    canvas: HTMLCanvasElement;
    constraints?: {
      creator_user_id?: string;
      country_code?: string;
      continent_code?: string;
    };
    isTransient?: boolean;
    connectToEditor?: boolean;
    viewportProperties?: object;
    maxDimension?: number;
    onFindingSession?: () => void;
    onStartingStreamer?: () => void;
    onConnectingToEditor?: () => void;
  }): Promise<void>;
  installExtension<Ext extends SDK3DVerse_ClientDisplay_Ext>(
    ext: Ext,
  ): Promise<Ext>;
  updateControllerSetting(settings): Promise<void>;
};
