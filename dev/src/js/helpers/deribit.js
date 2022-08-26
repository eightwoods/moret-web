

const getOptionInstrument() => {
    var msg =
    {
        "jsonrpc": "2.0",
        "id": 7617,
        "method": "public/get_instruments",
        "params": {
            "currency": "BTC",
            "kind": "future",
            "expired": false
        }
    };
    var ws = new WebSocket('wss://test.deribit.com/ws/api/v2');
    ws.onmessage = function (e) {
        // do something with the response...
        console.log('received from server : ', e.data);
    };
    ws.onopen = function () {
        ws.send(JSON.stringify(msg));
    };
}