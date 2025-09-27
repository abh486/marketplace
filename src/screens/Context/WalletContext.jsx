// src/context/WalletContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import vaultApi from "../../api/vaultApi";  // your vault endpoints
import authApi from "../../api/authApi";    // to get the logged-in user's profile

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);

  const [owner, setOwner] = useState(null);   // 👈 logged-in user profile
  const [balance, setBalance] = useState(0);  // starts at 0 until backend loads
  const [assets, setAssets] = useState([]);
  const [history, setHistory] = useState([]);

  // -------- INITIAL FETCH (user profile + vault data) --------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1️⃣ Get the logged-in user's profile
        const profileRes = await authApi.getProfile();
        setOwner(profileRes?.data?.user || null);

        // 2️⃣ Get the user's vault info
        const vaultRes = await vaultApi.getVaultInfo();
        setBalance(vaultRes?.data?.balance || 0);
        setAssets(vaultRes?.data?.assets || []);
        setHistory(vaultRes?.data?.history || []);
      } catch (err) {
        console.error("Failed to load wallet data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ---------------- DEPOSIT (Cash) ----------------
  const deposit = (amount) => {
    setBalance((prev) => prev + amount);
    const newTx = {
      id: Date.now(),
      type: "Deposit",
      amount,
      date: new Date().toLocaleString(),
      status: "completed",
    };
    setHistory((prev) => [newTx, ...prev]);
  };

  // ---------------- WITHDRAW (Cash) ----------------
  const withdraw = (amount) => {
    if (amount > balance) return false;
    setBalance((prev) => prev - amount);
    const newTx = {
      id: Date.now(),
      type: "Withdraw",
      amount,
      date: new Date().toLocaleString(),
      status: "completed",
    };
    setHistory((prev) => [newTx, ...prev]);
    return true;
  };

  // ---------------- BUY ASSET ----------------
  const buyAsset = (asset, quantity) => {
    const totalCost = (asset.tokenPrice || 0) * quantity;
    if (totalCost > balance) return false;

    setBalance((prev) => prev - totalCost);

    const assetId = asset.id || asset.name;
    setAssets((prev) => {
      const idx = prev.findIndex((a) => a.id === assetId);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx].quantity += quantity;
        return updated;
      }
      return [...prev, { ...asset, quantity, id: assetId }];
    });

    const newTx = {
      id: Date.now(),
      type: "Buy",
      assetName: asset.name,
      token: asset.symbol || asset.name,
      amount: quantity,
      totalCost,
      date: new Date().toLocaleString(),
      status: "completed",
    };
    setHistory((prev) => [newTx, ...prev]);
    return true;
  };

  // ---------------- SELL ASSET ----------------
  const sellAsset = (assetId, quantity, pricePerToken) => {
    setAssets((prev) => {
      const updated = [...prev];
      const idx = updated.findIndex((a) => a.id === assetId);

      if (idx >= 0 && updated[idx].quantity >= quantity) {
        updated[idx].quantity -= quantity;
        if (updated[idx].quantity === 0) updated.splice(idx, 1);

        const totalValue = quantity * pricePerToken;
        setBalance((prev) => prev + totalValue);

        const newTx = {
          id: Date.now(),
          type: "Sell",
          assetId,
          amount: quantity,
          totalValue,
          date: new Date().toLocaleString(),
          status: "completed",
        };
        setHistory((prev) => [newTx, ...prev]);
      }
      return updated;
    });
  };

  // ---------------- SEND (Cash or Token) ----------------
  const sendAsset = (assetId, quantity, toUser) => {
    if (assetId === "cash") {
      if (quantity > balance) return false;
      setBalance((prev) => prev - quantity);
      const newTx = {
        id: Date.now(),
        type: "Send Cash",
        amount: quantity,
        to: toUser,
        date: new Date().toLocaleString(),
        status: "completed",
      };
      setHistory((prev) => [newTx, ...prev]);
    } else {
      setAssets((prev) => {
        const updated = [...prev];
        const idx = updated.findIndex((a) => a.id === assetId);
        if (idx >= 0 && updated[idx].quantity >= quantity) {
          updated[idx].quantity -= quantity;
          if (updated[idx].quantity === 0) updated.splice(idx, 1);
          const newTx = {
            id: Date.now(),
            type: "Send Token",
            assetId,
            amount: quantity,
            to: toUser,
            date: new Date().toLocaleString(),
            status: "completed",
          };
          setHistory((prev) => [newTx, ...prev]);
        }
        return updated;
      });
    }
  };

  // ---------------- RECEIVE (Cash or Token) ----------------
  const receiveAsset = (asset, quantity, fromUser) => {
    if (asset.id === "cash") {
      setBalance((prev) => prev + quantity);
      const newTx = {
        id: Date.now(),
        type: "Receive Cash",
        amount: quantity,
        from: fromUser,
        date: new Date().toLocaleString(),
        status: "completed",
      };
      setHistory((prev) => [newTx, ...prev]);
    } else {
      const assetId = asset.id || asset.name;
      setAssets((prev) => {
        const idx = prev.findIndex((a) => a.id === assetId);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx].quantity += quantity;
          return updated;
        }
        return [...prev, { ...asset, quantity, id: assetId }];
      });
      const newTx = {
        id: Date.now(),
        type: "Receive Token",
        assetName: asset.name,
        token: asset.symbol || asset.name,
        amount: quantity,
        from: fromUser,
        date: new Date().toLocaleString(),
        status: "completed",
      };
      setHistory((prev) => [newTx, ...prev]);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        loading,
        owner,     // 👈 contains the real user object from backend
        balance,
        assets,
        history,
        deposit,
        withdraw,
        buyAsset,
        sellAsset,
        sendAsset,
        receiveAsset,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
