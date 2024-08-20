const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  name: 'mfe1',

  exposes: {
    './flight': './projects/mfe1/src/app/flights/flights.module.ts',
    './flight-summary': './projects/mfe1/src/app/flight-summary/flights-summary.component.ts',
    './flight-detail': './projects/mfe1/src/app/flight-detail/flights-detail.component.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

});
