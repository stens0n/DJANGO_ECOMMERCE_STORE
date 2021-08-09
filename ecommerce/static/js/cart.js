var updateBtns = document.getElementsByClassName('update-cart')
let loading = false


for (i = 0; i < updateBtns.length; i++) {
	updateBtns[i]?.addEventListener('click', async function(){
		var productId = this.dataset.product
		var action = this.dataset.action
		var price = Number(this.dataset.price)
		var redirect = this.dataset.redirect

		console.log('productId:', productId, 'Action:', action)
		console.log('USER:', user)


		if (loading === true) return;
			loading = true
			try {
				if (user == 'AnonymousUser'){
						addCookieItem(price, productId, action)
				}else{
					let data = await updateUserOrder(productId, action)
          updateDisplay(data['cartTotal'].toFixed(2),data['cartItems'],productId,action)
				}
			} catch (error) {
				console.log(error)
			}
	})
}

function updateDisplay(total,items,id,action){
	// var cart = JSON.parse(getCookie('cart'))
  var quantity_display = document.getElementById(`quantity_display${id}`)
  var total_amount = document.getElementsByClassName("total_amount")
  var total_items = document.getElementsByClassName("total_items")
  try {
    total_items[0].innerHTML = items
    total_amount[0].innerHTML = total
    if (action == 'add') {
      quantity_display.innerHTML = Number(quantity_display.innerHTML) + 1;
    }else{
      if ((quantity_display.innerHTML - 1) <= 0) {
        return quantity_display.parentNode.parentNode.remove()
      }
      quantity_display.innerHTML = Number(quantity_display.innerHTML) - 1;
    }
    // console.log(cart['order']['get_cart_items'])
  } catch (error) {
    console.info("no display found for quantity")
  }
}

function addCookieItem(price,productId, action){
  console.log('User is not authenticated')

  if (action == 'add'){
    if (cart[productId] == undefined){
      cart[productId] = {'quantity':1}
    }else{
      cart[productId]['quantity'] += 1
    }
    cart['cartItems'] += 1
    cart['cartTotal'] += price
  }

  if (action == 'remove'){
    cart[productId]['quantity'] -= 1
    if (cart[productId]['quantity'] <= 0){
    	console.log('Item should be deleted')
      delete cart[productId];
    }
    cart['cartItems'] -= 1
    cart['cartTotal'] -= price
  }

  try{
    let total = cart['cartTotal']
    cart['cartTotal']=Number(total.toFixed(2))
  }
  catch(e){
      console.log(e)
    }

  console.log('CART:', cart)
  document.cookie ='cart=' + JSON.stringify(cart) + ";domain=;path=/"

  updateCartQuantity(cart['cartItems'])
  updateDisplay(cart['cartTotal'],cart['cartItems'],productId,action)
  loading = false
  // location.reload()
}



function updateUserOrder(productId, action){
  console.log('User is authenticated, sending data...')
    var url = '/update_item/'
    return new Promise(resolve => {
      fetch(url, {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'X-CSRFToken':csrftoken,
        },
        body:JSON.stringify({'productId':productId, 'action':action})
      })
      .then((response) => {
         return response.json();
      })
      .then((data) => {
          // console.log(data)
          updateCartQuantity(data['cartItems'])
          loading = false
          resolve(data)
          // location.reload()
      });
    });
}