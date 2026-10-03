export type AdminDevice = {
  id: string;
  name: string;
  os: string;
  lastSeen: string;
  trusted: boolean;
};

export type AdminState = {
  enabled: boolean;
  lastSync: string | null;
  deviceName: string | null;
  trustedDevices: AdminDevice[];
  privateMode: boolean;
};
