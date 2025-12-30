document.getElementById("Login").addEventListener("click", function() {
    const email = document.getElementById("Email").value;
    const password = document.getElementById("Password").value;

    let correctEmail = "admin";
    let correctPass = "12345";

    if(email === correctEmail && password === correctPass) {
        // Redirect to home page
        window.location.href = "../index.html";
    } else {
        alert("incorrect email or password")
    }
});