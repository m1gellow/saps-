import { AdminProvider } from '../lib/context/AdminContext';
import { AuthProvider } from '../lib/context/AuthContext';
import { CartProvider } from '../lib/context/CartContext';
import { FavoritesProvider } from '../lib/context/FavoritesContext';
import { FilterProvider } from '../lib/context/FilterContext';
import { ProfileProvider } from '../lib/context/ProfileContext';

export const GlobalProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <ProfileProvider>
            <AdminProvider>
              <FilterProvider>{children}</FilterProvider>
            </AdminProvider>
          </ProfileProvider>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
};
