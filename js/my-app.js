
// Declare namespace
window.myApp = {};

// Declare scope
(function(myApp) {
	// Declare product MODEL
	function Product() {
		var self = this;

		self.sku = ko.observable("");
		self.description = ko.observable("");
		self.price = ko.observable(0.0);
		self.cost = ko.observable(0.0);
		self.quantity = ko.observable(0);
	}
	myApp.Product = Product;

	// Declare list of products VIEW MODEL
	function ProductsViewModel() {
		var self = this;
		
		// product selected by user
		self.selectedProduct = ko.observable(); // like obervable(null)
		
		self.isProductSelected = ko.computed(function() {
			return (self.selectedProduct() ? true : false);
		});		

		// collection of products
		self.productCollection = ko.observableArray([]);
		
		self.listViewSelectedProduct = ko.observable();

		self.listViewSelectedProduct.subscribe(function(newValue) {
			var product = newValue;
			if(product)
				self.selectedProduct(product);
		});
	
		self.addNewProduct = function() {
			var p = new Product();
			self.selectedProduct(p);
		};

		self.doneEditingProduct = function() {
			var p = self.selectedProduct();

			// return when null or already added
			if (!p) return;
			if (self.productCollection.indexOf(p) != -1)
				return;

			self.productCollection.push(p);
			self.selectedProduct(null);
		};

		self.removeProduct = function() {
			var p = self.selectedProduct();

			if (!p) return;
			
			self.selectedProduct(null);
			self.productCollection.remove(p);
		};
		
		
	}
	myApp.ProductsViewModel = ProductsViewModel;

	function App() {
		var self = this;

		self.run = function() {
			var viewModel = new ProductsViewModel();

			ko.applyBindings(viewModel);
		};
	}	
	myApp.App = App;

})(window.myApp);
