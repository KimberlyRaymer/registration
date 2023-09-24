paypal.Buttons({
    createOrder: function() {
      var SETEC_URL = 'https://mystore.com/api/paypal/set-express-checkout';
  
      return fetch(SETEC_URL, {
        method: 'post',
        headers: {
          'content-type': 'application/json'
        }
      }).then(function(res) {
        return res.json();
      }).then(function(data) {
        return data.token;
      });
    }
  }).render('#paypal-button-container');