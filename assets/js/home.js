let adults = 0;
let kids = 0;

window.changeAdults = function(delta) {
    adults = Math.max(0, adults + delta);
    document.getElementById('adults').textContent = adults;
};

window.changeKids = function(delta) {
    kids = Math.max(0, kids + delta);
    document.getElementById('kids').textContent = kids;
};
