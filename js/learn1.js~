
window.learn1App = { };

(function (learn1App) {
	function MySubscribable() {
		var self = this;

		// inherit subscribable
		ko.subscribable.call(this);

		self.demo = function() {
			// subscription for 'change' topic
			self.subscribe(function(arg) {
				console.info('callback for "change" topic');
				console.info('arg = %s', arg);
			});

			self.notifySubscribers("foobar");

			var subscription = self.subscribe(function(arg) {
				console.info('callback for ".net" topic');
				console.info('arg = %s', arg);
			}, self, ".net");

			self.notifySubscribers("foobar1", ".net");
			self.notifySubscribers("foobar2", ".net");

			// dispose subscription
			subscription.dispose();

			self.notifySubscribers("foozbaz3", ".net");
		};
	}
	learn1App.MySubscribable = MySubscribable;
	

	function ObservableArray() {
		var self = this;

		self.myArray = ko.observableArray([]);

		self.demo = function() {
			self.myArray.subscribe(function (newArray) {
				console.info("New array value: ", newArray, ".");
			});

			// change array via observableArray fn extensions
			self.myArray.push(7);

			// change underlying array
			// THIS DOESNT RAISE EVENT - WE MUST WORK THROUGH fn EXTEND METHODS
			// BUT ARRAY IS MODIFIED
			self.myArray().push(8);

			self.myArray.shift();

			// assign new array
			self.myArray([666, 777]);			
		};
	}
	learn1App.ObservableArray = ObservableArray;

	function ExtendingObservable() {
		var self = this;

		// extend functionality of every observable object
		// we can do the same for observableArray
		
		// Use fn to extend functionality - JS pattern used in e.g. jQuery
		ko.observable.fn['toYesNoString'] = function() {
			// this() is value of observable
			return this() ? "yes" : "no";
		};		

		ko.observable.fn['reset'] = function() {
			// modify observable value				
			this(false);
		};

		ko.observableArray.fn['where'] = function(filter) {
			filter = filter || function() { return true; };
			
			var array = this();
			var result = [];

			for(var i = 0, length = array.length; i < length; i++) {
				var item = array[i];
				if(filter(item))
					result.push(item);
			}

			return result;
		};

		self.demo = function() {
			// IMPORTANT OBSERVABLE MUST BE DEFINED AFTER EXTENSION
			// EXTENSIONS DOESNT APPLY TO ALREADY EXISTING OBSERVABLES
		  self.option = ko.observable(true);
		  self.array = ko.observableArray([1,2,3,4,5,6,7,8,9,10]);

			console.info("option.toYesNoString: %s", self.option.toYesNoString());
			self.option.reset();
			console.info("option after reset: ", self.option());

			var onlyEven = self.array.where(function(item) { return (item % 2) == 0; });
			console.info("even items: ", onlyEven);
		};
	}
	learn1App.ExtendingObservable = ExtendingObservable;

	function ComputedObservables(firstName, lastName) {
		var self = this;

		self.firstName = ko.observable(firstName);
		self.lastName = ko.observable(lastName);

		self.fullName = ko.computed(function() {
			// KNOCKOUT for EVERY UPDATE computes observable dependencies.
			// IT IS RECOMMENDED TO USE ALL DEPENDENT OBSERVABLES AT THE
			// BEGINING OF COMPUTED OBSERVABLE FUNCTION
			var first = self.firstName();
			var last = self.lastName();

			// then we can place logic that decides if we need to use
			// all values from other observables.
			
			return first + " " + last;
		});

		self.demo = function() {
			self.fullName.subscribe(function(newFullName) {
				console.info("computed observable changed to: %s.", newFullName);
			});

			self.firstName("marcin");
			self.firstName("anna");
			
			// computable is updated only one for all bolek calls
			self.firstName("bolek");
			self.firstName("bolek");
			self.firstName("bolek");
			
			// if we has use object instead of string computable would have been
			// updated 3 times.
			// we can change this behavior using custom equalityComparer function.
		};
	}
	learn1App.ComputedObservables = ComputedObservables;

	function EqualityComparer() {
		var self = this;

		self.name = ko.observable({ name: 'jenny', surname: 'polack' });
		self.name.equalityComparer = function(a, b) {
			return (a.name == b.name) && (a.surname == b.surname);		
		};

		self.name2 = ko.observable({ name: 'igor', surname: 'kcalop' });
		
		self.demo = function() {
			self.name.subscribe(function(value) {
				console.info("self.name changed to: ", value);
			});
			
			self.name2.subscribe(function(value) {
				console.info("self.name2 changed to: ", value);
			});

			var oldName = self.name();
			self.name(oldName);

			var oldName = self.name2();
			self.name2(oldName);

			// default knockout equality comparer works only with
			// primitive types

			// DONT OVERUSE COMPUTED OBSERVABLES WITH DEFAULT EQ COMPARER
			// THIS CAN LEAD TO LONG UPDATE CALL CHAINS AND SLOW PERFORMANCE
		};
	};
	learn1App.EqualityComparer = EqualityComparer;

	function ComputedAsProtection() {
		var self = this;

		var _count = ko.observable(1);
		self.count = ko.computed({
			read: function() { return _count(); },
			write: function(value) {
				if(value < 0)
					throw Error("value cannot be less than 0");
				_count(value);
			}
		});

		self.demo = function() {
			self.count.subscribe(function(value) {
				console.info("current self.count value is ", value);
			});

			self.count(100);
			try {
				self.count(-100);
			} 
			catch(e) {
				console.info("cannot set count to -100");
				console.error(e.message);
			}

			console.info("count value: ", self.count());
		};
	};
	learn1App.ComputedAsProtection = ComputedAsProtection;

	function KnockoutUtils() {
		var self = this;

		self.koValue = ko.observable(3);
		self.jsValue = 3;

		self.demo = function() {
			// extend copies properties from one object to other
			var from = { foo: "foo", bar: "bar", egg: "egg" };
			var to = { yay: "yay", bar: "old-bar", egg: 3 };

			ko.utils.extend(to, from);
			console.info(to);
			self.printSeparator();			

			// we can use unwrapObservable to get value of bare js object or
			// knockout observable
			var _ko = ko.utils.unwrapObservable(self.koValue);
			var js = ko.utils.unwrapObservable(self.jsValue);

			// in newer version of knockout we can use
			// ko.unwrap(object)

			console.info("ko = %d, js = %d", _ko, js);
			self.printSeparator();

			// knockout has rich array manipulation library
			// functions are in ko.utils namespace
			for(i in ko.utils.range(1, 10)) {
				console.info(i);
			}

			var demoArray = ko.utils.range(1, 10);
			demoArray = ko.utils.arrayMap(demoArray, function(i) { return (i*3); });
			console.info(demoArray);

			demoArray = ko.utils.arrayFilter(demoArray, function(i) { return (i>9); });
			console.info(demoArray);

			// and many more..., you can play with all functions using chrome 
			// js console
		};

		self.printSeparator = function() {
			console.info("-------------------------------------------------");
		};
	};
	learn1App.KnockoutUtils = KnockoutUtils;

	function CustomBinding() {
		var self = this;

		self.yn = ko.observable("yes");

		self.demo = function() {
			ko.bindingHandlers['yesNo'] = {
				init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
					// called once when ko binds to DOM
					console.info("element: ", element);
					console.info("valueAccessor: ", valueAccessor);
					console.info("allBindingsAccessor: ", allBindingsAccessor);
					console.info("viewModel: ", viewModel);
					console.info("bindingContext: ", bindingContext);

					ko.utils.registerEventHandler(element, "change", function() {
						var observable = valueAccessor();

						observable(element.checked ? "yes" : "no");					
					});
				},

				update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
					// called when viewModel value changes

					var value = ko.unwrap(valueAccessor());
					element.checked = (value === "yes");
				}
			};

			// Arguments:
			/*
					element - HTML element with data-bind attribute on which binding is used
					valueAccessor - function that returns value to which we bind, this value
						can be bare js value or ko observable so we must use ko.unwrap().
					allBindingsAccessor - returns objects that contains all bindins with value accessors.
					viewModel - object passed to applyBindings() function
					bindingContext - has $data, $parent and $parents proeprties, important if we do
						with: binding.
			*/

			// Guideline: use init to subscirbe to jQuery events and upate to 
			// update values of elements
			ko.applyBindings(self);
		};
	};
	learn1App.CustomBinding = CustomBinding;

	function App() {
		var self = this;

		self.run = function() {
			// Create viewModels and setup bindings
			$('body').append('app.run');
		};
	}
	learn1App.App = App;

})(window.learn1App);
