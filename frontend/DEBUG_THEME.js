/* DEBUG: Theme System Check */

// Chạy lệnh này trong Browser Console để kiểm tra theme:

// 1. Kiểm tra class trên <html>
console.log('HTML classes:', document.documentElement.className);

// 2. Kiểm tra localStorage
console.log('Saved theme:', localStorage.getItem('dealer-theme'));

// 3. Force toggle theme
document.documentElement.classList.toggle('dark');
console.log('After toggle:', document.documentElement.className);

// 4. Check if Tailwind is loaded
const testDiv = document.createElement('div');
testDiv.className = 'dark:bg-gray-800 bg-white';
document.body.appendChild(testDiv);
const styles = window.getComputedStyle(testDiv);
console.log('Background color (should change with dark mode):', styles.backgroundColor);
document.body.removeChild(testDiv);

// 5. Manual fix nếu cần
// document.documentElement.classList.add('dark');
