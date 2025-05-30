import {create} from 'zustand';

interface FeatureFlagStore {
  isOtpActive: boolean;
  setIsOtpActive: (isActive: boolean) => void;
  // ====================
  isRemoteSignatureActive: boolean;
  setIsRemoteSignatureActive: (isActive: boolean) => void;
}

const useFeatureFlagStore = create<FeatureFlagStore>((set) => ({
  isOtpActive: true,
  setIsOtpActive: (otpIsActive) => set({ isOtpActive: otpIsActive }),
  // ====================
  isRemoteSignatureActive: true,
  setIsRemoteSignatureActive: (isActive) => set({ isRemoteSignatureActive: isActive }),
}));

export default useFeatureFlagStore;