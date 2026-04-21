let adults = 0;
let kids = 0;

window.changeAdults = function(delta) {
    adults = Math.max(0, adults + delta);
    document.getElementById('adults').textContent = adults;
    const hiddenAdults = document.getElementById('hidden_adults');
    if (hiddenAdults) hiddenAdults.value = adults;
};

window.changeKids = function(delta) {
    kids = Math.max(0, kids + delta);
    document.getElementById('kids').textContent = kids;
    const hiddenKids = document.getElementById('hidden_kids');
    if (hiddenKids) hiddenKids.value = kids;
};
