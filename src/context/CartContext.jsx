import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'fruites_cart_items';
const COUPON_KEY = 'fruites_cart_coupon';

// Umbral de envío gratis en Colombia: $60.000 COP
export const FREE_SHIPPING_THRESHOLD = 60000;
export const SHIPPING_LOCAL = 6000;    // Barranquilla y Soledad
export const SHIPPING_NATIONAL = 12000; // Resto de Colombia

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [destinationCity, setDestinationCity] = useState('Barranquilla');
  const [couponCode, setCouponCode] = useState(() => {
    try {
      return localStorage.getItem(COUPON_KEY) || '';
    } catch {
      return '';
    }
  });
  const [couponDiscountPercent, setCouponDiscountPercent] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  // Guardar en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Error al guardar carrito:', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (couponCode) {
        localStorage.setItem(COUPON_KEY, couponCode);
      } else {
        localStorage.removeItem(COUPON_KEY);
      }
    } catch (e) {
      console.error('Error al guardar cupón:', e);
    }
  }, [couponCode]);

  // Validar cupón activo
  useEffect(() => {
    if (couponCode.toUpperCase() === 'FRUITES10' || couponCode.toUpperCase() === 'TROPICAL10') {
      setCouponDiscountPercent(10);
    } else if (couponCode.toUpperCase() === 'CARIBE15') {
      setCouponDiscountPercent(15);
    } else {
      setCouponDiscountPercent(0);
    }
  }, [couponCode]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  /**
   * Agrega un producto al carrito
   */
  const addItem = (product, quantity = 1, selectedPresentation = null) => {
    const presentation =
      selectedPresentation ||
      (product.presentaciones && product.presentaciones[0]) || {
        gramaje: '40g',
        precio: product.precio || 9500,
      };

    const itemId = `${product.id}-${presentation.gramaje}`;
    const price = typeof presentation.precio === 'number' ? presentation.precio : 9500;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((it) => it.id === itemId);
      if (existingIndex >= 0) {
        const copy = [...prevItems];
        copy[existingIndex].quantity += quantity;
        return copy;
      }
      return [
        ...prevItems,
        {
          id: itemId,
          productId: product.id,
          slug: product.slug,
          nombre: product.nombre,
          fruta: product.fruta,
          colorPrincipal: product.colorPrincipal,
          imagen: product.imagen,
          gramaje: presentation.gramaje,
          precio: price,
          quantity: quantity,
        },
      ];
    });

    showToast(`¡${product.nombre} (${presentation.gramaje}) agregado al carrito!`);
    setIsOpen(true);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, quantity: newQuantity } : it))
    );
  };

  const removeItem = (itemId) => {
    setItems((prev) => prev.filter((it) => it.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode('');
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(COUPON_KEY);
    } catch {}
  };

  const applyCoupon = (code) => {
    const clean = (code || '').trim().toUpperCase();
    if (clean === 'FRUITES10' || clean === 'TROPICAL10') {
      setCouponCode(clean);
      return { success: true, message: '¡Cupón de 10% de descuento aplicado!' };
    }
    if (clean === 'CARIBE15') {
      setCouponCode(clean);
      return { success: true, message: '¡Cupón especial de 15% de descuento aplicado!' };
    }
    return { success: false, message: 'El cupón no es válido o ha expirado.' };
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscountPercent(0);
  };

  // Cálculos monetarios
  const totalCount = items.reduce((sum, it) => sum + it.quantity, 0);
  const subtotal = items.reduce((sum, it) => sum + it.precio * it.quantity, 0);

  const discount = Math.round((subtotal * couponDiscountPercent) / 100);

  const isLocalShipping =
    destinationCity.toLowerCase().includes('barranquilla') ||
    destinationCity.toLowerCase().includes('soledad') ||
    destinationCity.toLowerCase().includes('puerto colombia');

  const baseShipping = isLocalShipping ? SHIPPING_LOCAL : SHIPPING_NATIONAL;
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0 ? 0 : baseShipping;

  const total = Math.max(0, subtotal - discount + shippingFee);

  const amountForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        subtotal,
        discount,
        shippingFee,
        total,
        freeShippingProgress,
        amountForFreeShipping,
        isFreeShipping: subtotal >= FREE_SHIPPING_THRESHOLD,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        toggleCart: () => setIsOpen((prev) => !prev),
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        couponCode,
        couponDiscountPercent,
        applyCoupon,
        removeCoupon,
        destinationCity,
        setDestinationCity,
        toastMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser utilizado dentro de un CartProvider');
  }
  return context;
}
