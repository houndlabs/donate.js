(function() {

  var el = document.getElementsByClassName('donate-button')[0];
  var div = document.createElement('div');
  div.innerHTML = "<iframe scrolling='no' frameborder='0' " +
    "allowtransparency='true' class='donate-button' title='Donate' " +
    "style='width: 51px; height: 22px;' src='" +
    el.getAttribute('href') + "'></iframe>";

  el.parentNode.insertBefore(div.childNodes[0], el);
  el.parentNode.removeChild(el);
})();
