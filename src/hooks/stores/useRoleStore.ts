import { CreateRoleDto, ResponseRoleDto, UpdateRoleDto } from '@/types';
import { Permission } from '@/types/permission';
import { create } from 'zustand';

interface RoleStoreData {
  response?: ResponseRoleDto;
  createDto: CreateRoleDto;
  updateDto: UpdateRoleDto;
  createDtoErrors: Record<string, string[]>;
  updateDtoErrors: Record<string, string[]>;
}

export interface RoleStore extends RoleStoreData {
  set: <T>(name: keyof RoleStoreData, value: T) => void;
  setNested: <T>(path: string, value: T) => void;
  addPermission: (permission: Permission, dto: 'create' | 'update') => void;
  removePermission: (permissionId: string, dto: 'create' | 'update') => void;
  isPermissionSelected: (permissionId: string, dto: 'create' | 'update') => boolean;
  reset: () => void;
}

const initialState: RoleStoreData = {
  createDto: {
    label: '',
    description: '',
    permissions: []
  },
  updateDto: {
    label: '',
    description: '',
    permissions: []
  },
  createDtoErrors: {},
  updateDtoErrors: {}
};

export const useRoleStore = create<RoleStore>((set, get) => ({
  ...initialState,

  set: (name, value) => {
    set((state) => ({
      ...state,
      [name]: value
    }));
  },

  setNested: (path, value) => {
    set((state) => {
      const keys = path.split('.');
      const newState = { ...state };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let current: any = newState;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (typeof current[key] !== 'object' || current[key] === null) {
          current[key] = {};
        } else {
          current[key] = { ...current[key] };
        }
        current = current[key];
      }

      current[keys[keys.length - 1]] = value;

      return newState;
    });
  },

  addPermission: (permission, dto) => {
    set((state) => {
      const dtoKey = dto === 'create' ? 'createDto' : 'updateDto';
      const permissions = state[dtoKey].permissions || [];
      const permissionIdStr = permission.id?.toString() || '';
      if (!permissions.find((p) => p.permissionId?.toString() === permissionIdStr)) {
        return {
          ...state,
          [dtoKey]: {
            ...state[dtoKey],
            permissions: [...permissions, { permissionId: permissionIdStr }]
          }
        };
      }
      return state;
    });
  },

  removePermission: (permissionId, dto) => {
    set((state) => {
      const dtoKey = dto === 'create' ? 'createDto' : 'updateDto';
      const permissions = state[dtoKey].permissions || [];
      return {
        ...state,
        [dtoKey]: {
          ...state[dtoKey],
          permissions: permissions.filter((p) => p.permissionId?.toString() !== permissionId)
        }
      };
    });
  },

  isPermissionSelected: (permissionId, dto) => {
    const dtoKey = dto === 'create' ? 'createDto' : 'updateDto';
    const permissions = get()[dtoKey].permissions || [];
    return permissions.some((p) => p.permissionId?.toString() === permissionId);
  },

  reset: () => {
    set({ ...initialState });
  }
}));
