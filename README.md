# apigen

## Usage

```js
import Apigen from 'apigen';

// Create new api instance with hostname
let api = new Apigen('https://api.mysite.com');

// Create new api endpoint
let updateEvent = api.createEndpoint((opts) => {
  let {id, ...otherOpts} = opts;
  return {
    path: `/event/${id}`,
    method: 'PUT',
    options: otherOpts,
    statusCodes: {
      200: null,
      404: 'Sorry, we could\'t find what you were looking for.',
      500: 'Server Error. Oh No!',
      default: 'Sorry, we seem to be having some difficulties. Please try again later.',
    },
  };
});

// Call api endpoint
updateEvent({id: 23425242, name: 'Party', capacity: 34}, (err, res) => {
	console.log(err, res);
});

```

## License

Copyright 2015 Bodhi5, Inc. All Rights Reserved
