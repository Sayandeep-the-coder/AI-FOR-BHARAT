import { pickupService } from '@/services/pickup.service';
import { ConfirmPickupPayload, PickupRequest } from '@/types/pickup.types';
import { NearbyKabadiwalla } from '@/types/user.types';
import { create } from 'zustand';

interface PickupState {
    activePickup: PickupRequest | null;
    myPickups: PickupRequest[];
    nearbyKabadiwallas: NearbyKabadiwalla[];
    pendingRequests: PickupRequest[];
    todayRoute: PickupRequest[];
    isLoading: boolean;
    error: string | null;
}

interface PickupActions {
    setActivePickup: (pickup: PickupRequest | null) => void;
    setMyPickups: (pickups: PickupRequest[]) => void;
    updatePickupStatus: (id: string, status: PickupRequest['status']) => void;
    setNearbyKabadiwallas: (kabadiwallas: NearbyKabadiwalla[]) => void;
    setPendingRequests: (requests: PickupRequest[]) => void;
    setTodayRoute: (pickups: PickupRequest[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    // Async Actions
    fetchTodayRoute: () => Promise<void>;
    fetchPendingRequests: (lat: number, lng: number) => Promise<void>;
    fetchMyPickups: (role: 'citizen' | 'kabadiwalla') => Promise<void>;
    fetchPickupById: (id: string) => Promise<void>;
    acceptPickupAction: (id: string) => Promise<void>;
    confirmPickupAction: (id: string, payload: ConfirmPickupPayload) => Promise<void>;

    reset: () => void;
}

const initialState: PickupState = {
    activePickup: null,
    myPickups: [],
    nearbyKabadiwallas: [],
    pendingRequests: [],
    todayRoute: [],
    isLoading: false,
    error: null,
};

export const usePickupStore = create<PickupState & PickupActions>((set, get) => ({
    ...initialState,

    setActivePickup: (pickup) => set({ activePickup: pickup }),

    setMyPickups: (pickups) => set({ myPickups: pickups }),

    updatePickupStatus: (id, status) => {
        const { activePickup, myPickups, todayRoute, pendingRequests } = get();
        if (activePickup?._id === id) {
            set({ activePickup: { ...activePickup, status } });
        }
        set({
            myPickups: myPickups.map((p) =>
                p._id === id ? { ...p, status } : p
            ),
            todayRoute: todayRoute.map((p) =>
                p._id === id ? { ...p, status } : p
            ),
            pendingRequests: pendingRequests.filter((p) =>
                p._id !== id || status === 'requested'
            ),
        });
    },

    setNearbyKabadiwallas: (kabadiwallas) => set({ nearbyKabadiwallas: kabadiwallas }),
    setPendingRequests: (requests) => set({ pendingRequests: requests }),
    setTodayRoute: (pickups) => set({ todayRoute: pickups }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),

    fetchTodayRoute: async () => {
        set({ isLoading: true, error: null });
        try {
            const pickups = await pickupService.getTodayRoute();
            set({ todayRoute: pickups, isLoading: false });
        } catch (err: any) {
            set({ error: err.message || 'Failed to fetch today\'s route', isLoading: false });
        }
    },

    fetchPendingRequests: async (lat, lng) => {
        set({ isLoading: true, error: null });
        try {
            const requests = await pickupService.getNearbyRequests(lat, lng);
            set({ pendingRequests: requests, isLoading: false });
        } catch (err: any) {
            set({ error: err.message || 'Failed to fetch pending requests', isLoading: false });
        }
    },

    fetchMyPickups: async (role) => {
        set({ isLoading: true, error: null });
        try {
            const data = await pickupService.getPickupHistory(role);
            set({ myPickups: data.pickups, isLoading: false });
        } catch (err: any) {
            set({ error: err.message || 'Failed to fetch pickup history', isLoading: false });
        }
    },

    fetchPickupById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const pickup = await pickupService.getPickupById(id);
            set({ activePickup: pickup, isLoading: false });
        } catch (err: any) {
            set({ error: err.message || 'Failed to fetch pickup details', isLoading: false });
        }
    },

    acceptPickupAction: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const updated = await pickupService.acceptPickup(id);
            get().updatePickupStatus(id, updated.status);
            set({ isLoading: false });
        } catch (err: any) {
            set({ error: err.message || 'Failed to accept pickup', isLoading: false });
            throw err;
        }
    },

    confirmPickupAction: async (id, payload) => {
        set({ isLoading: true, error: null });
        try {
            const updated = await pickupService.confirmPickup(id, payload);
            get().updatePickupStatus(id, updated.status);
            set({ isLoading: false });
        } catch (err: any) {
            set({ error: err.message || 'Failed to confirm pickup', isLoading: false });
            throw err;
        }
    },

    reset: () => set(initialState),
}));
