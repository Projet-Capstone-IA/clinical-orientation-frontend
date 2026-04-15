import { useState } from 'react';
import { PreferencesProvider } from './contexts/PreferencesContext';
import { ChatProvider } from './contexts/ChatContext';
import { TopBar } from './components/TopBar/TopBar';
import { Drawer } from './components/Drawer/Drawer';
import { ChatList } from './components/ChatList/ChatList';
import { Composer } from './components/Composer/Composer';
import { FAB } from './components/FAB/FAB';
import { OrientationSheet } from './components/OrientationSheet/OrientationSheet';
import { SearchBar } from './components/SearchBar/SearchBar';
import styles from './App.module.scss';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [orientationSheetOpen, setOrientationSheetOpen] = useState(false);

  return (
    <PreferencesProvider>
      <ChatProvider>
        <div className={styles.app} id="app-root">
          <TopBar
            onMenuClick={() => setDrawerOpen(true)}
            onSearchClick={() => setSearchOpen(true)}
          />
          <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
          <main className={styles.main}>
            <ChatList />
            <Composer />
            <FAB onClick={() => setOrientationSheetOpen(true)} />
          </main>
          <OrientationSheet
            isOpen={orientationSheetOpen}
            onClose={() => setOrientationSheetOpen(false)}
          />
          {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
        </div>
      </ChatProvider>
    </PreferencesProvider>
  );
}

export default App;
