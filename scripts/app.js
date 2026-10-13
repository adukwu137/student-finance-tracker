export const validators = {
    isValidDescription(desc) {
        const regex = /^[a-zA-Z0-9\s.,'-]+$/;
        return regex.test(desc.trim());
    },
    isValidAmount(amount) {
        const num = parseFloat(amount);
        return !isNaN(num) && num > 0;
    },
    isValidDate(dateStr) {
        return dateStr !== '' && !isNaN(new Date(dateStr).getTime());
    },
    isValidCategory(category) {
    const validCategories = ['Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other'];
    return validCategories.includes(category);
  },
};

export function clearInputError(inputElement) {
  inputElement.style.borderColor = '#E5E7EB';
  const parent = inputElement.parentElement;
  const errorMsg = parent.querySelector('.error-feedback');
  if (errorMsg) errorMsg.remove();
}

export function showInputError(inputElement, message) {
  inputElement.style.borderColor = '#DC2626';
  const parent = inputElement.parentElement;
  let errorMsg = parent.querySelector('.error-feedback');
  if (!errorMsg) {
    errorMsg = document.createElement('div');
    errorMsg.className = 'error-feedback';
    errorMsg.style.color = '#DC2626';
    errorMsg.style.fontSize = '0.8rem';
    errorMsg.style.marginTop = '0.25rem';
    parent.appendChild(errorMsg);
  }
  errorMsg.textContent = message;
}