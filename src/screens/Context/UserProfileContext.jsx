import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
  // ✅ Default profile so currency & KYC are never undefined
  const defaultProfile = { currency: "USD", kycVerified: false };

  const [profile, setProfile] = useState(defaultProfile);
  const [loading, setLoading] = useState(true); // ✅ Loading state

  // On app load, fetch stored profile from AsyncStorage
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem("userProfile");
        if (storedProfile) setProfile(JSON.parse(storedProfile));
      } catch (e) {
        console.log("Failed to load profile", e);
      } finally {
        setLoading(false); // ✅ Finish loading
      }
    };
    loadProfile();
  }, []);

  // Save entire profile data to AsyncStorage and update state
  const updateProfile = async (newProfile) => {
    try {
      await AsyncStorage.setItem("userProfile", JSON.stringify(newProfile));
      setProfile(newProfile);
    } catch (e) {
      console.log("Failed to save profile", e);
    }
  };

  // Update only KYC status in existing profile
  const updateKycStatus = async (kycStatus) => {
    // ✅ Handle case where profile is null
    const updatedProfile = { ...(profile || defaultProfile), kycVerified: kycStatus };
    try {
      await AsyncStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
    } catch (e) {
      console.log("Failed to update KYC status", e);
    }
  };

  // Update only currency in existing profile, keep other data intact
  const updateCurrency = async (newCurrency) => {
    try {
      // ✅ Handle case where profile is null
      const updatedProfile = { ...(profile || defaultProfile), currency: newCurrency };
      await AsyncStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
    } catch (e) {
      console.log("Failed to update currency", e);
    }
  };

  // Clear user profile (e.g., on logout)
  const clearProfile = async () => {
    try {
      await AsyncStorage.removeItem("userProfile");
      setProfile(defaultProfile); // ✅ Reset to default instead of null
    } catch (e) {
      console.log("Failed to clear profile", e);
    }
  };

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        loading, // ✅ Added loading state
        updateProfile,
        updateKycStatus,
        updateCurrency,
        clearProfile,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};
