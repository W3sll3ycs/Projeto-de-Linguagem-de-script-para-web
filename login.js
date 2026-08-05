document.addEventListener('DOMContentLoaded', () => {
  const formLogin = document.getElementById('formLogin');
  const formRegister = document.getElementById('formRegister');
  const togglePassButtons = document.querySelectorAll('.toggle-pass');
  const regPassInput = document.getElementById('regPass');

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const regexRules = {
    length: /.{8,}/,
    upper: /[A-Z]/,
    number: /[0-9]/,
    special: /[^A-Za-z0-9]/
  };

  togglePassButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const eyeShow = button.querySelector('.eye-show');
      const eyeHide = button.querySelector('.eye-hide');

      if (input.type === 'password') {
        input.type = 'text';
        eyeShow.classList.add('hidden');
        eyeHide.classList.remove('hidden');
      } else {
        input.type = 'password';
        eyeShow.classList.remove('hidden');
        eyeHide.classList.add('hidden');
      }
    });
  });

  if (regPassInput) {
    regPassInput.addEventListener('input', () => {
      const val = regPassInput.value;
      const passStrengthContainer = document.getElementById('passStrength');
      const label = document.getElementById('strengthLabel');
      const bars = [
        document.getElementById('sb1'),
        document.getElementById('sb2'),
        document.getElementById('sb3'),
        document.getElementById('sb4')
      ];

      if (val.length === 0) {
        passStrengthContainer.style.display = 'none';
        return;
      }

      passStrengthContainer.style.display = 'flex';
      let score = 0;
      if (regexRules.length.test(val)) score++;
      if (regexRules.upper.test(val)) score++;
      if (regexRules.number.test(val)) score++;
      if (regexRules.special.test(val)) score++;

      bars.forEach(bar => bar.className = 'strength-bar');

      if (score === 1) {
        label.textContent = 'Fraca';
        bars[0].classList.add('weak');
      } else if (score === 2) {
        label.textContent = 'Regular';
        bars[0].classList.add('fair');
        bars[1].classList.add('fair');
      } else if (score === 3) {
        label.textContent = 'Boa';
        bars[0].classList.add('good');
        bars[1].classList.add('good');
        bars[2].classList.add('good');
      } else if (score === 4) {
        label.textContent = 'Forte';
        bars[0].classList.add('strong');
        bars[1].classList.add('strong');
        bars[2].classList.add('strong');
        bars[3].classList.add('strong');
      }
    });
  }

  function setError(groupElement, errorElement, message) {
    groupElement.classList.add('has-error');
    groupElement.classList.remove('is-valid');
    errorElement.textContent = message;
    return false;
  }

  function setValid(groupElement, errorElement) {
    groupElement.classList.remove('has-error');
    groupElement.classList.add('is-valid');
    errorElement.textContent = '';
    return true;
  }

  function executeSubmit(button, successElement, redirectUrl) {
    const btnText = button.querySelector('.btn-text');
    const btnLoader = button.querySelector('.btn-loader');

    button.disabled = true;
    btnText.style.opacity = '0.5';
    btnLoader.classList.remove('hidden');
    btnLoader.style.display = 'inline-block'; 

    setTimeout(() => {
      btnLoader.classList.add('hidden');
      btnLoader.style.display = 'none';
      btnText.style.opacity = '1';
      successElement.classList.remove('hidden');
      successElement.style.display = 'flex';

      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1500);
    }, 2000);
  }

  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const emailInput = document.getElementById('loginEmail');
      const emailGroup = document.getElementById('loginEmailGroup');
      const emailError = document.getElementById('loginEmailError');
      const passInput = document.getElementById('loginPass');
      const passGroup = document.getElementById('loginPassGroup');
      const passError = document.getElementById('loginPassError');

      if (!emailInput.value.trim()) {
        isValid = setError(emailGroup, emailError, 'O e-mail é obrigatório.');
      } else if (!emailRegex.test(emailInput.value.trim())) {
        isValid = setError(emailGroup, emailError, 'Por favor, insira um e-mail válido.');
      } else {
        setValid(emailGroup, emailError);
      }

      if (!passInput.value) {
        isValid = setError(passGroup, passError, 'A senha é obrigatória.');
      } else {
        setValid(passGroup, passError);
      }

      if (isValid) {
        const contaSalva = JSON.parse(localStorage.getItem('usuario_corte_seletivo'));

        if (contaSalva && contaSalva.email === emailInput.value.trim() && contaSalva.senha === passInput.value) {
          localStorage.setItem('sessao_ativa', 'true');
          executeSubmit(document.getElementById('loginSubmit'), document.getElementById('loginSuccess'), 'index.html');
        } else {
          setError(emailGroup, emailError, 'E-mail ou senha incorretos.');
          setError(passGroup, passError, '');
        }
      }
    });
  }

  if (formRegister) {
    formRegister.addEventListener('submit', (e) => {
      e.preventDefault();
      let isFormValid = true;

      const nameInput = document.getElementById('regName');
      const nameGroup = document.getElementById('regNameGroup');
      const nameError = document.getElementById('regNameError');
      const emailInput = document.getElementById('regEmail');
      const emailGroup = document.getElementById('regEmailGroup');
      const emailError = document.getElementById('regEmailError');
      const passInput = document.getElementById('regPass');
      const passGroup = document.getElementById('regPassGroup');
      const passError = document.getElementById('regPassError');
      const pass2Input = document.getElementById('regPass2');
      const pass2Group = document.getElementById('regPass2Group');
      const pass2Error = document.getElementById('regPass2Error');
      const agreeCheck = document.getElementById('agreeTerms');
      const termsError = document.getElementById('termsError');

      if (!nameInput.value.trim()) {
        isFormValid = setError(nameGroup, nameError, 'O nome é obrigatório.');
      } else {
        setValid(nameGroup, nameError);
      }

      if (!emailInput.value.trim()) {
        isFormValid = setError(emailGroup, emailError, 'O e-mail é obrigatório.');
      } else if (!emailRegex.test(emailInput.value.trim())) {
        isFormValid = setError(emailGroup, emailError, 'Insira um e-mail válido.');
      } else {
        setValid(emailGroup, emailError);
      }

      if (!passInput.value) {
        isFormValid = setError(passGroup, passError, 'A senha é obrigatória.');
      } else if (!regexRules.length.test(passInput.value)) {
        isFormValid = setError(passGroup, passError, 'A senha deve conter no mínimo 8 caracteres.');
      } else {
        setValid(passGroup, passError);
      }

      if (!pass2Input.value) {
        isFormValid = setError(pass2Group, pass2Error, 'Confirme sua senha.');
      } else if (pass2Input.value !== passInput.value) {
        isFormValid = setError(pass2Group, pass2Error, 'As senhas não coincidem.');
      } else {
        setValid(pass2Group, pass2Error);
      }

      if (!agreeCheck.checked) {
        termsError.textContent = 'Você deve aceitar os termos para continuar.';
        isFormValid = false;
      } else {
        termsError.textContent = '';
      }

      if (isFormValid) {
        const novoUsuario = {
          nome: nameInput.value.trim(),
          email: emailInput.value.trim(),
          senha: passInput.value
        };

        localStorage.setItem('usuario_corte_seletivo', JSON.stringify(novoUsuario));
        executeSubmit(document.getElementById('registerSubmit'), document.getElementById('registerSuccess'), 'login.html');
      }
    });
  }

  const tickerContainer = document.getElementById('filmTicker');
  if (tickerContainer) {
    const movies = ["O Poderoso Chefão", "Clube da Luta", "Pulp Fiction", "O Pianista", "Senhor dos Anéis: O Retorno do Rei", "O Jogo da Imitação", "Parasita", "Interestelar"];
    const movieString = movies.map(movie => `<span>${movie}</span>`).join('<span class="sep">·</span>');
    tickerContainer.innerHTML = movieString + '<span class="sep">·</span>' + movieString;
  }
});