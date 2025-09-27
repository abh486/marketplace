// App.jsx (root)
import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { UserProfileProvider } from "./src/screens/Context/UserProfileContext";
import { WalletProvider } from "./src/screens/Context/WalletContext";
import { ThemeProvider } from "./src/Theme/ThemeContext"; // 👈 Add this

const App = () => {
  return (
    <ThemeProvider> {/* 👈 Wrap everything with ThemeProvider */}
      <UserProfileProvider>
        <WalletProvider>
          <AppNavigator />
        </WalletProvider>
      </UserProfileProvider>
    </ThemeProvider>
  );
};

export default App;