  const correctPassword = "1234";

  function login(){
    const pass = document.getElementById("password").value;
    const error = document.getElementById("error");

    if(pass === correctPassword){
      window.location.href = "web.html";
    } else {
      error.innerHTML = "الباسورد غير صحيح";
    }
  }
