export type ScreenType = 'login' | 'dashboard' | 'map' | 'vehicle_tasks' | 'notifications' | 'profile';

export type TaskStatus = 'completed' | 'in_progress' | 'pending' | 'delayed';

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface OfficerProfile {
  id: string;
  name: string;
  nip: string;
  role: string;
  unit: string;
  shift: string;
  avatarUrl: string;
  zone: string;
  phone: string;
}

export interface VehicleSpecs {
  id: string;
  plateNumber: string;
  vehicleType: string; // e.g., 'Truk Kompaktor (Compactor)'
  capacityVolumeM3: number; // e.g., 6.0 m3
  maxLoadTons: number; // e.g., 6.0 tons
  currentLoadTons: number; // e.g., 3.8 tons
  fuelPercentage: number;
  odometerKm: number;
  hydraulicPressurePsi: number;
  status: 'active' | 'maintenance' | 'standby';
  driverName: string;
  copilotName: string;
  lastServiceDate: string;
}

export interface TPSLocation {
  id: string;
  code: string;
  name: string;
  district: string; // Kecamatan (e.g., Sukolilo, Wonokromo, Rungkut)
  address: string;
  coordinates: {
    lat: number;
    lng: number;
    mapX: number; // 0-100% relative for SVG map representation
    mapY: number; // 0-100% relative for SVG map representation
  };
  capacityM3: number;
  currentVolumeM3: number;
  fillPercentage: number;
  status: 'normal' | 'warning' | 'critical' | 'collected';
  estimatedWasteType: string; // Organik, Anorganik, Residu
  assignedOrder: number;
  taskStatus: TaskStatus;
  arrivalTimeEstimated: string;
  collectionCompletedAt?: string;
  collectedWeightTons?: number;
  notes?: string;
  cctvActive: boolean;
  iotSensorBattery: number;
}

export interface TrafficAlert {
  id: string;
  streetName: string;
  condition: 'heavy' | 'moderate' | 'normal';
  delayMinutes: number;
  coordinates: { mapX: number; mapY: number };
  description: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  severity: AlertSeverity;
  category: 'reroute' | 'capacity' | 'fleet' | 'schedule';
  relatedTpsId?: string;
  isRead: boolean;
  actionRequired?: boolean;
}

export interface RouteStats {
  totalStops: number;
  completedStops: number;
  totalDistanceKm: number;
  remainingDistanceKm: number;
  estimatedRemainingTimeMin: number;
  currentTonsCollected: number;
  totalTargetTons: number;
  currentDestinationId: string;
}
