// 1. إنشاء مخزن وهمي (Noop Storage) كخطة بديلة أثناء الـ Build
const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

// 2. إنشاء مخزن حقيقي بيكلم الـ localStorage بتاع المتصفح مباشرة عن طريق Promises
const createBrowserStorage = () => {
  return {
    getItem(key) {
      return Promise.resolve(localStorage.getItem(key));
    },
    setItem(key, value) {
      return Promise.resolve(localStorage.setItem(key, value));
    },
    removeItem(key) {
      return Promise.resolve(localStorage.removeItem(key));
    },
  };
};

// 3. التحقق مما إذا كان الكود يعمل داخل المتصفح أم أثناء الـ Build
const storage = typeof window !== 'undefined' 
  ? createBrowserStorage() 
  : createNoopStorage();

export default storage;