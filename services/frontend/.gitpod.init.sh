sed -i "s/protocol: 'ws',/protocol: window.location.protocol === 'https:' ? 'wss' : 'ws',/" /workspace/marcopeg-hasura/services/frontend/node_modules/react-dev-utils/webpackHotDevClient.js
