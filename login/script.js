document.getElementById("Login").addEventListener("click", function() {
    const email = document.getElementById("Email").value;
    const password = document.getElementById("Password").value;

    let correctEmail = "admin";
    let correctPass = "12345";

    if(email === correctEmail && password === correctPass) {
        
        window.location.href = "../Home/Home-page.html";
    } else {
        alert("incorrect email or password")
    }
});