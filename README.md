# VendingMachine

###Objective

Get the snacks.

###Rules

Don't tip the machine too far or you'll get crushed.

###Developers

We are developing a snacks.json file format for submission fo new snacks, following the format:

````json
{
  'name':'Snickers',
  'weight':45,
  'styles': {
    'background':'#ca3',
    'color':'#f00',
    'background-image':'data-url("blabla")'
  }
}
````

This format has yet to be implemented and is open to suggestions.

###Installation

1. `git clone git@github.com:jywarren/vendingmachine.git`
2. `cd vendingmachine`
3. `bower install`
4. For local development: run `./server.py` and `ifconfig` to determine your machine's IP address, then navgate to `http://your-ip:8000/` on a smartphone on the same WiFi net.
5. Get snacks.
